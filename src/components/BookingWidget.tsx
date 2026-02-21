"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAvailableDates,
  getTimeSlotsForDate,
  createBooking,
  type CalendarDay,
} from "@/lib/actions";
import { format, parse, isBefore, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  Clock,
  User,
  Mail,
  CalendarDays,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type BookingStep = "date" | "time" | "form" | "success";

export default function BookingWidget() {
  const [step, setStep] = useState<BookingStep>("date");
  const [availableDays, setAvailableDays] = useState<CalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available dates on mount
  useEffect(() => {
    async function fetchDates() {
      try {
        const days = await getAvailableDates();
        setAvailableDays(days);
      } catch {
        toast.error("Error cargando fechas disponibles");
      } finally {
        setLoading(false);
      }
    }
    fetchDates();
  }, []);

  // Available date strings for quick lookup
  const availableDateSet = new Set(availableDays.map((d) => d.id));

  // When a date is selected, fetch its time slots
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime("");
    setStep("time");

    const dateStr = format(date, "yyyy-MM-dd");
    setLoadingSlots(true);
    try {
      const slots = await getTimeSlotsForDate(dateStr);
      setTimeSlots(slots.sort());
    } catch {
      toast.error("Error cargando horarios");
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("form");
  };

  const handleBooking = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    if (!selectedDate || !selectedTime) return;

    setSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const result = await createBooking(name, email, dateStr, selectedTime);

      if (result.success) {
        setStep("success");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("date");
    setSelectedDate(undefined);
    setSelectedTime("");
    setName("");
    setEmail("");
    setTimeSlots([]);
    // Refetch availability
    setLoading(true);
    getAvailableDates().then((days) => {
      setAvailableDays(days);
      setLoading(false);
    });
  };

  // Determine which dates should be disabled
  const disabledDays = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const today = startOfDay(new Date());
    return isBefore(date, today) || !availableDateSet.has(dateStr);
  };

  const formatTimeDisplay = (time: string) => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-neon-pink" />
          <p className="text-white/60 text-sm">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-3">
        {(["date", "time", "form"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                step === "success" || (["date", "time", "form"].indexOf(step) >= i)
                  ? "bg-neon-pink"
                  : "bg-white/10"
              }`}
            />
          </div>
        ))}
      </div>

      <div className="p-6">
        {step === "success" ? (
          <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
            <div className="relative">
              <CheckCircle2 className="h-16 w-16 text-green-400 mb-4" />
              <Sparkles className="h-6 w-6 text-neon-yellow absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Reserva Confirmada!
            </h3>
            <p className="text-white/60 mb-1">
              {selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
              {" "}a las {selectedTime && formatTimeDisplay(selectedTime)}
            </p>
            <p className="text-white/40 text-sm mb-8">
              Nos vemos en la pista de baile
            </p>
            <Button variant="outline" onClick={handleReset}>
              Agendar otra clase
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Calendar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-5 w-5 text-neon-pink" />
                <h3 className="text-lg font-semibold text-white">
                  Selecciona una fecha
                </h3>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={disabledDays}
                locale={es}
                className="rounded-xl bg-white/[0.02] border border-white/10 p-3"
              />
            </div>

            {/* Right: Time slots or form */}
            <div className="flex-1 min-w-0">
              {step === "date" && (
                <div className="flex items-center justify-center h-full text-white/30 py-12">
                  <div className="text-center">
                    <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="text-sm">
                      Selecciona una fecha para ver los horarios disponibles
                    </p>
                  </div>
                </div>
              )}

              {step === "time" && (
                <div className="animate-slide-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-neon-pink" />
                    <h3 className="text-lg font-semibold text-white">
                      Horarios disponibles
                    </h3>
                  </div>
                  {selectedDate && (
                    <p className="text-white/50 text-sm mb-4">
                      {format(selectedDate, "EEEE, d 'de' MMMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  )}

                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-neon-pink" />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <p className="text-white/40 text-sm py-8 text-center">
                      No hay horarios disponibles para esta fecha
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className="group relative px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02] hover:border-neon-pink/50 hover:bg-neon-pink/10 transition-all duration-200 text-left"
                        >
                          <span className="text-white font-medium text-sm">
                            {formatTimeDisplay(time)}
                          </span>
                          <span className="block text-white/40 text-xs mt-0.5">
                            Salsa & Bachata
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === "form" && (
                <div className="animate-slide-in">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-neon-pink" />
                    <h3 className="text-lg font-semibold text-white">
                      Tus datos
                    </h3>
                  </div>

                  <div className="bg-neon-pink/10 rounded-lg px-4 py-3 mb-5 border border-neon-pink/20">
                    <p className="text-white/80 text-sm">
                      <span className="font-semibold text-white">
                        {selectedDate &&
                          format(selectedDate, "EEE d MMM", { locale: es })}
                      </span>
                      {" "}a las{" "}
                      <span className="font-semibold text-white">
                        {formatTimeDisplay(selectedTime)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/60 text-sm mb-1.5">
                        Nombre
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input
                          placeholder="Tu nombre completo"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-sm mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep("time")}
                        className="flex-1"
                      >
                        Atras
                      </Button>
                      <Button
                        onClick={handleBooking}
                        disabled={submitting || !name.trim() || !email.trim()}
                        className="flex-[2]"
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Confirmar Reserva
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
