import { ImageResponse } from "next/og";
import { profile } from "@/config/profile";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: -0.5,
        }}
      >
        {profile.initials}
      </div>
    ),
    size,
  );
}
