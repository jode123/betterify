import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import React, { Suspense } from "react";

function SettingsContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "account";
  // ... rest of SettingsContent component ... (This part was not provided in the original code)

  return (
    <div>
      {/*Content here based on tab*/}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white">
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Suspense fallback={<div>Loading settings...</div>}>
          <SettingsContent />
        </Suspense>
      </div>
      <Player />
    </div>
  );
}