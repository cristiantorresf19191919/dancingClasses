"use client";

import { useEffect, useState } from "react";
import {
  getAllCalendarDays,
  addAvailability,
  removeTimeSlot,
  removeDate,
  type CalendarDay,
} from "@/lib/actions";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const TIME_OPTIONS = [
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

export default function AvailabilityPage() {
  const [days, setDays] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [removingSlot, setRemovingSlot] = useState<string | null>(null);
  const [removingDate, setRemovingDate] = useState<string | null>(null);

  const fetchDays = async () => {
    try {
      const data = await getAllCalendarDays();
      setDays(data);
    } catch {
      toast.error("Error cargando disponibilidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleAdd = async () => {
    if (selectedDates.length === 0 || selectedTimes.length === 0) {
      toast.error("Selecciona al menos una fecha y un horario");
      return;
    }
    setSaving(true);
    try {
      for (const date of selectedDates) {
        const dateStr = format(date, "yyyy-MM-dd");
        await addAvailability(dateStr, selectedTimes);
      }
      toast.success(
        `Disponibilidad agregada para ${selectedDates.length} fecha(s)`
      );
      setSelectedDates([]);
      setSelectedTimes([]);
      await fetchDays();
    } catch {
      toast.error("Error al agregar disponibilidad");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSlot = async (date: string, time: string) => {
    const key = `${date}-${time}`;
    setRemovingSlot(key);
    try {
      await removeTimeSlot(date, time);
      setDays((prev) =>
        prev
          .map((d) =>
            d.id === date
              ? { ...d, availableTimes: d.availableTimes.filter((t) => t !== time) }
              : d
          )
          .filter((d) => d.availableTimes.length > 0)
      );
      toast.success("Horario eliminado");
    } catch {
      toast.error("Error al eliminar horario");
    } finally {
      setRemovingSlot(null);
    }
  };

  const handleRemoveDate = async (date: string) => {
    setRemovingDate(date);
    try {
      await removeDate(date);
      setDays((prev) => prev.filter((d) => d.id !== date));
      toast.success("Fecha eliminada");
    } catch {
      toast.error("Error al eliminar fecha");
    } finally {
      setRemovingDate(null);
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Disponibilidad</h1>
        <p className="text-white/30 text-sm mt-1">
          Gestiona fechas y horarios disponibles
        </p>
      </div>

      {/* Add Availability */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <Plus className="h-5 w-5 text-neon-pink" />
          Agregar Disponibilidad
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar */}
          <div className="lg:flex-1">
            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-3">
              Selecciona fechas
            </label>
            <div className="rounded-2xl bg-black/20 p-4">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={(dates) => setSelectedDates(dates || [])}
                locale={es}
                className="w-full !p-0"
                classNames={{
                  months: "flex flex-col w-full",
                  month: "w-full",
                  month_caption: "flex justify-center items-center h-10 mb-4",
                  caption_label: "text-base font-semibold text-white capitalize",
                  nav: "absolute top-0 inset-x-0 flex items-center justify-between h-10 z-20 pointer-events-none",
                  button_previous:
                    "pointer-events-auto h-9 w-9 rounded-full hover:bg-white/[0.07] inline-flex items-center justify-center text-white/40 hover:text-white transition-all duration-150",
                  button_next:
                    "pointer-events-auto h-9 w-9 rounded-full hover:bg-white/[0.07] inline-flex items-center justify-center text-white/40 hover:text-white transition-all duration-150",
                  month_grid: "w-full border-collapse",
                  weekdays: "flex mb-1",
                  weekday: "text-white/30 font-medium text-xs flex-1 text-center py-1.5",
                  week: "flex w-full",
                  day: "flex-1 flex items-center justify-center py-[3px]",
                  day_button:
                    "h-10 w-10 p-0 font-medium text-sm inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer text-white/70 hover:bg-white/[0.07] hover:text-white aria-selected:bg-neon-pink aria-selected:text-white aria-selected:font-semibold",
                  selected: "bg-neon-pink text-white",
                  today: "ring-2 ring-inset ring-neon-pink/40 text-neon-pink font-semibold",
                  outside: "booking-outside",
                  disabled: "text-white/[0.08] cursor-not-allowed",
                  hidden: "invisible",
                }}
              />
            </div>
          </div>

          {/* Time slots */}
          <div className="lg:w-80">
            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-3">
              Horarios
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OPTIONS.map((time) => (
                <button
                  key={time}
                  onClick={() => toggleTime(time)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    selectedTimes.includes(time)
                      ? "border-neon-pink/30 bg-neon-pink/10 text-neon-pink"
                      : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 inline mr-2" />
                  {formatTimeDisplay(time)}
                </button>
              ))}
            </div>

            <Button
              onClick={handleAdd}
              disabled={
                saving ||
                selectedDates.length === 0 ||
                selectedTimes.length === 0
              }
              className="w-full mt-4 h-11 rounded-xl font-semibold"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Agregar ({selectedDates.length} fechas, {selectedTimes.length}{" "}
              horarios)
            </Button>
          </div>
        </div>
      </div>

      {/* Current Availability */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-neon-pink" />
          Disponibilidad Actual
        </h2>
        {days.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
            <CalendarDays className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/25 text-sm">
              No hay disponibilidad configurada
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((day) => (
              <div
                key={day.id}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-neon-pink text-xs font-bold leading-none">
                        {format(
                          parse(day.id, "yyyy-MM-dd", new Date()),
                          "d"
                        )}
                      </span>
                      <span className="text-neon-pink/60 text-[0.6rem] uppercase">
                        {format(
                          parse(day.id, "yyyy-MM-dd", new Date()),
                          "MMM",
                          { locale: es }
                        )}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium capitalize truncate">
                        {format(
                          parse(day.id, "yyyy-MM-dd", new Date()),
                          "EEEE, d 'de' MMMM yyyy",
                          { locale: es }
                        )}
                      </p>
                      <p className="text-white/25 text-xs mt-0.5">
                        {day.availableTimes.length} horarios disponibles
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDate(day.id)}
                    disabled={removingDate === day.id}
                    className="w-9 h-9 rounded-lg border border-white/[0.06] hover:border-red-400/30 hover:bg-red-400/10 flex items-center justify-center text-white/20 hover:text-red-400 transition-all"
                  >
                    {removingDate === day.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {day.availableTimes.sort().map((time) => {
                    const key = `${day.id}-${time}`;
                    return (
                      <span
                        key={time}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs font-medium"
                      >
                        {formatTimeDisplay(time)}
                        <button
                          onClick={() => handleRemoveSlot(day.id, time)}
                          disabled={removingSlot === key}
                          className="text-white/15 hover:text-red-400 transition-colors"
                        >
                          {removingSlot === key ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
