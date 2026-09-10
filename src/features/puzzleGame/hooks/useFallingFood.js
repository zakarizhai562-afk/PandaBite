import { useCallback, useEffect, useRef, useState } from 'react';

// Food size/margins in real pixels, used only to keep the food's spawn X and
// its fall boundary safely inside the food area -- not pixel-perfect against
// the food's own CSS clamp() size, just a safe conservative box. Kept tight
// (not overly generous) because the food area itself is only ~250-350px
// tall at common resolutions -- oversized margins here eat most of the
// travel distance and make any fall speed feel much faster than intended.
export const FOOD_SIZE_PX = 90;
const SPAWN_MARGIN_PX = 10;
const BOTTOM_CLEARANCE_PX = 22; // keeps the food from ever visually reaching the baskets below

// Drives one falling food using requestAnimationFrame + delta time (not
// setInterval), with a real pixel position measured against the food area's
// own DOM box -- one consistent coordinate system, not a mix of
// percentages/viewport units/basket coordinates.
//
// `areaEl` must be the actual DOM node (or null), NOT a ref object -- e.g.
// from `const [areaEl, setAreaEl] = useState(null)` + `<div ref={setAreaEl}>`.
// This matters: PuzzleScreen renders a loading splash first, so this hook's
// effects run on mount before .puzzle-food-area exists in the DOM at all. A
// plain useRef's `.current` mutating from null -> the real node doesn't
// re-run any effect, so the very first measurement would permanently cache
// a 0x0 area -- collapsing the fall distance to ~0 and firing onReachBottom
// on literally the first frame, repeatedly, burning through every life in
// milliseconds. Using the DOM node itself as a dependency (via state) makes
// the measurement/observer effects correctly re-run once it actually mounts.
//
// - New food (foodKey changes) or the area becoming available: re-measures
//   and picks a fresh random spawn X near the top.
// - `active`: while true, the single rAF loop advances y by
//   fallSpeedPxPerSec * deltaTime each frame. Set to false to pause it
//   (dragging, paused, not playing, still loading) -- the loop is cancelled,
//   never left running in the background.
// - onReachBottom fires once per fall when y hits the bottom clearance.
// - resetFall(): snaps back to the *same* spawn X, top Y (same food,
//   same original spawn point -- never a new random position).
export function useFallingFood({ areaEl, active, fallSpeedPxPerSec, foodKey, onReachBottom }) {
  const [position, setPosition] = useState({ x: SPAWN_MARGIN_PX, y: SPAWN_MARGIN_PX });
  const positionRef = useRef(position);
  const dimsRef = useRef({ width: 0, height: 0 });
  const reachedBottomRef = useRef(false);
  const rafIdRef = useRef(null);
  const lastTsRef = useRef(null);

  const pickSpawnX = useCallback(() => {
    const { width } = dimsRef.current;
    const minX = SPAWN_MARGIN_PX;
    const maxX = Math.max(minX, width - FOOD_SIZE_PX - SPAWN_MARGIN_PX);
    return minX + Math.random() * (maxX - minX);
  }, []);

  // A new food spawned, or the food area just became available: measure it
  // fresh and pick a new random X. This is the only place a new random X is
  // ever chosen -- resetFall() below reuses the existing spawn X.
  useEffect(() => {
    if (!areaEl) return;
    dimsRef.current = { width: areaEl.clientWidth, height: areaEl.clientHeight };
    const spawn = { x: pickSpawnX(), y: SPAWN_MARGIN_PX };
    positionRef.current = spawn;
    setPosition(spawn);
    reachedBottomRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaEl, foodKey]);

  // Keep the measured area size fresh across window/container resizes
  // (1024x768 up to 1920x1080+) without moving the food mid-fall.
  useEffect(() => {
    if (!areaEl || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) dimsRef.current = { width: entry.contentRect.width, height: entry.contentRect.height };
    });
    observer.observe(areaEl);
    return () => observer.disconnect();
  }, [areaEl]);

  // The single animation loop. Re-created only when active/speed/callback
  // change; always cancels its previous frame first -- never more than one
  // loop alive at a time, never left running after cleanup.
  useEffect(() => {
    if (!active) {
      lastTsRef.current = null;
      return undefined;
    }

    function tick(ts) {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const deltaSeconds = Math.min((ts - lastTsRef.current) / 1000, 0.1); // clamp huge gaps (tab switches)
      lastTsRef.current = ts;

      const { height } = dimsRef.current;
      // The area hasn't been measured yet (0 height) -- wait rather than
      // treating that as "already at the bottom".
      if (height > 0) {
        const { x, y } = positionRef.current;
        const maxY = Math.max(SPAWN_MARGIN_PX, height - FOOD_SIZE_PX - BOTTOM_CLEARANCE_PX);
        const nextY = y + fallSpeedPxPerSec * deltaSeconds;

        if (nextY >= maxY) {
          const clamped = { x, y: maxY };
          positionRef.current = clamped;
          setPosition(clamped);
          if (!reachedBottomRef.current) {
            reachedBottomRef.current = true;
            onReachBottom();
          }
        } else {
          const next = { x, y: nextY };
          positionRef.current = next;
          setPosition(next);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    }

    rafIdRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    };
  }, [active, fallSpeedPxPerSec, onReachBottom]);

  const resetFall = useCallback(() => {
    const { x } = positionRef.current;
    const reset = { x, y: SPAWN_MARGIN_PX };
    positionRef.current = reset;
    setPosition(reset);
    reachedBottomRef.current = false;
  }, []);

  return { position, resetFall, foodSize: FOOD_SIZE_PX };
}
