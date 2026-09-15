# public/images

- `avatar.png` — the profile photo. `components/profile/Avatar.tsx` picks it
  up automatically when present and falls back to the generated initials
  placeholder otherwise.
- `locker-icon.svg` (or `.png` / `.jpg` / `.webp`) — the LOCKER product logo
  for its link card. `components/links/LockerIcon.tsx` picks it up
  automatically when present and falls back to a generic lock glyph
  otherwise.
