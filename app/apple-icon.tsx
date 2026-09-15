import { ImageResponse } from "next/og";
import { profile } from "@/config/profile";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #221114 0%, #09090c 70%)",
          color: "#f6f5f9",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        {profile.initials}
      </div>
    ),
    size,
  );
}
