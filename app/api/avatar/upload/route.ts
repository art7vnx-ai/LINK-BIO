import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE, isSessionTokenValid } from "@/lib/admin-auth";
import {
  ACCEPTED_AVATAR_MIME_TYPES,
  MAX_AVATAR_BYTES,
  saveAvatar,
} from "@/lib/avatar-store";

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

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }

  const mimeType = file.type;
  if (!ACCEPTED_AVATAR_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: "Formato não suportado. Use JPG, PNG ou WebP." },
      { status: 415 },
    );
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return NextResponse.json(
      { error: "Arquivo muito grande. O limite é 5MB." },
      { status: 413 },
    );
  }

  try {
    const url = await saveAvatar(file, mimeType);
    revalidatePath("/");
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Falha ao enviar a imagem. Tente novamente." },
      { status: 502 },
    );
  }
}
