export function DisclaimerBanner() {
  return (
    <aside
      className="border-b border-amber-200 bg-amber-50 text-amber-950"
      role="note"
      aria-label="Not legal advice"
    >
      <div className="mx-auto max-w-6xl px-4 py-3 text-sm sm:px-6">
        <strong className="font-semibold">Not legal advice.</strong>{" "}
        This tool produces educational estimates only. It does not create an attorney-client
        relationship, predict case outcomes, or replace a consultation with a licensed attorney.
      </div>
    </aside>
  );
}
