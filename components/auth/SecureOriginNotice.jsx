"use client";

import { useSyncExternalStore } from "react";
import { isSecureAuthContext, getSiteOrigin } from "@/lib/auth";

/**
 * @param {() => void} _onStoreChange
 * @returns {() => void}
 */
function subscribe ( _onStoreChange )
{
  return () => {};
}

function getNoticeSnapshot ()
{
  if ( process.env.NODE_ENV !== "development" || isSecureAuthContext() )
  {
    return null;
  }

  return `For secure sign-in, open this app at ${ getSiteOrigin() } instead of your network IP.`;
}

function getServerSnapshot ()
{
  return null;
}

export default function SecureOriginNotice ()
{
  const notice = useSyncExternalStore( subscribe, getNoticeSnapshot, getServerSnapshot );

  if ( !notice ) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center">
      <p className="typography-caption text-amber-900">{ notice }</p>
    </div>
  );
}
