import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";
import { isValidHex } from "@/lib/color";
import { saveThemeColor } from "@/lib/theme-store";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isSessionTokenValid(token)) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob não está configurado neste ambiente (BLOB_READ_WRITE_TOKEN ausente)." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const primary = (body as { primary?: unknown })?.primary;
  if (typeof primary !== "string" || !isValidHex(primary)) {
    return NextResponse.json({ error: "Cor inválida. Use um hexadecimal como #B70C01." }, { status: 400 });
  }

  try {
    const derived = await saveThemeColor(primary);
    revalidatePath("/");
    return NextResponse.json(derived);
  } catch {
    return NextResponse.json({ error: "Falha ao salvar a cor. Tente novamente." }, { status: 502 });
  }
}
