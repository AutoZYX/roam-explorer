export type Severity = "S0" | "S1" | "S2" | "S3" | "S4";
export type Urgency = "U0" | "U1" | "U2" | "U3";

export interface Location {
  city: string;
  country?: string;
  road_type?: string;
  specific?: string;
}

export interface Scenario {
  primary: string;
  secondary?: string[];
}

export interface Impact {
  vehicles_affected?: number;
  duration_minutes?: number | null;
  traffic_disruption?: string;
  injuries?: number;
  fatalities?: number;
}

export interface EmergencyResponse {
  sos_button?: string;
  customer_service?: string;
  remote_intervention?: string;
  on_site_response?: string;
  resolution_method?: string;
}

export interface RootCause {
  category: string;
  description: string;
  confirmed: boolean;
}

export interface Source {
  url: string;
  title: string;
}

export interface Incident {
  id: string;
  date: string;
  time?: string;
  operator: string;
  vehicle_model?: string;
  location: Location;
  scenario: Scenario;
  severity: Severity;
  urgency?: Urgency;
  description: string;
  impact?: Impact;
  emergency_response?: EmergencyResponse;
  root_cause?: RootCause;
  systemic_issues?: string[];
  regulatory_action?: string;
  sources?: Source[];
  contributor?: string;
  last_updated?: string;
}

export interface SubScenario {
  id: string;
  name_en: string;
  name_cn: string;
  description: string;
  primaryLayer: number;
  escalationLayer?: number;
}

export interface ScenarioCategory {
  code: string;
  name_en: string;
  name_cn: string;
  description: string;
  subScenarios: SubScenario[];
}

export interface KPI {
  number: number;
  name: string;
  unit: string;
  target: string;
  frequency: string;
  definition: string;
  targets: { label: string; target: string; stretch: string }[];
}

export interface DashboardStats {
  totalIncidents: number;
  totalOperators: number;
  totalScenarios: number;
  yearRange: string;
  bySeverity: Record<string, number>;
  byOperator: Record<string, number>;
  byYear: Record<string, number>;
  byCategory: Record<string, number>;
}
