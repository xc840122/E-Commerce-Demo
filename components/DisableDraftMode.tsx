'use client';

import { useRouter } from "next/navigation";
import { useDraftModeEnvironment } from "next-sanity/hooks";


export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();
  const router = useRouter();

  // Only show the disable draft mode button if we are in draft mode
  if (environment !== "live" && environment !== "unknown") {
    return null;
  }
  const handleClick = async () => {
    await fetch("/draft-mode/disable");
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-white text-black p-2 rounded-md shadow-md"
    >
      Disable Draft Mode
    </button>
  )
}
