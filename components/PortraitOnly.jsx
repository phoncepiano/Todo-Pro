"use client";

import { useEffect } from "react";

const PHONE_SHORTEST_SIDE = 520;

function isPhoneLandscape ()
{
  if ( typeof window === "undefined" ) return false;

  const isLandscape =
    window.matchMedia( "(orientation: landscape)" ).matches ||
    window.innerWidth > window.innerHeight;
  const isCoarsePointer = window.matchMedia( "(pointer: coarse)" ).matches;
  const shortestSide = Math.min( window.innerWidth, window.innerHeight );

  return isLandscape && isCoarsePointer && shortestSide <= PHONE_SHORTEST_SIDE;
}

async function lockPortrait ()
{
  if ( !screen.orientation?.lock ) return;

  try
  {
    await screen.orientation.lock( "portrait" );
  } catch
  {
    // Lock is only honored in fullscreen or installed PWAs on some browsers.
  }
}

export default function PortraitOnly ( { children } )
{
  useEffect( () =>
  {
    const updateOrientation = () =>
    {
      document.documentElement.classList.toggle( "landscape-mobile", isPhoneLandscape() );
    };

    updateOrientation();
    const raf = requestAnimationFrame( updateOrientation );
    const timeout = window.setTimeout( updateOrientation, 150 );

    const landscapeQuery = window.matchMedia( "(orientation: landscape)" );
    const coarseQuery = window.matchMedia( "(pointer: coarse)" );

    landscapeQuery.addEventListener( "change", updateOrientation );
    coarseQuery.addEventListener( "change", updateOrientation );
    window.addEventListener( "resize", updateOrientation );
    window.addEventListener( "orientationchange", updateOrientation );
    screen.orientation?.addEventListener?.( "change", updateOrientation );
    window.visualViewport?.addEventListener( "resize", updateOrientation );

    return () =>
    {
      cancelAnimationFrame( raf );
      window.clearTimeout( timeout );
      landscapeQuery.removeEventListener( "change", updateOrientation );
      coarseQuery.removeEventListener( "change", updateOrientation );
      window.removeEventListener( "resize", updateOrientation );
      window.removeEventListener( "orientationchange", updateOrientation );
      screen.orientation?.removeEventListener?.( "change", updateOrientation );
      window.visualViewport?.removeEventListener( "resize", updateOrientation );
      document.documentElement.classList.remove( "landscape-mobile" );
    };
  }, [] );

  useEffect( () =>
  {
    lockPortrait();

    const onActivate = () =>
    {
      lockPortrait();
    };

    const onVisible = () =>
    {
      if ( document.visibilityState === "visible" ) lockPortrait();
    };

    window.addEventListener( "pointerdown", onActivate );
    window.addEventListener( "keydown", onActivate );
    document.addEventListener( "visibilitychange", onVisible );

    return () =>
    {
      window.removeEventListener( "pointerdown", onActivate );
      window.removeEventListener( "keydown", onActivate );
      document.removeEventListener( "visibilitychange", onVisible );
    };
  }, [] );

  return (
    <>
      <div className="portrait-lock-app">{ children }</div>
      <div
        className="portrait-lock-overlay bg-apple-canvas-parchment px-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portrait-only-title"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-apple-hairline bg-apple-canvas">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-apple-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <rect x="7" y="2.5" width="10" height="19" rx="2" />
            <path d="M10 18.5h4" strokeLinecap="round" />
          </svg>
        </div>
        <h2 id="portrait-only-title" className="typography-body-strong text-apple-ink">
          Rotate your device
        </h2>
        <p className="mt-2 max-w-xs typography-caption text-apple-ink-muted-48">
          Todo Pro is designed for portrait mode on mobile. Please turn your phone upright to continue.
        </p>
      </div>
    </>
  );
}
