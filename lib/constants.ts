import type { ScenarioCategory, KPI } from "./types";

export const SEVERITY_CONFIG: Record<
  string,
  { label: string; cn: string; color: string; bg: string }
> = {
  S0: { label: "Near-Miss", cn: "未遂", color: "text-gray-700", bg: "bg-gray-100" },
  S1: { label: "Minor", cn: "轻微", color: "text-blue-700", bg: "bg-blue-100" },
  S2: { label: "Moderate", cn: "中等", color: "text-amber-700", bg: "bg-amber-100" },
  S3: { label: "Severe", cn: "严重", color: "text-red-700", bg: "bg-red-100" },
  S4: { label: "Critical", cn: "致命", color: "text-white", bg: "bg-[#c85a3a]" },
};

export const URGENCY_CONFIG: Record<
  string,
  { label: string; cn: string; color: string; bg: string }
> = {
  U0: { label: "Low", cn: "低", color: "text-gray-600", bg: "bg-gray-100" },
  U1: { label: "Medium", cn: "中", color: "text-blue-600", bg: "bg-blue-50" },
  U2: { label: "High", cn: "高", color: "text-orange-600", bg: "bg-orange-50" },
  U3: { label: "Immediate", cn: "紧急", color: "text-red-600", bg: "bg-red-50" },
};

export const LAYER_CONFIG: Record<
  number,
  { name: string; cn: string; target: string; latency: string; color: string }
> = {
  1: { name: "AI Autonomous Response", cn: "AI自主响应", target: "70%", latency: "< 2 sec", color: "#3a8a5c" },
  2: { name: "AI-Assisted + Human Confirm", cn: "AI辅助+人工确认", target: "25%", latency: "< 60 sec", color: "#c85a3a" },
  3: { name: "Remote Driving / On-Site", cn: "远程驾驶/现场处置", target: "5%", latency: "< 5 min", color: "#991b1b" },
};

export const OPERATOR_COLORS: Record<string, string> = {
  Waymo: "#4285F4",
  "Cruise (GM)": "#FF6D00",
  Cruise: "#FF6D00",
  Apollo: "#1A73E8",
  "Apollo (Baidu)": "#1A73E8",
  "Pony.ai": "#6C3AED",
};

export const CATEGORY_COLORS: Record<string, string> = {
  A: "#dc2626",
  B: "#ea580c",
  C: "#d97706",
  D: "#059669",
  E: "#2563eb",
  F: "#7c3aed",
};

export const TAXONOMY: ScenarioCategory[] = [
  {
    code: "A",
    name_en: "System-Wide Failure",
    name_cn: "系统性故障",
    description: "Anomalies affecting multiple vehicles simultaneously due to infrastructure, cloud, or platform-level failures.",
    subScenarios: [
      { id: "A1", name_en: "Cloud/Network Mass Failure", name_cn: "云端/网络大面积故障", description: "Loss of connectivity between fleet vehicles and the cloud platform.", primaryLayer: 1, escalationLayer: 3 },
      { id: "A2", name_en: "OTA Update Failure", name_cn: "OTA升级故障", description: "Over-the-air software update causes system instability or version incompatibility.", primaryLayer: 2, escalationLayer: 3 },
      { id: "A3", name_en: "External Infrastructure Failure", name_cn: "外部基础设施故障", description: "Failure of external systems the ADS depends on \u2014 power grid, traffic signals, V2X.", primaryLayer: 2, escalationLayer: 3 },
      { id: "A4", name_en: "Server Decision System Crash", name_cn: "服务端决策系统崩溃", description: "Centralized decision-making or dispatch system crashes.", primaryLayer: 1, escalationLayer: 3 },
    ],
  },
  {
    code: "B",
    name_en: "Perception/Decision Failure",
    name_cn: "感知/决策失效",
    description: "Vehicle's perception system or decision-making logic fails to correctly interpret the driving environment.",
    subScenarios: [
      { id: "B1", name_en: "Complex Intersection Hesitation", name_cn: "复杂路口犹豫不决", description: "Vehicle stops or hesitates excessively at complex intersections.", primaryLayer: 1, escalationLayer: 2 },
      { id: "B2", name_en: "Object Misidentification", name_cn: "目标误识别", description: "Perception system misclassifies an object \u2014 phantom braking, missed detection.", primaryLayer: 1, escalationLayer: 2 },
      { id: "B3", name_en: "Extreme Weather Perception Degradation", name_cn: "极端天气感知退化", description: "Heavy rain, snow, fog, or glare degrades sensor performance below safe thresholds.", primaryLayer: 1, escalationLayer: 2 },
      { id: "B4", name_en: "Abnormal Human Behavior", name_cn: "异常人类行为", description: "Unexpected actions by other road users \u2014 jaywalking, wrong-way driving, antagonism.", primaryLayer: 1, escalationLayer: 2 },
      { id: "B5", name_en: "GPS/Localization Drift", name_cn: "GPS/定位漂移", description: "Significant localization drift from GPS multipath, HD map mismatch, or SLAM failure.", primaryLayer: 1, escalationLayer: 2 },
    ],
  },
  {
    code: "C",
    name_en: "Planning/Execution Anomaly",
    name_cn: "规划/执行异常",
    description: "Vehicle's planning or control system produces dangerous or frozen output despite correct perception.",
    subScenarios: [
      { id: "C1", name_en: "Mid-Road Freeze", name_cn: "路中间冻住/停死", description: "Vehicle stops in a live traffic lane and cannot self-recover.", primaryLayer: 2, escalationLayer: 3 },
      { id: "C2", name_en: "Unexpected Hard Braking", name_cn: "意外急刹车", description: "Sudden hard braking without visible cause \u2014 phantom braking.", primaryLayer: 1 },
      { id: "C3", name_en: "Dangerous Lane Change", name_cn: "危险变道", description: "Lane change creating a hazardous situation \u2014 cutting off, merging into occupied space.", primaryLayer: 1 },
      { id: "C4", name_en: "Static Object Collision", name_cn: "静态障碍物碰撞", description: "Collision with stationary object \u2014 parked vehicle, bollard, barrier, curb.", primaryLayer: 1, escalationLayer: 3 },
      { id: "C5", name_en: "Low-Speed Pedestrian/Cyclist Collision", name_cn: "低速行人/骑行者碰撞", description: "Contact with pedestrian or cyclist at low speed, including entrapment.", primaryLayer: 1, escalationLayer: 3 },
    ],
  },
  {
    code: "D",
    name_en: "Vehicle Hardware Failure",
    name_cn: "车辆硬件故障",
    description: "Anomalies caused by failure of vehicle hardware components \u2014 sensors, powertrain, battery, or actuators.",
    subScenarios: [
      { id: "D1", name_en: "Sensor Hardware Failure", name_cn: "传感器硬件故障", description: "Physical failure of perception sensors \u2014 LiDAR, camera, radar, or IMU.", primaryLayer: 1, escalationLayer: 2 },
      { id: "D2", name_en: "Powertrain/Battery Failure", name_cn: "动力/电池故障", description: "Loss of propulsion \u2014 motor failure, BMS fault, unexpected range depletion.", primaryLayer: 2, escalationLayer: 3 },
      { id: "D3", name_en: "Vehicle Fire", name_cn: "车辆火灾", description: "Battery thermal runaway, electrical short circuit, or other fire event.", primaryLayer: 3 },
      { id: "D4", name_en: "Brake/Steering Actuator Failure", name_cn: "制动/转向执行器故障", description: "Failure of primary braking or steering actuator, redundant system must take over.", primaryLayer: 1, escalationLayer: 3 },
    ],
  },
  {
    code: "E",
    name_en: "External Conflict",
    name_cn: "外部环境冲突",
    description: "Anomalies caused by external events or road users that the ADS must respond to.",
    subScenarios: [
      { id: "E1", name_en: "Struck by Other Vehicle", name_cn: "被其他车辆撞击", description: "Robotaxi hit by another vehicle \u2014 rear-ended, T-boned, sideswiped.", primaryLayer: 1, escalationLayer: 3 },
      { id: "E2", name_en: "Road Construction/Closure", name_cn: "道路施工/封闭", description: "Unexpected construction, closure, or modified lane configuration.", primaryLayer: 2, escalationLayer: 3 },
      { id: "E3", name_en: "Emergency Vehicle Interaction", name_cn: "紧急车辆交互", description: "Yielding to emergency vehicles or navigating active emergency scenes.", primaryLayer: 2, escalationLayer: 3 },
      { id: "E4", name_en: "Police/Traffic Officer Gesture Failure", name_cn: "交警手势理解失败", description: "Failure to understand manual traffic direction by police or traffic controller.", primaryLayer: 2, escalationLayer: 3 },
    ],
  },
  {
    code: "F",
    name_en: "Passenger-Side Issue",
    name_cn: "乘客端异常",
    description: "Anomalies originating from or primarily affecting passengers.",
    subScenarios: [
      { id: "F1", name_en: "Passenger Trapped in Vehicle", name_cn: "乘客被困车内", description: "Passenger cannot exit \u2014 doors locked, unsafe location, mechanism jammed.", primaryLayer: 2, escalationLayer: 3 },
      { id: "F2", name_en: "Dangerous Pickup/Dropoff Location", name_cn: "危险接驳位置", description: "Unsafe pickup/dropoff point \u2014 bus lane, highway shoulder, no sidewalk.", primaryLayer: 1, escalationLayer: 2 },
      { id: "F3", name_en: "Passenger Interference with Vehicle", name_cn: "乘客干扰车辆", description: "Deliberate or accidental interference with vehicle operation.", primaryLayer: 2, escalationLayer: 3 },
      { id: "F4", name_en: "Passenger Medical Emergency", name_cn: "乘客医疗紧急情况", description: "Passenger medical emergency during trip \u2014 cardiac event, seizure, loss of consciousness.", primaryLayer: 3 },
    ],
  },
];

export const KPIS: KPI[] = [
  {
    number: 1, name: "MTTR", unit: "seconds/minutes", target: "< 2 min overall", frequency: "Real-time, report daily",
    definition: "Average time from anomaly detection to confirmed resolution.",
    targets: [
      { label: "Layer 1 (AI Autonomous)", target: "< 10 seconds", stretch: "< 5 seconds" },
      { label: "Layer 2 (AI + Human)", target: "< 3 minutes", stretch: "< 90 seconds" },
      { label: "Layer 3 (Remote/On-Site)", target: "< 15 minutes", stretch: "< 10 minutes" },
      { label: "Overall (weighted)", target: "< 2 minutes", stretch: "< 1 minute" },
    ],
  },
  {
    number: 2, name: "AI Autonomous Resolution Rate", unit: "%", target: "> 70%", frequency: "Daily, report monthly",
    definition: "Percentage of anomalies resolved by Layer 1 without human involvement.",
    targets: [
      { label: "Early deployment (<6 months)", target: "> 50%", stretch: "> 60%" },
      { label: "Operational (6-18 months)", target: "> 65%", stretch: "> 75%" },
      { label: "Mature (>18 months)", target: "> 70%", stretch: "> 80%" },
    ],
  },
  {
    number: 3, name: "False Escalation Rate", unit: "%", target: "< 15%", frequency: "Weekly review, monthly report",
    definition: "Percentage of escalations where the lower layer could have resolved the anomaly.",
    targets: [
      { label: "L1 \u2192 L2 False Escalation", target: "< 15%", stretch: "< 10%" },
      { label: "L2 \u2192 L3 False Escalation", target: "< 10%", stretch: "< 5%" },
    ],
  },
  {
    number: 4, name: "Missed Escalation Rate", unit: "%", target: "< 2%", frequency: "Weekly review, monthly report",
    definition: "Percentage of Layer 1 resolutions that should have been escalated to human operators.",
    targets: [{ label: "Missed Escalation Rate", target: "< 2%", stretch: "< 1%" }],
  },
  {
    number: 5, name: "Passenger Trapped Duration", unit: "minutes", target: "P50 < 2 min", frequency: "Per-event, monthly report",
    definition: "Time a passenger remains unable to exit the vehicle after requesting to do so.",
    targets: [
      { label: "P50 (median)", target: "< 2 min", stretch: "< 1 min" },
      { label: "P95 (worst 5%)", target: "< 5 min", stretch: "< 3 min" },
      { label: "Maximum", target: "< 10 min", stretch: "< 5 min" },
    ],
  },
  {
    number: 6, name: "Traffic Recovery Time", unit: "minutes", target: "Per-severity", frequency: "Per-event, monthly report",
    definition: "Time from traffic disruption start to traffic returning to normal.",
    targets: [
      { label: "S1 (minor)", target: "< 3 min", stretch: "< 1 min" },
      { label: "S2 (moderate)", target: "< 15 min", stretch: "< 10 min" },
      { label: "S3 (severe)", target: "< 45 min", stretch: "< 30 min" },
    ],
  },
  {
    number: 7, name: "Operator-to-Vehicle Ratio", unit: "ratio", target: "1:50+ (mature)", frequency: "Real-time, monthly report",
    definition: "Number of active fleet vehicles per on-duty operator.",
    targets: [
      { label: "Early deployment", target: "1 : 15-20", stretch: "\u2014" },
      { label: "Operational", target: "1 : 30-50", stretch: "1 : 60" },
      { label: "Mature", target: "1 : 50-80", stretch: "1 : 100+" },
    ],
  },
  {
    number: 8, name: "Scenario Coverage Rate", unit: "%", target: "> 95%", frequency: "Quarterly audit",
    definition: "Percentage of taxonomy sub-scenarios with defined, tested, and validated response procedures.",
    targets: [
      { label: "Pre-launch", target: "> 80%", stretch: "> 90%" },
      { label: "Operational", target: "> 90%", stretch: "> 95%" },
      { label: "Mature", target: "> 95%", stretch: "100%" },
    ],
  },
];

export const URGENCY_SEVERITY_MATRIX: Record<string, Record<string, string>> = {
  S0: { U0: "Routine", U1: "Monitor", U2: "Unusual", U3: "Investigate" },
  S1: { U0: "Log", U1: "Resolve", U2: "Priority", U3: "Priority" },
  S2: { U0: "Review", U1: "Priority", U2: "Critical", U3: "Critical" },
  S3: { U0: "\u2014", U1: "Critical", U2: "Critical", U3: "Emergency" },
  S4: { U0: "\u2014", U1: "\u2014", U2: "Emergency", U3: "Emergency" },
};
