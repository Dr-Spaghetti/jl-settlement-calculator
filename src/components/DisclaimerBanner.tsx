export function DisclaimerBanner() {
  return (
    <aside
      className="border-b border-[color-mix(in_srgb,var(--brand-primary)_12%,transparent)] bg-white/60 text-[var(--brand-primary)] print:hidden"
      role="note"
      aria-label="Not legal advice"
    >
      <div className="mx-auto max-w-6xl px-4 py-2.5 text-sm sm:px-6">
        <strong className="font-semibold">Not legal advice.</strong>{" "}
        <span className="text-slate-600">
          Educational estimates only. No attorney-client relationship is formed by using
          this tool.
        </span>
      </div>
    </aside>
  );
}
