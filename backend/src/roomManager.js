/**
 * RoomManager - Manages video call rooms and user connections
 */
export class RoomManager {
  constructor() {
    // Map of licenseId -> room data
    this.rooms = new Map();
    // Map of socketId -> licenseId for quick lookup
    this.userRooms = new Map();
  }

  /**
   * Add a user to a room
   */
  addUserToRoom(licenseId, user) {
    if (!this.rooms.has(licenseId)) {
      this.rooms.set(licenseId, {
        licenseId,
        users: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      });
    }

    const room = this.rooms.get(licenseId);
    
    // Check if user already in room (reconnection)
    const existingUserIndex = room.users.findIndex(u => u.socketId === user.socketId);
    if (existingUserIndex !== -1) {
      room.users[existingUserIndex] = user;
    } else {
      room.users.push(user);
    }

    room.lastActivity = new Date().toISOString();
    this.userRooms.set(user.socketId, licenseId);
  }

  /**
   * Remove a user from a room
   */
  removeUserFromRoom(licenseId, socketId) {
    const room = this.rooms.get(licenseId);
    if (!room) return;

    room.users = room.users.filter(u => u.socketId !== socketId);
    this.userRooms.delete(socketId);

    // Delete room if empty
    if (room.users.length === 0) {
      this.rooms.delete(licenseId);
      console.log(`Room ${licenseId} deleted (empty)`);
    }
  }

  /**
   * Get room by license ID
   */
  getRoom(licenseId) {
    return this.rooms.get(licenseId);
  }

  /**
   * Get the room a user is in
   */
  getUserRoom(socketId) {
    const licenseId = this.userRooms.get(socketId);
    if (!licenseId) return null;
    return this.getRoom(licenseId);
  }

  /**
   * Get other users in the same room
   */
  getOtherUsersInRoom(licenseId, socketId) {
    const room = this.rooms.get(licenseId);
    if (!room) return [];
    
    return room.users
      .filter(u => u.socketId !== socketId)
      .map(u => ({
        socketId: u.socketId,
        nickname: u.nickname
      }));
  }

  /**
   * Get room size
   */
  getRoomSize(licenseId) {
    const room = this.rooms.get(licenseId);
    return room ? room.users.length : 0;
  }

  /**
   * Check if room is full (max 5 users)
   */
  isRoomFull(licenseId) {
    return this.getRoomSize(licenseId) >= 5;
  }

  /**
   * Get count of active rooms
   */
  getActiveRoomsCount() {
    return this.rooms.size;
  }

  /**
   * Clean up inactive rooms
   * @param {number} timeoutMinutes - Minutes of inactivity before cleanup
   * @returns {number} Number of rooms cleaned
   */
  cleanInactiveRooms(timeoutMinutes = 30) {
    const now = new Date();
    const timeoutMs = timeoutMinutes * 60 * 1000;
    let cleaned = 0;

    for (const [licenseId, room] of this.rooms.entries()) {
      const lastActivity = new Date(room.lastActivity);
      const inactiveTime = now - lastActivity;

      if (inactiveTime > timeoutMs) {
        // Remove all users from tracking
        room.users.forEach(user => {
          this.userRooms.delete(user.socketId);
        });
        
        this.rooms.delete(licenseId);
        cleaned++;
        console.log(`Cleaned inactive room: ${licenseId} (inactive for ${Math.round(inactiveTime / 60000)} minutes)`);
      }
    }

    return cleaned;
  }

  /**
   * Get all rooms (for debugging)
   */
  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}
