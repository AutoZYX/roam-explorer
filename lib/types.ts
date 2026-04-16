export type Jurisdiction =
  | "international"
  | "china"
  | "us"
  | "eu"
  | "uk"
  | "japan"
  | "korea";

export type StandardType =
  | "regulation"
  | "standard"
  | "consultation"
  | "meeting_notice"
  | "recall"
  | "white_paper";

export type StandardStatus =
  | "draft"
  | "consultation"
  | "published"
  | "revised"
  | "withdrawn"
  | "pending";

export type AutomationLevel = "L0" | "L1" | "L2" | "L3" | "L4" | "L5";

export type Topic =
  | "functional_safety"
  | "sotif"
  | "cybersecurity"
  | "data_recording"
  | "teleoperation"
  | "testing"
  | "type_approval"
  | "ads_performance"
  | "v2x"
  | "ota"
  | "ethics"
  | "mapping"
  | "operational_domain"
  | "hmi"
  | "recall";

/**
 * A single standard / regulation / consultation record.
 * One YAML file per record under `standards/{jurisdiction}/{year}/{id}.yaml`.
 * Only metadata + link is stored — the standard text itself is not redistributed.
 */
export interface Standard {
  id: string;
  date: string; // YYYY-MM-DD — primary date (publication, release, or issuance)
  org: string; // short name, e.g. "UNECE WP.29"
  org_full?: string;
  jurisdiction: Jurisdiction;
  type: StandardType;
  status: StandardStatus;

  title_en: string;
  title_cn: string;
  url: string;

  effective_date?: string; // YYYY-MM-DD
  consultation_deadline?: string; // YYYY-MM-DD
  document_number?: string; // e.g. "GB/T 40429-2021", "UN R157", "J3016_202104"

  automation_level?: AutomationLevel[];
  topics?: Topic[];

  summary_en?: string;
  summary_cn?: string;
  impact_note?: string;
  related_standards?: string[];

  tags?: string[];
  last_updated?: string; // YYYY-MM-DD — when our record was last reviewed
}

export interface Source {
  id: string;
  name_en: string;
  name_cn: string;
  url: string;
  jurisdiction: Jurisdiction;
  language: "en" | "cn" | "ja" | "ko" | "mixed";
  notes?: string;
  robots_ok?: boolean;
  crawl_frequency?: "daily" | "weekly" | "manual";
}
