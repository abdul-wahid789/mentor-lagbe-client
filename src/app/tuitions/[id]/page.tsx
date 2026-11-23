import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TuitionDetailsClient } from "@/components/tuitions/TuitionDetailsClient";

interface TuitionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TuitionDetailPage({
  params,
}: TuitionDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <TuitionDetailsClient
          tuitionId={id}
          backHref="/tuitions"
          backLabel="Back to tuitions"
        />
      </main>
      <Footer />
    </div>
  );
}