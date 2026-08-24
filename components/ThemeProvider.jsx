"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { loadTheme, saveTheme } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";

/** @type {readonly ["light", "dark", "system"]} */
const THEME_CYCLE = [ "light", "dark", "system" ];
const THEME_CHANGE_EVENT = "todo-pro-theme-change";

const ThemeContext = createContext( null );

/**
 * @param {() => void} onStoreChange
 * @returns {() => void}
 */
function subscribeTheme ( onStoreChange )
{
  const onStorage = ( event ) =>
  {
    if ( event.key === null || event.key === STORAGE_KEYS.THEME )
    {
      onStoreChange();
    }
  };

  window.addEventListener( "storage", onStorage );
  window.addEventListener( THEME_CHANGE_EVENT, onStoreChange );
  return () =>
  {
    window.removeEventListener( "storage", onStorage );
    window.removeEventListener( THEME_CHANGE_EVENT, onStoreChange );
  };
}

function getThemeSnapshot ()
{
  return loadTheme();
}

function getThemeServerSnapshot ()
{
  return "system";
}

/**
 * @param {() => void} onStoreChange
 * @returns {() => void}
 */
function subscribeSystemPreference ( onStoreChange )
{
  const media = window.matchMedia( "(prefers-color-scheme: dark)" );
  media.addEventListener( "change", onStoreChange );
  return () => media.removeEventListener( "change", onStoreChange );
}

function getSystemIsDarkSnapshot ()
{
  return window.matchMedia( "(prefers-color-scheme: dark)" ).matches;
}

function getSystemIsDarkServerSnapshot ()
{
  return false;
}

/**
 * @param {() => void} _onStoreChange
 * @returns {() => void}
 */
function subscribeIsClient ( _onStoreChange )
{
  return () => {};
}

function getIsClientSnapshot ()
{
  return true;
}

function getIsClientServerSnapshot ()
{
  return false;
}

/**
 * @param {"light"|"dark"|"system"} theme
 */
function notifyThemeChange ( theme )
{
  saveTheme( theme );
  window.dispatchEvent( new Event( THEME_CHANGE_EVENT ) );
}

export function ThemeProvider ( { children } )
{
  const theme = useSyncExternalStore( subscribeTheme, getThemeSnapshot, getThemeServerSnapshot );
  const systemIsDark = useSyncExternalStore(
    subscribeSystemPreference,
    getSystemIsDarkSnapshot,
    getSystemIsDarkServerSnapshot
  );
  const isReady = useSyncExternalStore(
    subscribeIsClient,
    getIsClientSnapshot,
    getIsClientServerSnapshot
  );

  const resolvedTheme = theme === "dark" || ( theme === "system" && systemIsDark ) ? "dark" : "light";

  useEffect( () =>
  {
    if ( !isReady ) return;
    document.documentElement.classList.toggle( "dark", resolvedTheme === "dark" );
  }, [ resolvedTheme, isReady ] );

  const setTheme = useCallback( ( nextTheme ) =>
  {
    notifyThemeChange( nextTheme );
  }, [] );

  const cycleTheme = useCallback( () =>
  {
    const index = THEME_CYCLE.indexOf( theme );
    notifyThemeChange( THEME_CYCLE[ ( index + 1 ) % THEME_CYCLE.length ] );
  }, [ theme ] );

  const value = useMemo(
    () => ( {
      theme,
      resolvedTheme,
      isReady,
      cycleTheme,
      setTheme,
    } ),
    [ theme, resolvedTheme, isReady, cycleTheme, setTheme ]
  );

  return <ThemeContext.Provider value={ value }>{ children }</ThemeContext.Provider>;
}

/**
 * @returns {{
 *   theme: "light"|"dark"|"system",
 *   resolvedTheme: "light"|"dark",
 *   isReady: boolean,
 *   cycleTheme: () => void,
 *   setTheme: (theme: "light"|"dark"|"system") => void,
 * }}
 */
export function useTheme ()
{
  const context = useContext( ThemeContext );

  if ( !context )
  {
    throw new Error( "useTheme must be used within a ThemeProvider" );
  }

  return context;
}
