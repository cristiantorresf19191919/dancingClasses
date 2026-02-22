"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAvailableDates,
  getTimeSlotsForDate,
  createBooking,
  type CalendarDay,
  type CreateBookingParams,
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
  Check,
  Phone,
  Monitor,
  MapPin,
  ChevronLeft,
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
  const [phone, setPhone] = useState("");
  const [modality, setModality] = useState("");
  const [danceStyle, setDanceStyle] = useState("");
  const [salsaSubStyle, setSalsaSubStyle] = useState("");
  const [level, setLevel] = useState("");
  const [formPage, setFormPage] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const availableDateSet = new Set(availableDays.map((d) => d.id));

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
    setFormPage(1);
  };

  const fireConfetti = async () => {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#ff2d7b", "#b829dd", "#00d4ff", "#ffe14d"];

    // Main burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    // Side bursts with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);
  };

  const handleBooking = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Por favor completa todos los campos personales");
      return;
    }
    if (!modality || !danceStyle || !level) {
      toast.error("Por favor completa los detalles de tu clase");
      return;
    }
    if (danceStyle === "Salsa" && !salsaSubStyle) {
      toast.error("Por favor selecciona un sub-estilo de salsa");
      return;
    }
    if (!selectedDate || !selectedTime) return;

    setSubmitting(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const params: CreateBookingParams = {
        name,
        email,
        phone,
        modality,
        danceStyle,
        level,
        date: dateStr,
        time: selectedTime,
      };
      if (danceStyle === "Salsa" && salsaSubStyle) {
        params.salsaSubStyle = salsaSubStyle;
      }
      const result = await createBooking(params);
      if (result.success) {
        setStep("success");
        toast.success(result.message);
        fireConfetti();
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
    setPhone("");
    setModality("");
    setDanceStyle("");
    setSalsaSubStyle("");
    setLevel("");
    setFormPage(1);
    setTimeSlots([]);
    setLoading(true);
    getAvailableDates().then((days) => {
      setAvailableDays(days);
      setLoading(false);
    });
  };

  const handleFormBack = () => {
    if (formPage === 2) {
      setFormPage(1);
    } else {
      setStep("time");
    }
  };

  const disabledDays = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const today = startOfDay(new Date());
    return isBefore(date, today) || !availableDateSet.has(dateStr);
  };

  const formatTimeDisplay = (time: string) => {
    const parsed = parse(time, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  };

  const steps: { id: BookingStep; label: string; icon: React.ReactNode }[] = [
    { id: "date", label: "Fecha", icon: <CalendarDays className="h-4 w-4" /> },
    { id: "time", label: "Horario", icon: <Clock className="h-4 w-4" /> },
    { id: "form", label: "Datos", icon: <User className="h-4 w-4" /> },
  ];
  const stepIndex = steps.findIndex((s) => s.id === step);

  const isPage1Valid = name.trim() && email.trim() && phone.trim();
  const isPage2Valid =
    modality && danceStyle && level && (danceStyle !== "Salsa" || salsaSubStyle);

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <div className="relative">
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/[0.08] via-transparent to-white/[0.05] pointer-events-none" />
        <div className="relative bg-[#0c0c18] rounded-3xl p-12 flex items-center justify-center min-h-[520px] overflow-hidden">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-neon-pink/20 blur-2xl animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Loader2 className="h-7 w-7 animate-spin text-neon-pink" />
              </div>
            </div>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              Cargando disponibilidad...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main widget ─── */
  return (
    <div className="relative">
      {/* Gradient border */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/[0.1] via-white/[0.03] to-white/[0.06] pointer-events-none" />

      {/* Card body */}
      <div className="relative bg-[#0c0c18] rounded-3xl overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[350px] bg-neon-pink/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-neon-purple/[0.025] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative p-5 md:p-8 lg:p-10">
          {step === "success" ? (
            /* ═══════ Success ═══════ */
            <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-green-400/15 blur-3xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-green-400/10 border-2 border-green-400/25 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
                <Sparkles className="h-5 w-5 text-neon-yellow absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                Reserva Confirmada!
              </h3>
              <div className="inline-flex items-center justify-center flex-wrap gap-2 sm:gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-3">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-neon-pink/70 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-medium capitalize">
                    {selectedDate &&
                      format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neon-pink/70 flex-shrink-0" />
                  <span className="text-white/70 text-sm font-medium">
                    {selectedTime && formatTimeDisplay(selectedTime)}
                  </span>
                </div>
              </div>
              {/* Class details chip */}
              <div className="inline-flex items-center justify-center flex-wrap gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3">
                <span className="text-white/40 text-xs">{danceStyle}</span>
                {salsaSubStyle && (
                  <>
                    <span className="text-white/10">·</span>
                    <span className="text-white/40 text-xs">{salsaSubStyle}</span>
                  </>
                )}
                <span className="text-white/10">·</span>
                <span className="text-white/40 text-xs">{level}</span>
                <span className="text-white/10">·</span>
                <span className="text-white/40 text-xs">{modality}</span>
              </div>
              <p className="text-white/25 text-sm mb-10">
                Nos vemos en la pista de baile
              </p>
              <Button
                variant="outline"
                onClick={handleReset}
                className="px-8 h-11 rounded-xl"
              >
                Agendar otra clase
              </Button>
            </div>
          ) : (
            /* ═══════ Booking flow ═══════ */
            <div className="flex flex-col xl:flex-row gap-8 xl:gap-10">
              {/* ── Left: Calendar ── */}
              <div className="xl:flex-[1.3] min-w-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center flex-shrink-0">
                    <CalendarDays className="h-5 w-5 text-neon-pink" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white leading-tight">
                      Selecciona una fecha
                    </h3>
                    <p className="text-white/25 text-xs mt-0.5">
                      Elige el día que mejor te convenga
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 p-4 sm:p-5 md:p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    locale={es}
                    className="w-full !p-0 relative"
                    classNames={{
                      months: "flex flex-col w-full",
                      month: "w-full",
                      month_caption:
                        "flex justify-center items-center h-10 mb-4",
                      caption_label:
                        "text-base md:text-lg font-semibold text-white capitalize",
                      nav: "absolute top-0 inset-x-0 flex items-center justify-between h-10 z-20 pointer-events-none",
                      button_previous:
                        "pointer-events-auto h-9 w-9 rounded-full hover:bg-white/[0.07] inline-flex items-center justify-center text-white/40 hover:text-white transition-all duration-150",
                      button_next:
                        "pointer-events-auto h-9 w-9 rounded-full hover:bg-white/[0.07] inline-flex items-center justify-center text-white/40 hover:text-white transition-all duration-150",
                      month_grid: "w-full border-collapse",
                      weekdays: "flex mb-1",
                      weekday:
                        "text-white/30 font-medium text-xs flex-1 text-center py-1.5",
                      week: "flex w-full",
                      day: "flex-1 flex items-center justify-center py-[3px]",
                      day_button:
                        "h-10 w-10 md:h-11 md:w-11 lg:h-12 lg:w-12 p-0 font-medium text-sm md:text-[0.9rem] inline-flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer text-white/70 hover:bg-white/[0.07] hover:text-white disabled:opacity-[0.12] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/[0.08] aria-selected:bg-neon-pink aria-selected:text-white aria-selected:font-semibold aria-selected:shadow-[0_0_20px_rgba(255,45,123,0.3)]",
                      selected: "bg-neon-pink text-white",
                      today:
                        "ring-2 ring-inset ring-neon-pink/40 text-neon-pink font-semibold",
                      outside: "booking-outside",
                      disabled: "text-white/[0.08] cursor-not-allowed",
                      hidden: "invisible",
                    }}
                  />
                </div>
              </div>

              {/* ── Right: Info Panel ── */}
              <div className="xl:w-[380px] xl:flex-shrink-0 flex flex-col gap-5">
                {/* Instructor mini card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] group/inst hover:border-white/[0.1] transition-colors">
                  <div className="relative flex-shrink-0">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue opacity-40 blur-md group-hover/inst:opacity-60 transition-opacity" />
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                      <Image
                        src="/stefiProfe.png"
                        alt="Stefi"
                        fill
                        className="object-cover object-top"
                        sizes="56px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold leading-tight">Stefi</p>
                    <p className="text-neon-pink text-xs font-medium mt-0.5">
                      Instructora Principal
                    </p>
                    <p className="text-white/20 text-[0.65rem] mt-1">
                      Salsa & Bachata
                    </p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neon-pink/10 border border-neon-pink/20">
                      <span className="text-neon-pink text-xs font-bold">
                        4.9
                      </span>
                      <span className="text-neon-yellow text-[0.65rem]">
                        ★
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horizontal stepper */}
                <div className="flex items-start px-2 py-2">
                  {steps.map((s, i) => {
                    const isActive = step === s.id;
                    const isCompleted = stepIndex > i;
                    return (
                      <React.Fragment key={s.id}>
                        <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                          <div
                            className={`
                              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ease-out
                              ${
                                isActive
                                  ? "border-neon-pink bg-neon-pink/15 text-neon-pink shadow-[0_0_20px_rgba(255,45,123,0.25)] scale-110"
                                  : isCompleted
                                    ? "border-neon-pink bg-neon-pink text-white"
                                    : "border-white/[0.08] bg-white/[0.02] text-white/25"
                              }
                            `}
                          >
                            {isCompleted ? (
                              <Check className="h-4 w-4" strokeWidth={2.5} />
                            ) : (
                              s.icon
                            )}
                          </div>
                          <span
                            className={`text-[0.65rem] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                              isActive
                                ? "text-white"
                                : isCompleted
                                  ? "text-white/50"
                                  : "text-white/20"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className="flex-1 flex items-center mt-5 px-2">
                            <div
                              className={`w-full h-[2px] rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? "bg-gradient-to-r from-neon-pink to-neon-pink/40"
                                  : "bg-white/[0.05]"
                              }`}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Step content */}
                <div className="flex-1 min-h-0">
                  {/* Date placeholder */}
                  {step === "date" && (
                    <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center">
                      <div className="relative mb-5">
                        <div className="absolute inset-0 rounded-2xl bg-neon-pink/[0.06] blur-xl animate-pulse" />
                        <div className="relative w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                          <CalendarDays className="h-6 w-6 text-white/20" />
                        </div>
                      </div>
                      <p className="text-white/25 text-sm leading-relaxed max-w-[240px]">
                        Elige una fecha en el calendario para ver los horarios
                        disponibles
                      </p>
                    </div>
                  )}

                  {/* Time slot picker */}
                  {step === "time" && (
                    <div className="animate-slide-in">
                      {selectedDate && (
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarDays className="h-3.5 w-3.5 text-neon-pink/50" />
                          <p className="text-white/40 text-sm font-medium capitalize">
                            {format(selectedDate, "EEEE, d MMM yyyy", {
                              locale: es,
                            })}
                          </p>
                        </div>
                      )}
                      {loadingSlots ? (
                        <div className="flex flex-col items-center gap-3 py-10">
                          <Loader2 className="h-6 w-6 animate-spin text-neon-pink/50" />
                          <p className="text-white/20 text-xs">
                            Cargando horarios...
                          </p>
                        </div>
                      ) : timeSlots.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-center">
                          <Clock className="h-8 w-8 text-white/10 mb-3" />
                          <p className="text-white/25 text-sm">
                            No hay horarios para esta fecha
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2.5">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className="group/slot relative px-4 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-neon-pink/25 hover:bg-neon-pink/[0.06] transition-all duration-200 text-left"
                            >
                              <div className="flex items-center gap-2.5">
                                <Clock className="h-3.5 w-3.5 text-white/20 group-hover/slot:text-neon-pink/60 transition-colors" />
                                <span className="text-white/70 group-hover/slot:text-white font-semibold text-sm transition-colors">
                                  {formatTimeDisplay(time)}
                                </span>
                              </div>
                              <p className="text-white/15 group-hover/slot:text-white/30 text-[0.65rem] mt-1.5 ml-6 transition-colors">
                                Salsa & Bachata
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Booking form */}
                  {step === "form" && (
                    <div className="animate-slide-in">
                      {/* Summary chip */}
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neon-pink/[0.05] border border-neon-pink/15 mb-5">
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <CalendarDays className="h-3.5 w-3.5 text-neon-pink/50" />
                          <span className="capitalize">
                            {selectedDate &&
                              format(selectedDate, "EEE d MMM", {
                                locale: es,
                              })}
                          </span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Clock className="h-3.5 w-3.5 text-neon-pink/50" />
                          <span>{formatTimeDisplay(selectedTime)}</span>
                        </div>
                      </div>

                      {/* Form page indicator (2 dots) */}
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            formPage === 1
                              ? "w-6 bg-neon-pink"
                              : "w-1.5 bg-white/15"
                          }`}
                        />
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            formPage === 2
                              ? "w-6 bg-neon-pink"
                              : "w-1.5 bg-white/15"
                          }`}
                        />
                      </div>

                      {/* Page 1: Personal data */}
                      {formPage === 1 && (
                        <div className="animate-slide-in space-y-4">
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                            Datos personales
                          </p>
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Nombre
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                              <Input
                                placeholder="Tu nombre completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-11 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Email
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                              <Input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-11 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Teléfono
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                              <Input
                                type="tel"
                                placeholder="+57 300 123 4567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-11 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20"
                              />
                            </div>
                          </div>
                          <div className="flex gap-3 pt-3">
                            <Button
                              variant="outline"
                              onClick={handleFormBack}
                              className="flex-1 h-12 rounded-xl border-white/[0.08] hover:border-white/15"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Atrás
                            </Button>
                            <Button
                              onClick={() => setFormPage(2)}
                              disabled={!isPage1Valid}
                              className="flex-[2] h-12 rounded-xl text-[0.95rem] font-semibold"
                            >
                              Siguiente
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Page 2: Class details */}
                      {formPage === 2 && (
                        <div className="animate-slide-in space-y-5">
                          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                            Tu clase
                          </p>

                          {/* Modalidad */}
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Modalidad
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setModality("Online")}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                                  modality === "Online"
                                    ? "border-neon-pink/30 bg-neon-pink/10 text-neon-pink"
                                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                                }`}
                              >
                                <Monitor className="h-4 w-4" />
                                Online
                              </button>
                              <button
                                onClick={() => setModality("Presencial")}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                                  modality === "Presencial"
                                    ? "border-neon-pink/30 bg-neon-pink/10 text-neon-pink"
                                    : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                                }`}
                              >
                                <MapPin className="h-4 w-4" />
                                Presencial
                              </button>
                            </div>
                          </div>

                          {/* Estilo de baile */}
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Estilo de baile
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Bachata", "Salsa"].map((style) => (
                                <button
                                  key={style}
                                  onClick={() => {
                                    setDanceStyle(style);
                                    if (style !== "Salsa")
                                      setSalsaSubStyle("");
                                  }}
                                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                                    danceStyle === style
                                      ? "border-neon-pink/30 bg-neon-pink/10 text-neon-pink"
                                      : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                                  }`}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sub-estilo de salsa (conditional) */}
                          {danceStyle === "Salsa" && (
                            <div className="animate-slide-down">
                              <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                                Sub-estilo de salsa
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {["En línea", "Colombiano", "Casino"].map(
                                  (sub) => (
                                    <button
                                      key={sub}
                                      onClick={() => setSalsaSubStyle(sub)}
                                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                                        salsaSubStyle === sub
                                          ? "border-neon-purple/30 bg-neon-purple/10 text-neon-purple"
                                          : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                                      }`}
                                    >
                                      {sub}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Nivel */}
                          <div>
                            <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                              Nivel
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Básico", "Intermedio", "Avanzado"].map(
                                (lvl) => (
                                  <button
                                    key={lvl}
                                    onClick={() => setLevel(lvl)}
                                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                                      level === lvl
                                        ? "border-neon-blue/30 bg-neon-blue/10 text-neon-blue"
                                        : "border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1]"
                                    }`}
                                  >
                                    {lvl}
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3 pt-3">
                            <Button
                              variant="outline"
                              onClick={handleFormBack}
                              className="flex-1 h-12 rounded-xl border-white/[0.08] hover:border-white/15"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Atrás
                            </Button>
                            <Button
                              onClick={handleBooking}
                              disabled={submitting || !isPage2Valid}
                              className="flex-[2] h-12 rounded-xl text-[0.95rem] font-semibold"
                            >
                              {submitting && (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              )}
                              Confirmar Reserva
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
