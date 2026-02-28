import Image from "next/image";
import BookingWidget from "@/components/BookingWidget";
import TypingEffect from "@/components/TypingEffect";
import Nav from "@/components/Nav";
import {
  Music,
  Sparkles,
  ArrowDown,
  Star,
  CalendarDays,
  Clock,
  Zap,
  Check,
  X,
  Instagram,
  Phone,
  Crown,
  Gift,
  Quote,
  Users,
} from "lucide-react";

const HERO_SUBTITLE =
  "Aprende los mejores pasos de Salsa y Bachata con nuestra instructora estrella. Reserva tu clase y conquista la pista.";

const NAV_LINKS = [
  { label: "Clases", href: "#styles" },
  { label: "Profesora", href: "#teacher" },
  { label: "Precios", href: "#pricing" },
  { label: "Reservar", href: "#booking" },
];

const FEATURE_CARDS = [
  {
    title: "Elige tu estilo",
    description: "Salsa y Bachata en un solo lugar, para todos los niveles.",
    icon: Music,
    accent: "text-neon-pink",
    accentBg: "bg-neon-pink/10",
  },
  {
    title: "Reserva en segundos",
    description: "Selecciona fecha y horario online. Sin llamadas.",
    icon: CalendarDays,
    accent: "text-neon-blue",
    accentBg: "bg-neon-blue/10",
  },
  {
    title: "Aprende con la mejor",
    description: "Stefi, instructora certificada con años de experiencia.",
    icon: Star,
    accent: "text-neon-yellow",
    accentBg: "bg-neon-yellow/10",
  },
  {
    title: "Pista lista para ti",
    description: "Estudios equipados y listos para que bailes cómodo.",
    icon: Sparkles,
    accent: "text-neon-purple",
    accentBg: "bg-neon-purple/10",
  },
];

const PRICING_PLANS = [
  {
    name: "Clase Suelta",
    price: "35.000",
    period: "por clase",
    description: "Perfecta para probar sin compromiso",
    features: [
      "1 clase de 1 hora",
      "Elige Salsa o Bachata",
      "Grupal o privada",
    ],
    accent: "neon-blue",
    popular: false,
  },
  {
    name: "Pack Ritmo",
    price: "120.000",
    period: "4 clases",
    description: "El favorito de nuestros alumnos",
    features: [
      "4 clases de 1 hora",
      "Ahorra un 15%",
      "Mezcla estilos libremente",
      "Valido por 30 dias",
    ],
    accent: "neon-pink",
    popular: true,
  },
  {
    name: "Plan Fuego",
    price: "200.000",
    period: "8 clases",
    description: "Para los que van en serio",
    features: [
      "8 clases de 1 hora",
      "Ahorra un 30%",
      "Acceso a todos los estilos",
      "Valido por 60 dias",
      "Clase de prueba gratis para un amigo",
    ],
    accent: "neon-purple",
    popular: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Camila R.",
    text: "Llegue sin saber ni mover las caderas y en 2 meses ya estaba bailando salsa en fiestas. Stefi tiene una paciencia increible y hace que todo se sienta facil.",
    style: "Salsa Casino",
    rating: 5,
    classes: 16,
  },
  {
    name: "Andres M.",
    text: "Mi novia me trajo a rastras y ahora soy yo el que reserva cada semana. La bachata se volvio nuestra cosa de pareja favorita.",
    style: "Bachata",
    rating: 5,
    classes: 24,
  },
  {
    name: "Valentina P.",
    text: "Probe muchas academias antes y ninguna se compara. El sistema de reservas es super facil y Stefi se adapta a tu nivel sin hacerte sentir mal.",
    style: "Salsa En linea",
    rating: 5,
    classes: 12,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden bg-concentric">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-pink/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-[480px] h-[480px] bg-neon-purple/8 rounded-full blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-blue/5 rounded-full blur-[220px]" />
      </div>

      {/* Skip to content — accessibility */}
      <a
        href="#booking"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon-pink focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Ir al contenido principal
      </a>

      {/* Sticky Nav with mobile menu */}
      <Nav />

      {/* ═══════ Hero Section ═══════ */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium mb-8">
          <Sparkles className="h-3 w-3 text-neon-yellow" />
          Salsa & Bachata en tu ciudad
        </div>

        {/* Headline — clear hierarchy: large bold heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-[1.1] mb-5 tracking-tight">
          Aprende a bailar,{" "}
          <span className="gradient-text text-glow">no seas tronco!</span>{" "}
          <span className="inline-block" aria-hidden="true">
            🕺💃
          </span>
        </h1>

        {/* Subtitle — consistent Spanish, typing effect */}
        <p className="text-lg md:text-xl text-white/45 max-w-2xl mb-10 leading-relaxed min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center">
          <TypingEffect
            text={HERO_SUBTITLE}
            speed={35}
            className="inline"
            cursor
          />
        </p>

        {/* Primary CTA — single language, clear action */}
        <a
          href="#booking"
          className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-neon-pink text-white font-semibold text-lg neon-glow transition-all duration-300 hover:scale-[1.02] hover:bg-neon-pink/90"
        >
          Reservar mi clase
          <ArrowDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
        </a>

        {/* Trust stats bar — proximity grouped, clear hierarchy */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10 mt-12 py-4 px-5 sm:px-8 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
          {[
            { value: "500+", label: "Alumnos" },
            { value: "4.9", label: "Rating", star: true },
            { value: "5+", label: "Años" },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-4 sm:gap-6">
              {i > 0 && <div className="w-px h-8 bg-white/[0.08]" />}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {stat.value}
                  {stat.star && (
                    <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neon-yellow fill-neon-yellow" />
                  )}
                </div>
                <div className="text-[0.6rem] sm:text-[0.65rem] text-white/35 mt-0.5 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Feature Cards — with section heading for hierarchy ═══════ */}
      <section
        id="styles"
        className="relative z-10 px-4 md:px-6 pb-20 max-w-6xl mx-auto scroll-mt-24"
      >
        {/* Section heading — hierarchy principle */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-white/35 text-sm">
            Todo lo que necesitas para aprender a bailar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="card-elevated p-6 rounded-2xl flex flex-col gap-3 group/card"
            >
              {/* Icon with colored background — visual differentiation */}
              <div
                className={`w-10 h-10 rounded-xl ${card.accentBg} flex items-center justify-center flex-shrink-0`}
              >
                <card.icon className={`h-5 w-5 ${card.accent}`} />
              </div>
              <h3 className="text-white font-semibold text-base">
                {card.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Teacher Section ═══════ */}
      <section
        id="teacher"
        className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pb-20 scroll-mt-24"
      >
        <div className="card-elevated rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Teacher Image */}
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue opacity-50 blur-lg group-hover:opacity-70 transition-opacity duration-500" />
            <div className="relative w-64 h-80 md:w-72 md:h-[22rem] rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/stefiProfe.png"
                alt="Stefi — Instructora de Salsa & Bachata"
                fill
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-white font-bold text-lg">Stefi</p>
                <p className="text-neon-pink text-sm font-medium">
                  Instructora Principal
                </p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-neon-pink/30 flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Pro
            </div>
          </div>

          {/* Teacher info — accent characters fixed */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Aprende con{" "}
              <span className="gradient-text">la mejor</span>
            </h2>
            <p className="text-white/45 leading-relaxed mb-6 max-w-md">
              Stefi lleva años enseñando los ritmos más calientes de
              Latinoamérica. Su energía y pasión por el baile harán que te
              enamores de la Salsa y la Bachata desde la primera clase.
            </p>
            {/* Descriptive tags instead of duplicate stats — proximity grouping */}
            <div className="flex flex-wrap items-center gap-2.5 justify-center md:justify-start">
              {[
                "Grupal & privada",
                "Todos los niveles",
                "Salsa & Bachata",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs font-medium"
                >
                  <Check className="h-3 w-3 text-neon-pink" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ Comparison Section — strong contrast principle ═══════ */}
      <section className="relative z-10 px-4 md:px-6 pb-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Reserva al instante
          </h2>
          <p className="text-white/35 text-sm">
            Sin llamadas, sin esperas. Tu clase en 3 pasos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* With SoulBalance — positive, highlighted */}
          <div className="relative rounded-2xl p-6 bg-white/[0.04] border border-neon-pink/20 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-neon-pink/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-green-400" />
                </div>
                <span className="text-white font-semibold">
                  Con SoulBalance
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-neon-pink flex-shrink-0" />
                  <span className="text-white/70 text-sm">1–2 minutos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-neon-pink flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    3 pasos simples
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Confirmación inmediata
                  </span>
                </div>
              </div>
              <p className="text-white/30 text-sm mt-5 pt-4 border-t border-white/[0.06]">
                Elige fecha, horario y listo.
              </p>
            </div>
          </div>

          {/* Without — negative, clearly inferior via contrast */}
          <div className="rounded-2xl p-6 bg-white/[0.02] border border-dashed border-white/[0.08]">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center flex-shrink-0">
                <X className="h-3.5 w-3.5 text-red-400/70" />
              </div>
              <span className="text-white/35 font-semibold">
                Método tradicional
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-white/15 flex-shrink-0" />
                <span className="text-white/25 text-sm">Días de espera</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-white/15 flex-shrink-0" />
                <span className="text-white/25 text-sm">Muchos pasos</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="h-4 w-4 text-red-400/40 flex-shrink-0" />
                <span className="text-white/25 text-sm">
                  Llamadas, WhatsApp, esperas
                </span>
              </div>
            </div>
            <p className="text-white/15 text-sm mt-5 pt-4 border-t border-white/[0.04]">
              Coordinación manual e incertidumbre.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ Testimonials Section ═══════ */}
      <section className="relative z-10 px-4 md:px-6 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="text-white/35 text-sm">
            Historias reales de personas que conquistaron la pista
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="card-elevated rounded-2xl p-6 flex flex-col gap-4"
            >
              <Quote className="h-6 w-6 text-neon-pink/30" />
              <p className="text-white/60 text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 text-neon-yellow fill-neon-yellow"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/25 text-xs mt-0.5">{t.style}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <Users className="h-3 w-3 text-neon-pink/50" />
                  <span className="text-white/30 text-xs font-medium">
                    {t.classes} clases
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ Pricing Section ═══════ */}
      <section
        id="pricing"
        className="relative z-10 px-4 md:px-6 pb-20 max-w-5xl mx-auto scroll-mt-24"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Planes y precios
          </h2>
          <p className="text-white/35 text-sm">
            Invierte en ti. Elige el plan que mejor se adapte a tu ritmo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 ${
                plan.popular
                  ? `bg-white/[0.06] border-2 border-${plan.accent}/30 shadow-[0_0_30px_rgba(255,45,123,0.08)]`
                  : "bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-pink text-white text-xs font-bold shadow-lg shadow-neon-pink/25">
                  <Crown className="h-3 w-3" />
                  Mas popular
                </div>
              )}
              <div className="pt-1">
                <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
                <p className="text-white/25 text-xs mt-1">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-white/25 text-sm">COP</span>
              </div>
              <p className="text-white/30 text-xs -mt-2">{plan.period}</p>
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`h-4 w-4 text-${plan.accent} flex-shrink-0 mt-0.5`}
                    />
                    <span className="text-white/50 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={`mt-2 inline-flex items-center justify-center h-11 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.popular
                    ? "bg-neon-pink text-white neon-glow hover:bg-neon-pink/90"
                    : "bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:border-white/[0.15]"
                }`}
              >
                {plan.popular ? "Elegir Plan Ritmo" : `Elegir ${plan.name}`}
              </a>
            </div>
          ))}
        </div>

        {/* Free trial callout */}
        <div className="mt-6 rounded-2xl bg-white/[0.02] border border-dashed border-neon-pink/15 p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center flex-shrink-0">
            <Gift className="h-5 w-5 text-neon-pink" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              Primera clase de prueba gratis
            </p>
            <p className="text-white/30 text-xs mt-0.5">
              Ven, prueba y si te enamoras del baile, elige tu plan. Sin
              compromiso.
            </p>
          </div>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-pink/10 border border-neon-pink/20 text-neon-pink text-sm font-semibold hover:bg-neon-pink/15 transition-colors flex-shrink-0"
          >
            Probar gratis
            <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ═══════ Booking Section ═══════ */}
      <section
        id="booking"
        className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-24 scroll-mt-24"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Reserva tu clase
          </h2>
          <p className="text-white/35">
            Selecciona una fecha y horario que te funcione
          </p>
        </div>

        <BookingWidget />
      </section>

      {/* ═══════ Footer — proper structure with grouping ═══════ */}
      <footer className="relative z-10 border-t border-white/[0.06] pt-12 pb-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            {/* Brand */}
            <div className="max-w-xs">
              <a href="#" className="flex items-center gap-2 mb-3">
                <Music className="h-5 w-5 text-neon-pink" />
                <span className="text-lg font-bold text-white tracking-tight">
                  Soul<span className="text-neon-pink">Balance</span>
                </span>
              </a>
              <p className="text-white/30 text-sm leading-relaxed">
                Clases de Salsa y Bachata para todos los niveles. Aprende a
                bailar y disfruta del ritmo.
              </p>
            </div>

            {/* Link groups — proximity principle */}
            <div className="flex gap-10 sm:gap-16">
              <div>
                <h4 className="text-white/50 text-[0.65rem] font-semibold uppercase tracking-wider mb-4">
                  Navegación
                </h4>
                <div className="space-y-2.5">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block text-white/35 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white/50 text-[0.65rem] font-semibold uppercase tracking-wider mb-4">
                  Contacto
                </h4>
                <div className="space-y-2.5">
                  <a
                    href="https://instagram.com/soulbalance.dance"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/35 hover:text-white text-sm transition-colors duration-200"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/573001234567?text=Hola!%20Quiero%20info%20sobre%20clases%20de%20baile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/35 hover:text-white text-sm transition-colors duration-200"
                  >
                    <Phone className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">
              &copy; {new Date().getFullYear()} SoulBalance. Todos los derechos
              reservados.
            </p>
            <p className="text-white/15 text-xs">
              Hecho con pasión por el baile
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
