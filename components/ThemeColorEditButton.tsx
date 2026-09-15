"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Palette } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DEFAULT_CANVAS_HEX, deriveTheme, isValidHex, normalizeHex } from "@/lib/color";

type Step = "checking" | "password" | "picker" | "saving" | "success";

const ACCENT_VAR_NAMES = [
  "--primary",
  "--secondary",
  "--primary-gradient",
  "--primary-strong",
  "--primary-soft",
  "--ring",
] as const;

function applyPreview(hex: string) {
  const derived = deriveTheme(hex, DEFAULT_CANVAS_HEX);
  const root = document.documentElement.style;
  root.setProperty("--primary", derived.primary);
  root.setProperty("--secondary", derived.secondary);
  root.setProperty("--primary-gradient", derived.primaryGradient);
  root.setProperty("--primary-strong", derived.primaryStrong);
  root.setProperty("--primary-soft", derived.primarySoft);
  root.setProperty("--ring", derived.ring);
}

/**
 * Small, discreet palette badge (footer only — never invasive on the public
 * page) that opens the same password-gated modal pattern as the avatar
 * editor, then lets the owner preview a new accent color live before saving
 * it to Vercel Blob (see lib/theme-store.ts). Only the accent tokens ever
 * change here — canvas, surfaces, and text stay fixed.
 */
export function ThemeColorEditButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState("#b70c01");
  const [loggingIn, setLoggingIn] = useState(false);
  const originalVarsRef = useRef<string[] | null>(null);
  const busy = step === "saving" || loggingIn;

  function capturePreviousVars() {
    if (originalVarsRef.current) return;
    const root = document.documentElement.style;
    originalVarsRef.current = ACCENT_VAR_NAMES.map((name) => root.getPropertyValue(name));
  }

  function restorePreviousVars() {
    if (!originalVarsRef.current) return;
    const root = document.documentElement.style;
    ACCENT_VAR_NAMES.forEach((name, i) => root.setProperty(name, originalVarsRef.current![i]));
    originalVarsRef.current = null;
  }

  function resetAndClose() {
    if (busy) return;
    restorePreviousVars();
    setOpen(false);
    setStep("checking");
    setPassword("");
    setError(null);
  }

  async function handleOpen() {
    setOpen(true);
    setStep("checking");
    setError(null);
    capturePreviousVars();

    try {
      const [sessionRes, currentRes] = await Promise.all([
        fetch("/api/admin/session"),
        fetch("/api/theme/current"),
      ]);
      const session = await sessionRes.json();
      const current = await currentRes.json();
      if (current?.primary) setHexInput(current.primary);
      setStep(session.authenticated ? "picker" : "password");
    } catch {
      setStep("password");
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar.");
        return;
      }
      setPassword("");
      setStep("picker");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoggingIn(false);
    }
  }

  function handleColorChange(value: string) {
    setHexInput(value);
    if (isValidHex(value)) applyPreview(normalizeHex(value));
  }

  async function handleSave() {
    if (!isValidHex(hexInput)) {
      setError("Cor inválida. Use um hexadecimal como #B70C01.");
      return;
    }
    setError(null);
    setStep("saving");

    try {
      const res = await fetch("/api/theme/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primary: normalizeHex(hexInput) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Falha ao salvar a cor.");
        setStep("picker");
        return;
      }
      originalVarsRef.current = null; // saved — the preview IS the new committed state now
      setStep("success");
      setTimeout(() => {
        setOpen(false);
        setStep("checking");
        router.refresh();
      }, 900);
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setStep("picker");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Personalizar cor da identidade visual"
        className="flex h-7 w-7 items-center justify-center rounded-full text-muted opacity-60 transition-all duration-[var(--duration-base)] hover:opacity-100 hover:text-primary-strong"
      >
        <Palette size={14} strokeWidth={2} />
      </button>

      <Modal open={open} onClose={resetAndClose} busy={busy} titleId="theme-edit-title">
        {step === "checking" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 size={20} className="animate-spin text-muted" aria-hidden />
            <p className="text-sm text-muted">Verificando acesso…</p>
          </div>
        )}

        {step === "password" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="theme-edit-title" className="font-display text-lg font-semibold text-fg">
                Área restrita
              </h2>
              <p className="text-[0.8125rem] text-muted">
                Digite a senha de administrador para personalizar a cor.
              </p>
            </div>

            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              aria-label="Senha de administrador"
              disabled={loggingIn}
              className="h-11 rounded-[0.85rem] border border-border-strong bg-surface px-3.5 text-sm text-fg outline-none placeholder:text-muted focus-visible:border-primary-strong/60 disabled:opacity-50"
            />

            {error && (
              <p className="flex items-center gap-1.5 text-[0.8125rem] text-primary-strong">
                <AlertCircle size={14} aria-hidden />
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                disabled={loggingIn}
                className="h-11 rounded-full px-4 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={password.length === 0 || loggingIn}
                aria-label={loggingIn ? "Entrando…" : undefined}
                className="flex h-11 min-w-24 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-[0.8125rem] font-semibold text-fg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {loggingIn ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Entrar"}
              </button>
            </div>
          </form>
        )}

        {(step === "picker" || step === "saving") && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="theme-edit-title" className="font-display text-lg font-semibold text-fg">
                Cor da identidade
              </h2>
              <p className="text-[0.8125rem] text-muted">
                A pré-visualização é aplicada na hora. Os demais tons (fundo, texto) não mudam.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border-strong">
                <input
                  type="color"
                  value={isValidHex(hexInput) ? normalizeHex(hexInput) : "#b70c01"}
                  onChange={(e) => handleColorChange(e.target.value)}
                  disabled={busy}
                  aria-label="Selecionar cor"
                  className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] cursor-pointer"
                />
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleColorChange(e.target.value)}
                disabled={busy}
                placeholder="#B70C01"
                aria-label="Valor hexadecimal da cor"
                spellCheck={false}
                className="h-11 flex-1 rounded-[0.85rem] border border-border-strong bg-surface px-3.5 font-mono text-sm text-fg outline-none placeholder:text-muted focus-visible:border-primary-strong/60 disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-[0.8125rem] text-primary-strong">
                <AlertCircle size={14} aria-hidden />
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetAndClose}
                disabled={busy}
                className="h-11 rounded-full px-4 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={busy || !isValidHex(hexInput)}
                aria-label={busy ? "Salvando cor…" : undefined}
                className="flex h-11 min-w-24 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-[0.8125rem] font-semibold text-fg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Salvar cor"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong [animation:var(--animate-pop)]">
              <Check size={20} aria-hidden />
            </span>
            <p id="theme-edit-title" className="text-sm font-medium text-fg">
              Cor atualizada!
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
