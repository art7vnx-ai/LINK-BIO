import { profile } from "@/config/profile";

export function OgCard() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "80px",
        background: "#09090c",
        color: "#f6f5f9",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background:
            "radial-gradient(60% 70% at 15% 15%, rgba(183,12,1,0.35) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 168,
          height: 168,
          borderRadius: "50%",
          border: "2px solid rgba(247,246,251,0.16)",
          background: "linear-gradient(155deg, #221114 0%, #131318 70%)",
          fontSize: 60,
          fontWeight: 700,
          letterSpacing: -1,
          flexShrink: 0,
        }}
      >
        {profile.initials}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          marginLeft: 56,
          maxWidth: 760,
        }}
      >
        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, letterSpacing: -1.5 }}>
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 30,
            color: "#D0615A",
            fontWeight: 500,
          }}
        >
          @{profile.username}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            lineHeight: 1.5,
            color: "#c3c0cf",
          }}
        >
          {profile.tagline}
        </div>
      </div>
    </div>
  );
}
