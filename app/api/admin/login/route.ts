import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAdminPassword,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { checkRateLimit, clientIpFrom, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!getAdminPassword()) {
    // Any visitor can reach this (it fires before authentication) — say
    // enough to be honest without naming the env var to a stranger.
    return NextResponse.json(
      { error: "Não foi possível entrar. Tente novamente mais tarde." },
      { status: 500 },
    );
  }

  const ip = clientIpFrom(request);
  const retryAfterSeconds = checkRateLimit(ip);
  if (retryAfterSeconds !== null) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  let password: unknown;
  try {
    const body = await request.json();
    password = body?.password;
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Senha obrigatória." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  resetRateLimit(ip);
  const token = createSessionToken();
  if (!token) {
    return NextResponse.json(
      { error: "Não foi possível entrar. Tente novamente mais tarde." },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ authenticated: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
