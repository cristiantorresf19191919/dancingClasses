import Image from "next/image";
import BookingWidget from "@/components/BookingWidget";
import SeedButton from "@/components/SeedButton";
import { Music, Sparkles, ArrowDown, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[200px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <Music className="h-6 w-6 text-neon-pink" />
          <span className="text-lg font-bold text-white tracking-tight">
            Soul<span className="text-neon-pink">Balance</span>
          </span>
        </div>
        <a
          href="#booking"
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          Reservar
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 md:pt-28 md:pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs mb-8">
          <Sparkles className="h-3 w-3 text-neon-yellow" />
          Salsa & Bachata en tu ciudad
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-tight mb-6">
          Aprende a bailar,{" "}
          <span className="gradient-text">no seas tronco!</span>{" "}
          <span className="inline-block animate-pulse">🕺💃</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Aprenda los mejores pasos de Bachata y Salsa. Book your class today
          and own the dance floor.
        </p>

        <a
          href="#booking"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-neon-pink text-white font-semibold text-lg neon-glow transition-all duration-300 hover:scale-105"
        >
          Agendar mi clase / Book Now
          <ArrowDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
        </a>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-12 mt-16">
          {[
            { value: "500+", label: "Alumnos" },
            { value: "4.9", label: "Rating" },
            { value: "5+", label: "Anos" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 pb-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Teacher Image */}
          <div className="relative group flex-shrink-0">
            {/* Outer neon glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue opacity-60 blur-md group-hover:opacity-80 transition-opacity duration-500" />
            {/* Image container */}
            <div className="relative w-64 h-80 md:w-72 md:h-[22rem] rounded-2xl overflow-hidden border-2 border-white/10">
              <Image
                src="/stefiProfe.png"
                alt="Stefi — Instructora de Salsa & Bachata"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient overlay with name */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-white font-bold text-lg">Stefi</p>
                <p className="text-neon-pink text-sm font-medium">Instructora Principal</p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-neon-pink/30 flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              Pro
            </div>
          </div>

          {/* Teacher info */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Aprende con{" "}
              <span className="gradient-text">la mejor</span>
            </h2>
            <p className="text-white/50 leading-relaxed mb-6 max-w-md">
              Stefi lleva anos ensenando los ritmos mas calientes de
              Latinoamerica. Su energia y pasion por el baile haran que te
              enamores de la Salsa y la Bachata desde la primera clase.
            </p>
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-white/40">Alumnos</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-2xl font-bold text-white">
                  4.9 <Star className="h-4 w-4 text-neon-yellow fill-neon-yellow" />
                </div>
                <div className="text-xs text-white/40">Rating</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-xs text-white/40">Anos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section
        id="booking"
        className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pb-24"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Reserva tu clase
          </h2>
          <p className="text-white/40">
            Selecciona una fecha y horario que te funcione
          </p>
        </div>

        <BookingWidget />
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-white/30 text-sm">
          &copy; {new Date().getFullYear()} SoulBalance. Todos los derechos
          reservados.
        </p>
      </footer>

      {/* Dev seed button */}
      <SeedButton />
    </main>
  );
}
