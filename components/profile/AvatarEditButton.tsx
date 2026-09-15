"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Camera, Check, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

type Step = "checking" | "password" | "picker" | "uploading" | "success";

/**
 * Small camera badge overlaid on the profile avatar. Gates the actual photo
 * swap behind a password check (POST /api/admin/login) so only the site
 * owner can replace it — everyone else just sees the badge do nothing
 * harmful if clicked (worst case: a password prompt they can't pass).
 */
export function AvatarEditButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const busy = step === "uploading" || loggingIn;

  function resetAndClose() {
    if (busy) return;
    setOpen(false);
    setStep("checking");
    setPassword("");
    setError(null);
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  async function handleOpen() {
    setOpen(true);
    setStep("checking");
    setError(null);
    try {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setStep(data.authenticated ? "picker" : "password");
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

  function handleFileChosen(chosen: File | undefined) {
    if (!chosen) return;
    setError(null);

    if (!ACCEPTED_TYPES.includes(chosen.type)) {
      setError("Formato não suportado. Use JPG, PNG ou WebP.");
      return;
    }
    if (chosen.size > MAX_BYTES) {
      setError("Arquivo muito grande. O limite é 5MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
  }

  function handleCancelSelection() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  async function handleSave() {
    if (!file) return;
    setError(null);
    setStep("uploading");

    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/avatar/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Falha ao enviar a imagem.");
        setStep("picker");
        return;
      }
      setStep("success");
      setTimeout(() => {
        resetAndClose();
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
        aria-label="Alterar foto de perfil"
        className="group absolute bottom-0.5 right-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-border-strong/80 bg-elevated/80 text-muted opacity-75 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-all duration-[var(--duration-base)] hover:scale-105 hover:border-primary-strong/70 hover:bg-elevated hover:text-primary-strong hover:opacity-100 focus-visible:scale-105 focus-visible:text-primary-strong focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-fg)] active:scale-95 after:absolute after:-inset-2 after:content-['']"
      >
        <Camera size={14} strokeWidth={2} className="transition-transform duration-[var(--duration-base)] group-hover:-rotate-6 group-focus-visible:-rotate-6" />
      </button>

      <Modal open={open} onClose={resetAndClose} busy={busy} titleId="avatar-edit-title">
        {step === "checking" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 size={20} className="animate-spin text-muted" aria-hidden />
            <p className="text-sm text-muted">Verificando acesso…</p>
          </div>
        )}

        {step === "password" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="avatar-edit-title" className="font-display text-lg font-semibold text-fg">
                Área restrita
              </h2>
              <p className="text-[0.8125rem] text-muted">
                Digite a senha de administrador para trocar a foto.
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

        {(step === "picker" || step === "uploading") && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 id="avatar-edit-title" className="font-display text-lg font-semibold text-fg">
                Nova foto de perfil
              </h2>
              <p className="text-[0.8125rem] text-muted">JPG, PNG ou WebP — até 5MB.</p>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border-strong bg-surface">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- transient client-side object URL preview, not an optimizable asset
                  <img src={previewUrl} alt="Pré-visualização da nova foto" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <Camera size={22} aria-hidden />
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileChosen(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="h-11 rounded-full border border-border-strong text-[0.8125rem] font-medium text-fg transition-colors hover:border-primary-strong/40 disabled:opacity-40"
            >
              Escolher foto
            </button>

            {error && (
              <p className="flex items-center gap-1.5 text-[0.8125rem] text-primary-strong">
                <AlertCircle size={14} aria-hidden />
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={file ? handleCancelSelection : resetAndClose}
                disabled={busy}
                className="h-11 rounded-full px-4 text-[0.8125rem] font-medium text-muted transition-colors hover:text-fg disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!file || busy}
                aria-label={busy ? "Enviando foto…" : undefined}
                className="flex h-11 min-w-28 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-[0.8125rem] font-semibold text-fg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : "Salvar foto"}
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary-strong [animation:var(--animate-pop)]">
              <Check size={20} aria-hidden />
            </span>
            <p id="avatar-edit-title" className="text-sm font-medium text-fg">
              Foto atualizada!
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
