export type FaultCategory =
  | "pure-comparative"
  | "modified-50"
  | "modified-51"
  | "contributory"
  | "unknown";

export interface StateFaultInfo {
  code: string;
  name: string;
  category: FaultCategory;
  note: string;
}

/** Educational only — not legal advice. Categories reflect common high-level rules. */
export const US_STATES: StateFaultInfo[] = [
  { code: "AL", name: "Alabama", category: "contributory", note: "Alabama generally follows contributory negligence: any fault attributed to you may bar recovery. An attorney can evaluate exceptions and strategy." },
  { code: "AK", name: "Alaska", category: "pure-comparative", note: "Alaska uses pure comparative negligence: your recovery may be reduced by your percentage of fault, even if you are mostly at fault." },
  { code: "AZ", name: "Arizona", category: "pure-comparative", note: "Arizona uses pure comparative negligence: damages may be reduced by your share of fault, but you can still recover even if mostly at fault." },
  { code: "AR", name: "Arkansas", category: "modified-50", note: "Arkansas uses modified comparative negligence: you typically cannot recover if you are 50% or more at fault." },
  { code: "CA", name: "California", category: "pure-comparative", note: "California uses pure comparative negligence: your award may be reduced by your percentage of fault." },
  { code: "CO", name: "Colorado", category: "modified-50", note: "Colorado uses modified comparative negligence: recovery is generally barred if you are 50% or more at fault." },
  { code: "CT", name: "Connecticut", category: "modified-51", note: "Connecticut uses modified comparative negligence: you typically cannot recover if you are 51% or more at fault." },
  { code: "DE", name: "Delaware", category: "modified-51", note: "Delaware uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "DC", name: "District of Columbia", category: "contributory", note: "D.C. generally follows contributory negligence: any fault may bar recovery. Legal counsel is especially important here." },
  { code: "FL", name: "Florida", category: "modified-51", note: "Florida uses modified comparative negligence: recovery is generally barred if you are more than 50% at fault." },
  { code: "GA", name: "Georgia", category: "modified-50", note: "Georgia uses modified comparative negligence: you typically cannot recover if 50% or more at fault." },
  { code: "HI", name: "Hawaii", category: "modified-51", note: "Hawaii uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "ID", name: "Idaho", category: "modified-50", note: "Idaho uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "IL", name: "Illinois", category: "modified-51", note: "Illinois uses modified comparative negligence: you typically cannot recover if 51% or more at fault." },
  { code: "IN", name: "Indiana", category: "modified-51", note: "Indiana uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "IA", name: "Iowa", category: "modified-51", note: "Iowa uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "KS", name: "Kansas", category: "modified-50", note: "Kansas uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "KY", name: "Kentucky", category: "pure-comparative", note: "Kentucky uses pure comparative negligence: damages may be reduced by your share of fault." },
  { code: "LA", name: "Louisiana", category: "pure-comparative", note: "Louisiana uses pure comparative negligence: your recovery may be reduced by your percentage of fault." },
  { code: "ME", name: "Maine", category: "modified-50", note: "Maine uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "MD", name: "Maryland", category: "contributory", note: "Maryland generally follows contributory negligence: any fault attributed to you may bar recovery." },
  { code: "MA", name: "Massachusetts", category: "modified-51", note: "Massachusetts uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "MI", name: "Michigan", category: "modified-51", note: "Michigan uses a form of modified comparative negligence with important no-fault overlay. An attorney can explain how PIP and tort thresholds interact." },
  { code: "MN", name: "Minnesota", category: "modified-51", note: "Minnesota uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "MS", name: "Mississippi", category: "pure-comparative", note: "Mississippi uses pure comparative negligence: damages may be reduced by your share of fault." },
  { code: "MO", name: "Missouri", category: "pure-comparative", note: "Missouri uses pure comparative negligence: your award may be reduced by your percentage of fault." },
  { code: "MT", name: "Montana", category: "modified-51", note: "Montana uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "NE", name: "Nebraska", category: "modified-50", note: "Nebraska uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "NV", name: "Nevada", category: "modified-51", note: "Nevada uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "NH", name: "New Hampshire", category: "modified-51", note: "New Hampshire uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "NJ", name: "New Jersey", category: "modified-51", note: "New Jersey uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "NM", name: "New Mexico", category: "pure-comparative", note: "New Mexico uses pure comparative negligence: damages may be reduced by your share of fault." },
  { code: "NY", name: "New York", category: "pure-comparative", note: "New York uses pure comparative negligence (with serious-injury thresholds in many vehicle cases). An attorney can assess eligibility." },
  { code: "NC", name: "North Carolina", category: "contributory", note: "North Carolina generally follows contributory negligence: any fault may bar recovery. Counsel is critical." },
  { code: "ND", name: "North Dakota", category: "modified-50", note: "North Dakota uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "OH", name: "Ohio", category: "modified-51", note: "Ohio uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "OK", name: "Oklahoma", category: "modified-51", note: "Oklahoma uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "OR", name: "Oregon", category: "modified-51", note: "Oregon uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "PA", name: "Pennsylvania", category: "modified-51", note: "Pennsylvania uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "RI", name: "Rhode Island", category: "pure-comparative", note: "Rhode Island uses pure comparative negligence: damages may be reduced by your share of fault." },
  { code: "SC", name: "South Carolina", category: "modified-51", note: "South Carolina uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "SD", name: "South Dakota", category: "pure-comparative", note: "South Dakota uses a form of pure comparative negligence with unique slight/gross fault framing — seek local counsel." },
  { code: "TN", name: "Tennessee", category: "modified-50", note: "Tennessee uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "TX", name: "Texas", category: "modified-51", note: "Texas uses modified comparative negligence: you typically cannot recover if more than 50% at fault." },
  { code: "UT", name: "Utah", category: "modified-50", note: "Utah uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "VT", name: "Vermont", category: "modified-51", note: "Vermont uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "VA", name: "Virginia", category: "contributory", note: "Virginia generally follows contributory negligence: any fault attributed to you may bar recovery." },
  { code: "WA", name: "Washington", category: "pure-comparative", note: "Washington uses pure comparative negligence: damages may be reduced by your share of fault." },
  { code: "WV", name: "West Virginia", category: "modified-50", note: "West Virginia uses modified comparative negligence: recovery is generally barred at 50% or more fault." },
  { code: "WI", name: "Wisconsin", category: "modified-51", note: "Wisconsin uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
  { code: "WY", name: "Wyoming", category: "modified-51", note: "Wyoming uses modified comparative negligence: recovery is generally barred at 51% or more fault." },
];

export function getStateFaultInfo(code: string): StateFaultInfo {
  const found = US_STATES.find((s) => s.code === code.toUpperCase());
  if (found) return found;
  return {
    code: code || "??",
    name: "Unknown",
    category: "unknown",
    note: "Comparative fault rules vary by state. Speak with a licensed attorney in your jurisdiction about how fault may affect recovery.",
  };
}
