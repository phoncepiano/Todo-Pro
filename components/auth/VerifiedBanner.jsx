"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifiedBanner ()
{
  const searchParams = useSearchParams();
  const [ dismissed, setDismissed ] = useState( false );
  const visible = !dismissed && searchParams.get( "verified" ) === "1";

  if ( !visible ) return null;

  return (
    <div className="bg-apple-canvas border-b border-apple-hairline px-4 py-3 text-center">
      <p className="typography-body text-apple-primary">
        Email verified successfully. Welcome to Todo Pro.
        <button
          type="button"
          onClick={ () => setDismissed( true ) }
          className="ml-3 text-apple-ink-muted-80 hover:text-apple-ink"
          aria-label="Dismiss"
        >
          ×
        </button>
      </p>
    </div>
  );
}
