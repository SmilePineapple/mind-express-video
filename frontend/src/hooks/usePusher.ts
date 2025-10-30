import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import type { PresenceChannel } from 'pusher-js';

interface UsePusherProps {
  licenseId: string;
  nickname: string;
  apiUrl: string;
}

interface UsePusherReturn {
  channel: PresenceChannel | null;
  isConnected: boolean;
  members: Map<string, any>;
  error: string | null;
}

/**
 * Custom hook for Pusher presence channel management
 */
export const usePusher = ({ licenseId, nickname, apiUrl }: UsePusherProps): UsePusherReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState<Map<string, any>>(new Map());
  const [error, setError] = useState<string | null>(null);
  
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);

  useEffect(() => {
    const pusherKey = import.meta.env.VITE_PUSHER_KEY;
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || 'us2';

    if (!pusherKey) {
      setError('Pusher key not configured');
      return;
    }

    console.log('Initializing Pusher...');

    // Initialize Pusher
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: `${apiUrl}/api/pusher-auth`,
      auth: {
        params: {
          nickname
        }
      }
    });

    pusherRef.current = pusher;

    // Subscribe to presence channel for the room
    const channelName = `presence-room-${licenseId}`;
    const channel = pusher.subscribe(channelName) as PresenceChannel;
    channelRef.current = channel;

    // Connection state handlers
    pusher.connection.bind('connected', () => {
      console.log('Pusher connected');
      setIsConnected(true);
      setError(null);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('Pusher disconnected');
      setIsConnected(false);
    });

    pusher.connection.bind('error', (err: any) => {
      console.error('Pusher connection error:', err);
      setError('Connection error. Please refresh.');
    });

    // Presence channel handlers
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      console.log('Subscribed to channel, members:', members.count);
      const memberMap = new Map();
      members.each((member: any) => {
        memberMap.set(member.id, member.info);
      });
      setMembers(memberMap);
    });

    channel.bind('pusher:member_added', (member: any) => {
      console.log('Member added:', member.id);
      setMembers(prev => {
        const newMap = new Map(prev);
        newMap.set(member.id, member.info);
        return newMap;
      });
    });

    channel.bind('pusher:member_removed', (member: any) => {
      console.log('Member removed:', member.id);
      setMembers(prev => {
        const newMap = new Map(prev);
        newMap.delete(member.id);
        return newMap;
      });
    });

    // Cleanup
    return () => {
      console.log('Cleaning up Pusher connection');
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [licenseId, nickname, apiUrl]);

  return {
    channel: channelRef.current,
    isConnected,
    members,
    error
  };
};
