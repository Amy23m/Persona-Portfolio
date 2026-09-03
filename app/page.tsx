"use client";

import { useState } from "react";
import BootScreen from "@/components/BootScreen";
import Desktop from "@/components/Desktop";

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <Desktop />
      {!booted && <BootScreen onBoot={() => setBooted(true)} />}
    </main>
  );
}
