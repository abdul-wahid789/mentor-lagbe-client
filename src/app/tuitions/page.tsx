import { Navbar } from "@/components/layout/Navbar";
import { BrowseTuitionsClient } from "@/components/tuitions/BrowseTuitionsClient";

export default function BrowseTuitionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <BrowseTuitionsClient />
      </main>
    </div>
  );
}