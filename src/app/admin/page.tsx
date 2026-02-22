"use client";

import { useEffect, useState } from "react";
import { getAllBookings, type Booking, cancelBooking } from "@/lib/actions";
import { getAvailableDates } from "@/lib/actions";
import {
  CalendarDays,
  Clock,
  Users,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import { format, parse, isAfter, startOfDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allBookings, days] = await Promise.all([
          getAllBookings(),
          getAvailableDates(),
        ]);
        setBookings(allBookings);

        const todayStr = format(new Date(), "yyyy-MM-dd");
        const todaySlots = days.find((d) => d.id === todayStr);
        setAvailableSlots(todaySlots?.availableTimes.length || 0);
      } catch {
        toast.error("Error cargando datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = startOfDay(new Date());
  const weekEnd = addDays(today, 7);

  const upcomingBookings = bookings
    .filter((b) => {
      const bDate = parse(b.date, "yyyy-MM-dd", new Date());
      return isAfter(bDate, today) || format(bDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const thisWeekBookings = upcomingBookings.filter((b) => {
    const bDate = parse(b.date, "yyyy-MM-dd", new Date());
    return bDate <= weekEnd;
  });

  const nextBooking = upcomingBookings[0];

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

  const stats = [
    {
      label: "Total Reservas",
      value: bookings.length,
      icon: Users,
      iconBg: "bg-neon-pink/10 border-neon-pink/20",
      iconText: "text-neon-pink",
    },
    {
      label: "Esta Semana",
      value: thisWeekBookings.length,
      icon: TrendingUp,
      iconBg: "bg-neon-purple/10 border-neon-purple/20",
      iconText: "text-neon-purple",
    },
    {
      label: "Slots Hoy",
      value: availableSlots,
      icon: Clock,
      iconBg: "bg-neon-blue/10 border-neon-blue/20",
      iconText: "text-neon-blue",
    },
    {
      label: "Próxima Clase",
      value: nextBooking
        ? format(parse(nextBooking.date, "yyyy-MM-dd", new Date()), "d MMM", {
            locale: es,
          })
        : "—",
      icon: CalendarDays,
      iconBg: "bg-neon-yellow/10 border-neon-yellow/20",
      iconText: "text-neon-yellow",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/30 text-sm mt-1">
          Resumen de tu estudio de baile
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5 hover:border-white/[0.1] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/30 text-[0.6rem] sm:text-xs font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${stat.iconBg} border flex items-center justify-center`}
                >
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.iconText}`} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Próximas Reservas
        </h2>
        {upcomingBookings.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
            <CalendarDays className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/25 text-sm">
              No hay reservas próximas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.slice(0, 10).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-neon-pink text-xs font-bold leading-none">
                    {format(
                      parse(booking.date, "yyyy-MM-dd", new Date()),
                      "d"
                    )}
                  </span>
                  <span className="text-neon-pink/60 text-[0.6rem] uppercase">
                    {format(
                      parse(booking.date, "yyyy-MM-dd", new Date()),
                      "MMM",
                      { locale: es }
                    )}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {booking.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/20 flex-shrink-0" />
                      <span className="text-white/30 text-xs">
                        {formatTimeDisplay(booking.time)}
                      </span>
                    </div>
                    {booking.danceStyle && (
                      <>
                        <span className="text-white/10 hidden sm:inline">·</span>
                        <span className="text-white/30 text-xs">
                          {booking.danceStyle}
                        </span>
                      </>
                    )}
                    {booking.level && (
                      <>
                        <span className="text-white/10 hidden sm:inline">·</span>
                        <span className="text-white/30 text-xs">
                          {booking.level}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(booking)}
                  disabled={cancellingId === booking.id}
                  className="flex-shrink-0 w-9 h-9 rounded-lg border border-white/[0.06] hover:border-red-400/30 hover:bg-red-400/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all"
                >
                  {cancellingId === booking.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
