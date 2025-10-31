# 🎤 TTS Audio Setup Guide for Mind Express 5

## The Solution

**Let the browser access the microphone, NOT Mind Express 5!**

When the browser has microphone access, it will capture:
- ✅ Your voice
- ✅ Mind Express 5 TTS audio (from speakers)
- ✅ All system sounds

## Setup Instructions

### Step 1: Mind Express 5 Settings
1. Open Mind Express 5
2. **DO NOT enable camera/microphone in ME5**
3. Let ME5 use TTS normally (it will play through speakers)

### Step 2: Join Video Call
1. Open the video call in a browser (Chrome, Edge, or Safari)
2. Enter room code (e.g., ME12345)
3. **Allow camera and microphone** when browser asks
4. The browser will now capture:
   - Video from camera
   - Audio from microphone (including TTS from speakers)

### Step 3: Position for Best Audio
**Option A: External Microphone**
- Place a microphone near the computer speakers
- TTS audio will be picked up clearly

**Option B: Laptop Built-in Mic**
- Increase speaker volume slightly
- Built-in mic will pick up TTS from speakers
- Works best in quiet environment

**Option C: Headset with Mic**
- Use headset for listening to remote person
- Use separate mic near speakers for TTS capture
- Best quality but requires two audio devices

## How It Works

```
Mind Express 5 (TTS) → Speakers → Microphone → Browser → Remote User
```

1. **Mind Express 5** generates TTS audio
2. **Speakers** play the TTS audio
3. **Microphone** captures the TTS audio (+ your voice)
4. **Browser** sends audio to remote users
5. **Remote users** hear the TTS clearly!

## Audio Settings

The app is configured with:
- ❌ Echo Cancellation: **OFF** (so TTS isn't filtered out)
- ❌ Noise Suppression: **OFF** (preserves TTS quality)
- ❌ Auto Gain Control: **OFF** (consistent TTS volume)

This ensures TTS audio comes through clearly without being filtered as "echo."

## Troubleshooting

### TTS Audio Not Heard by Others?

**Check:**
1. ✅ Browser has microphone permission (not ME5)
2. ✅ Speakers are ON and audible
3. ✅ Microphone is close enough to speakers
4. ✅ Speaker volume is adequate (not too quiet)

### Echo or Feedback?

**Solutions:**
1. Lower speaker volume
2. Use headphones (you hear remote person, mic captures TTS)
3. Move microphone slightly away from speakers

### Poor TTS Quality?

**Improve:**
1. Increase speaker volume
2. Move microphone closer to speakers
3. Reduce background noise
4. Use external microphone (better quality)

## Alternative Setups

### Setup A: Single Device (Simplest)
- **Device**: Windows PC with Mind Express 5
- **Browser**: Chrome/Edge on same PC
- **Audio**: Built-in speakers + built-in mic
- **Result**: TTS captured from speakers

### Setup B: Two Devices (Best Quality)
- **Device 1**: Windows PC with Mind Express 5 + external speakers
- **Device 2**: Tablet/Phone for video call
- **Audio**: External mic on Device 2 near Device 1 speakers
- **Result**: Clean TTS capture, no device conflicts

### Setup C: Professional (Highest Quality)
- **Device**: Windows PC with Mind Express 5
- **Audio Out**: Speakers for TTS
- **Audio In**: USB microphone near speakers
- **Monitoring**: Headphones to hear remote person
- **Result**: Studio-quality TTS capture

## Technical Details

### Why This Works
- Browser's `getUserMedia()` captures microphone input
- Microphone picks up all ambient sound (including TTS from speakers)
- With echo cancellation OFF, TTS audio is preserved
- Remote users receive the full audio stream

### Why ME5 Can't Use Mic Directly
- Only one application can access microphone at a time (Windows limitation)
- If ME5 locks the mic, browser can't access it
- Browser needs mic access for WebRTC video calling
- Solution: ME5 uses speakers only, browser uses mic

## Best Practices

1. **Test First**: Join a test call to verify TTS is audible
2. **Adjust Volume**: Find the right speaker volume (loud enough for mic, not too loud for echo)
3. **Quiet Environment**: Reduces background noise in TTS capture
4. **Quality Mic**: Better microphone = clearer TTS capture
5. **Positioning**: Mic should be close to speakers but not touching

## Summary

✅ **DO**: Let browser access camera/microphone
✅ **DO**: Let ME5 play TTS through speakers
✅ **DO**: Position microphone to capture speaker audio
❌ **DON'T**: Enable camera/mic in Mind Express 5
❌ **DON'T**: Use echo cancellation (it's already OFF)

This setup ensures Mind Express 5 TTS audio is transmitted clearly to all remote users in the video call! 🎉
