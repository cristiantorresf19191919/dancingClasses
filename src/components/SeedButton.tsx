"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedCalendar } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2, Database } from "lucide-react";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedCalendar();
      toast.success("Calendario sembrado con datos de prueba (30 dias)");
      setSeeded(true);
    } catch {
      toast.error("Error al sembrar el calendario");
    } finally {
      setLoading(false);
    }
  };

  if (seeded) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSeed}
        disabled={loading}
        className="bg-black/80 border-neon-purple/50 text-xs"
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin mr-1" />
        ) : (
          <Database className="h-3 w-3 mr-1" />
        )}
        Seed Calendar (Dev)
      </Button>
    </div>
  );
}
