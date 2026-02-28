"use client";

import { useState, useEffect } from "react";
import { Music, X, Menu } from "lucide-react";

const NAV_LINKS = [
  { label: "Clases", href: "#styles" },
  { label: "Profesora", href: "#teacher" },
  { label: "Precios", href: "#pricing" },
  { label: "Reservar", href: "#booking" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/85 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_20px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Music className="h-5 w-5 text-neon-pink group-hover:scale-110 transition-transform duration-200" />
          <span className="text-lg font-bold text-white tracking-tight">
            Soul<span className="text-neon-pink">Balance</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-neon-pink/70 after:rounded-full after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#booking"
          className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-xl bg-neon-pink text-white text-sm font-semibold hover:bg-neon-pink/90 transition-colors neon-glow"
        >
          Reservar
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-white/60 hover:text-white text-base font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 pb-1">
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-5 rounded-xl bg-neon-pink text-white text-center text-sm font-semibold hover:bg-neon-pink/90 transition-colors"
            >
              Reservar clase
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
