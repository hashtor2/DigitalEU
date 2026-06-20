import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface ServiceProfile {
  id: string;
  tagline: string | null;
  long_description: string | null;
  founded_year: number | null;
  legal_entity: string | null;
  headquarters: string | null;
  governing_law: string | null;
  data_center_locations: string[] | null;
  business_model: string | null;
  pricing_notes: string | null;
  is_open_source: boolean;
  open_source_url: string | null;
  is_zero_knowledge: boolean;
  zero_knowledge_notes: string | null;
  no_ads: boolean;
  eu_jurisdiction: boolean;
  jurisdiction_notes: string | null;
  no_logs: boolean;
  no_logs_notes: string | null;
  has_independent_audit: boolean;
  audit_url: string | null;
  audit_year: number | null;
  accepts_anonymous_payment: boolean;
  anonymous_payment_notes: string | null;
  has_tor_support: boolean;
  tor_notes: string | null;
  no_third_party_sharing: boolean;
  data_collected: string[] | null;
  data_retention_policy: string | null;
  privacy_policy_url: string | null;
  transparency_report_url: string | null;
  privacy_score: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceIncident {
  id: string;
  service_id: string;
  title: string;
  description: string | null;
  incident_date: string | null;
  severity: "critical" | "high" | "medium" | "low";
  resolved: boolean;
  resolution_notes: string | null;
  source_url: string | null;
  created_at: string;
}

export const PRIVACY_ATTRIBUTES: {
  key: keyof ServiceProfile;
  label: string;
  points: number;
  notes_key?: keyof ServiceProfile;
}[] = [
  { key: "is_zero_knowledge", label: "Zero-knowledge encryption", points: 20, notes_key: "zero_knowledge_notes" },
  { key: "no_logs", label: "No logs policy", points: 15, notes_key: "no_logs_notes" },
  { key: "eu_jurisdiction", label: "EU / Swiss jurisdiction", points: 15, notes_key: "jurisdiction_notes" },
  { key: "is_open_source", label: "Open source", points: 10, notes_key: "open_source_url" },
  { key: "has_independent_audit", label: "Independent security audit", points: 10, notes_key: "audit_url" },
  { key: "no_ads", label: "No advertising", points: 10 },
  { key: "no_third_party_sharing", label: "No third-party data sharing", points: 10 },
  { key: "accepts_anonymous_payment", label: "Anonymous payment accepted", points: 5, notes_key: "anonymous_payment_notes" },
  { key: "has_tor_support", label: "Tor / onion support", points: 5, notes_key: "tor_notes" },
];

export async function fetchServiceProfile(id: string): Promise<ServiceProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as ServiceProfile;
}

export async function fetchServiceIncidents(serviceId: string): Promise<ServiceIncident[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("service_incidents")
    .select("*")
    .eq("service_id", serviceId)
    .order("incident_date", { ascending: false });
  if (error || !data) return [];
  return data as ServiceIncident[];
}

export async function fetchAllServiceProfiles(): Promise<ServiceProfile[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data, error } = await supabase
    .from("service_profiles")
    .select("id, tagline, headquarters, privacy_score, is_zero_knowledge, eu_jurisdiction, is_open_source, has_independent_audit, no_ads, no_logs")
    .order("privacy_score", { ascending: false });
  if (error || !data) return [];
  return data as ServiceProfile[];
}
