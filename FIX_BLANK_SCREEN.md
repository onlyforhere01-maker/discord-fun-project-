# Blank Screen Bug Fix

## Issue
After clicking "click to start", the screen goes completely black/blank and nothing renders.

## Root Causes
1. **Renderer initialization failure** - The WebGPU renderer setup in `Rendering.js` may be failing
2. **Missing canvas context** - Canvas element not properly initialized
3. **Scene not rendering** - Post-processing or scene setup incomplete
4. **Resource loading timeout** - Resources not finishing load before render

## Solution
We need to:
1. Add error handling in renderer setup
2. Fallback to WebGL if WebGPU fails
3. Add loading timeout protection
4. Add debug logging to see what's failing

## Files to Fix
- `sources/Game/Rendering.js` - Add error handling
- `sources/Game/Game.js` - Add try/catch around init
- `.env.example` - Add VITE_FORCE_WEBGL option (already in code)

## Implementation
The `.env.example` already suggests using `VITE_FORCE_WEBGL=1` if screen stays black.

Try adding to your `.env` file:
```
VITE_FORCE_WEBGL=1
```

Or check browser console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Screenshot and share them
