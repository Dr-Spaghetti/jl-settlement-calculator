/**
 * Single source of truth for liability options: the button label, the
 * multiplier coefficient, and the breakdown label all come from this table.
 * Unit tests iterate every row (lesson #6: buttons must match the math).
 */
export const LIABILITY_OPTIONS = [
  { id: "clear", label: "Clear liability (e.g. rear-ended, ran a red light)", coef: 0.25, breakdownLabel: "Clear liability (e.g. rear-ended, ran a red light)" },
  { id: "mixed", label: "Shared or unclear fault", coef: -0.2, breakdownLabel: "Shared or unclear fault" },
  { id: "disputed", label: "Disputed / contested", coef: -0.55, breakdownLabel: "Disputed / contested" },
] as const;
export type LiabilityId = (typeof LIABILITY_OPTIONS)[number]["id"];
export function liabilityOption(id: LiabilityId) {
  const o = LIABILITY_OPTIONS.find((x) => x.id === id);
  if (!o) throw new Error(`Unknown liability option ${id}`);
  return o;
}
