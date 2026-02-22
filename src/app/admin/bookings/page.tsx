"use client";

import { useEffect, useState } from "react";
import { getAllBookings, cancelBooking, type Booking } from "@/lib/actions";
import {
  Search,
  Loader2,
  BookOpen,
  Clock,
  CalendarDays,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch {
        toast.error("Error cargando reservas");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filtered = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCancel = async (booking: Booking) => {
    if (!booking.id) return;
    setCancellingId(booking.id);
    try {
      const result = await cancelBooking(booking.id, booking.date, booking.time);
      if (result.success) {
        setBookings((prev) => prev.filter((b) => b.id !== booking.id));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setCancellingId(null);
      setConfirmId(null);
    }
  };

  const formatTimeDisplay = (time: string) => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neon-pink" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservas</h1>
          <p className="text-white/30 text-sm mt-1">
            {bookings.length} reservas en total
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-10 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20 text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
          <BookOpen className="h-10 w-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/25 text-sm">
            {search ? "No se encontraron reservas" : "No hay reservas aún"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Nombre
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Email
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Teléfono
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Fecha
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Horario
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Estilo
                  </th>
                  <th className="text-left text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Nivel
                  </th>
                  <th className="text-right text-white/30 text-[0.65rem] font-semibold uppercase tracking-wider px-5 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 text-white text-sm font-medium">
                      {booking.name}
                    </td>
                    <td className="px-5 py-4 text-white/40 text-sm">
                      {booking.email}
                    </td>
                    <td className="px-5 py-4 text-white/40 text-sm">
                      {booking.phone || "—"}
                    </td>
                    <td className="px-5 py-4 text-white/50 text-sm">
                      {format(
                        parse(booking.date, "yyyy-MM-dd", new Date()),
                        "d MMM yyyy",
                        { locale: es }
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/50 text-sm">
                      {formatTimeDisplay(booking.time)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/50 text-sm">
                        {booking.danceStyle || "—"}
                        {booking.salsaSubStyle
                          ? ` (${booking.salsaSubStyle})`
                          : ""}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-white/50 text-sm">
                        {booking.level || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {confirmId === booking.id ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleCancel(booking)}
                            disabled={cancellingId === booking.id}
                            className="px-3 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-medium hover:bg-red-400/20 transition-colors"
                          >
                            {cancellingId === booking.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/40 text-xs font-medium hover:bg-white/[0.08] transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(booking.id || null)}
                          className="px-3 py-1.5 rounded-lg border border-white/[0.06] text-white/30 text-xs font-medium hover:border-red-400/30 hover:text-red-400 hover:bg-red-400/[0.06] transition-all"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">
                      {booking.name}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {booking.email}
                    </p>
                    {booking.phone && (
                      <p className="text-white/30 text-xs">{booking.phone}</p>
                    )}
                  </div>
                  {confirmId === booking.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCancel(booking)}
                        disabled={cancellingId === booking.id}
                        className="w-8 h-8 rounded-lg bg-red-400/10 border border-red-400/20 flex items-center justify-center text-red-400"
                      >
                        {cancellingId === booking.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(booking.id || null)}
                      className="px-3 py-1.5 rounded-lg border border-white/[0.06] text-white/30 text-xs font-medium hover:border-red-400/30 hover:text-red-400 transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5 text-white/30">
                    <CalendarDays className="h-3 w-3 flex-shrink-0" />
                    {format(
                      parse(booking.date, "yyyy-MM-dd", new Date()),
                      "d MMM yyyy",
                      { locale: es }
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    {formatTimeDisplay(booking.time)}
                  </div>
                  {booking.danceStyle && (
                    <span className="text-white/30">
                      {booking.danceStyle}
                    </span>
                  )}
                  {booking.level && (
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30">
                      {booking.level}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
