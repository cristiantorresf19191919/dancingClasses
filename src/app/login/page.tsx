"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neon-pink" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="fixed top-1/4 left-1/3 w-[600px] h-[400px] bg-neon-pink/[0.04] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/3 w-[500px] h-[350px] bg-neon-purple/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Gradient border */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-neon-pink/30 via-neon-purple/10 to-neon-blue/20 pointer-events-none" />

        <div className="relative bg-[#0c0c18] rounded-3xl p-6 sm:p-8 md:p-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-pink/10 border border-neon-pink/20 mb-4">
              <Lock className="h-8 w-8 text-neon-pink" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-white/30 text-sm mt-2">
              Accede al panel de administración
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/35 text-[0.65rem] font-semibold uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="pl-11 pr-11 h-12 rounded-xl bg-white/[0.03] border-white/[0.08] focus:border-neon-pink/40 text-white placeholder:text-white/20"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !email.trim() || !password.trim()}
              className="w-full h-12 rounded-xl text-[0.95rem] font-semibold"
            >
              {submitting && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
