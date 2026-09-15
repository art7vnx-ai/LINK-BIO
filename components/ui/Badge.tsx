export function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-surface/60 px-3 py-1 text-[0.8125rem] text-muted-strong">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 [animation-duration:2.4s] motion-reduce:animate-none" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-strong" />
      </span>
      {children}
    </span>
  );
}
