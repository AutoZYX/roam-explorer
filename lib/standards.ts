/**
 * Mapping between ROAM 27 sub-scenarios and major safety standards.
 *
 * Data-first approach: each scenario lists its alignment to:
 * - China: GB/T 智能网联汽车 安全事件数据交互与管理系统技术规范 (draft)
 * - International: ISO 34502 (scenario-based safety assurance), ISO 21448 (SOTIF)
 * - US: NHTSA SGO (Standing General Order on Crash Reporting)
 */

export interface StandardsMapping {
  scenarioCode: string; // e.g., "A1"
  gbEventCodes: string[]; // e.g., ["0x05"]
  gbNote?: string;
  iso34502?: string;
  iso21448?: string;
  nhtsaSgo?: string;
}

export const STANDARDS_MAPPING: StandardsMapping[] = [
  // A. System-Wide Failure
  { scenarioCode: "A1", gbEventCodes: ["0x04", "0x05", "0x0E"], gbNote: "Cloud/network failure → MRM + ADS severe failure + cyber event", iso34502: "Functional insufficiency - communication loss", iso21448: "Triggering condition: communication infrastructure", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "A2", gbEventCodes: ["0x0C", "0x05"], gbNote: "OTA update failure", iso34502: "Functional insufficiency", iso21448: "Change management", nhtsaSgo: "Fleet-wide pattern reportable" },
  { scenarioCode: "A3", gbEventCodes: ["0x04", "0x0E"], gbNote: "External infra (power/V2X) — MRM trigger + potential cyber event", iso34502: "Infrastructure dependency", iso21448: "Reasonably foreseeable misuse", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "A4", gbEventCodes: ["0x05"], gbNote: "Server crash = ADS severe failure", iso34502: "Compute architecture", iso21448: "Functional insufficiency", nhtsaSgo: "Reportable if crash results" },

  // B. Perception/Decision Failure
  { scenarioCode: "B1", gbEventCodes: ["0x03"], gbNote: "Intersection hesitation → takeover request", iso34502: "Scenario complexity", iso21448: "Performance limitation", nhtsaSgo: "Typically no reporting if no crash" },
  { scenarioCode: "B2", gbEventCodes: ["0x08", "0x0D"], gbNote: "Object misidentification — collision risk / ADAS event", iso34502: "Sensor limitation", iso21448: "Known limitation (phantom braking etc.)", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "B3", gbEventCodes: ["0x04", "0x0D"], gbNote: "Weather degradation → MRM or ADAS event", iso34502: "ODD exit", iso21448: "Triggering condition: environmental", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "B4", gbEventCodes: ["0x08"], gbNote: "Abnormal human behavior → collision risk", iso34502: "Behavioral uncertainty", iso21448: "Reasonably foreseeable misuse", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "B5", gbEventCodes: ["0x03", "0x04"], gbNote: "Localization drift → takeover request or MRM", iso34502: "Localization requirement", iso21448: "Performance limitation", nhtsaSgo: "Reportable if crash results" },

  // C. Planning/Execution Anomaly
  { scenarioCode: "C1", gbEventCodes: ["0x05", "0x0B"], gbNote: "Mid-road freeze = ADS severe failure + remote control needed", iso34502: "Planner deadlock", iso21448: "Functional insufficiency", nhtsaSgo: "Reportable if traffic disruption" },
  { scenarioCode: "C2", gbEventCodes: ["0x0D"], gbNote: "Unexpected hard braking = ADAS event", iso34502: "Planner oscillation", iso21448: "Known phantom braking", nhtsaSgo: "Reportable if rear-end crash" },
  { scenarioCode: "C3", gbEventCodes: ["0x0D", "0x08"], gbNote: "Dangerous lane change → ADAS event + collision risk", iso34502: "Maneuver planning", iso21448: "Performance limitation", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "C4", gbEventCodes: ["0x0A", "0x07"], gbNote: "Static object collision (locked) or pre-collision (non-locked)", iso34502: "Obstacle avoidance", iso21448: "Perception baseline", nhtsaSgo: "Required reporting — Level 2+ covered" },
  { scenarioCode: "C5", gbEventCodes: ["0x0A"], gbNote: "Low-speed pedestrian/cyclist collision = locked collision", iso34502: "VRU protection", iso21448: "Pedestrian perception", nhtsaSgo: "Required reporting with injury details" },

  // D. Vehicle Hardware Failure
  { scenarioCode: "D1", gbEventCodes: ["0x04", "0x06"], gbNote: "Sensor hardware failure → MRM + vehicle severe failure", iso34502: "Sensor redundancy", iso21448: "Hardware reliability", nhtsaSgo: "Reportable if crash results" },
  { scenarioCode: "D2", gbEventCodes: ["0x06"], gbNote: "Powertrain/battery failure = vehicle severe failure", iso34502: "Energy availability", iso21448: "Hardware fault", nhtsaSgo: "Reportable per general crash reporting" },
  { scenarioCode: "D3", gbEventCodes: ["0x06"], gbNote: "Vehicle fire = vehicle severe failure (highest priority)", iso34502: "Thermal runaway", iso21448: "Battery safety", nhtsaSgo: "Mandatory immediate reporting" },
  { scenarioCode: "D4", gbEventCodes: ["0x06"], gbNote: "Brake/steering actuator failure = vehicle severe failure", iso34502: "Actuator redundancy (ASIL-D)", iso21448: "Functional safety overlap", nhtsaSgo: "Mandatory immediate reporting" },

  // E. External Conflict
  { scenarioCode: "E1", gbEventCodes: ["0x0A"], gbNote: "Struck by other vehicle = locked collision", iso34502: "Post-collision behavior", iso21448: "Not primary focus", nhtsaSgo: "Mandatory crash reporting" },
  { scenarioCode: "E2", gbEventCodes: ["0x03"], gbNote: "Road construction → takeover request (not explicit)", iso34502: "ODD change", iso21448: "Dynamic ODD", nhtsaSgo: "No specific reporting" },
  { scenarioCode: "E3", gbEventCodes: ["0x03"], gbNote: "Emergency vehicle — gap in GB/T (takeover request inferred)", iso34502: "Not explicitly covered", iso21448: "Emergency scene handling", nhtsaSgo: "Public safety interest" },
  { scenarioCode: "E4", gbEventCodes: ["0x03"], gbNote: "Police gesture understanding — gap in GB/T", iso34502: "Not covered", iso21448: "Reasonably foreseeable", nhtsaSgo: "Not covered" },

  // F. Passenger-Side Issue
  { scenarioCode: "F1", gbEventCodes: [], gbNote: "⚠ GAP: Passenger trapped — not covered in GB/T draft. Wuhan case was exactly this.", iso34502: "Not covered", iso21448: "Not primary focus", nhtsaSgo: "Not covered" },
  { scenarioCode: "F2", gbEventCodes: [], gbNote: "⚠ GAP: Dangerous pickup location — not covered", iso34502: "Not covered", iso21448: "ODD boundary", nhtsaSgo: "Not covered" },
  { scenarioCode: "F3", gbEventCodes: [], gbNote: "⚠ GAP: Passenger interference — not covered", iso34502: "Not covered", iso21448: "Foreseeable misuse", nhtsaSgo: "Not covered" },
  { scenarioCode: "F4", gbEventCodes: [], gbNote: "⚠ GAP: Medical emergency — not covered", iso34502: "Not covered", iso21448: "Not covered", nhtsaSgo: "Not covered" },
];

export const GB_EVENT_CODE_NAMES: Record<string, { en: string; zh: string }> = {
  "0x01": { en: "ADS Activation", zh: "ADS 激活" },
  "0x02": { en: "ADS Deactivation", zh: "ADS 退出" },
  "0x03": { en: "Takeover Request", zh: "发出介入请求" },
  "0x04": { en: "Minimum Risk Maneuver", zh: "启动最小风险策略" },
  "0x05": { en: "ADS Severe Failure", zh: "ADS 严重失效" },
  "0x06": { en: "Vehicle Severe Failure", zh: "车辆严重失效" },
  "0x07": { en: "Non-locked Collision (Pre-crash)", zh: "非锁定碰撞（预碰撞）" },
  "0x08": { en: "Collision Risk", zh: "有碰撞风险" },
  "0x09": { en: "User ADS Override", zh: "用户操纵 ADS 退出" },
  "0x0A": { en: "Locked Collision", zh: "锁定碰撞（发生碰撞）" },
  "0x0B": { en: "Remote Control Event", zh: "远程控制事件" },
  "0x0C": { en: "OTA Update Event", zh: "OTA 升级事件" },
  "0x0D": { en: "ADAS Event", zh: "ADAS 事件" },
  "0x0E": { en: "Cyber/Data Security Event", zh: "网络和数据安全事件" },
};
