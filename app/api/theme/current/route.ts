import { NextResponse } from "next/server";
import { theme as defaultTheme } from "@/config/theme";
import { getPersistedPrimaryHex } from "@/lib/theme-store";

/** Public, read-only: the current accent hex, for prefilling the color picker. Not sensitive — it's already visible on the page itself. */
export async function GET() {
  const primary = (await getPersistedPrimaryHex()) ?? defaultTheme.primary;
  return NextResponse.json({ primary });
}
