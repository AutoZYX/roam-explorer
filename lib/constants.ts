import type { Jurisdiction, StandardStatus, StandardType, Topic } from "./types";

export const JURISDICTION_LABELS: Record<Jurisdiction, { en: string; cn: string }> = {
  international: { en: "International", cn: "国际" },
  china: { en: "China", cn: "中国" },
  us: { en: "United States", cn: "美国" },
  eu: { en: "European Union", cn: "欧盟" },
  uk: { en: "United Kingdom", cn: "英国" },
  japan: { en: "Japan", cn: "日本" },
  korea: { en: "Korea", cn: "韩国" },
};

export const STATUS_LABELS: Record<StandardStatus, { en: string; cn: string }> = {
  draft: { en: "Draft", cn: "草案" },
  consultation: { en: "Consultation", cn: "征求意见" },
  published: { en: "Published", cn: "已发布" },
  revised: { en: "Revised", cn: "修订" },
  withdrawn: { en: "Withdrawn", cn: "作废" },
  pending: { en: "Pending", cn: "待定" },
};

export const TYPE_LABELS: Record<StandardType, { en: string; cn: string }> = {
  regulation: { en: "Regulation", cn: "法规" },
  standard: { en: "Standard", cn: "标准" },
  consultation: { en: "Consultation", cn: "征求意见" },
  meeting_notice: { en: "Meeting Notice", cn: "会议通知" },
  recall: { en: "Recall", cn: "召回" },
  white_paper: { en: "White Paper", cn: "白皮书" },
};

export const TOPIC_LABELS: Record<Topic, { en: string; cn: string }> = {
  functional_safety: { en: "Functional Safety", cn: "功能安全" },
  sotif: { en: "SOTIF", cn: "预期功能安全" },
  cybersecurity: { en: "Cybersecurity", cn: "信息安全" },
  data_recording: { en: "Data Recording", cn: "数据记录" },
  teleoperation: { en: "Teleoperation", cn: "远程驾驶" },
  testing: { en: "Testing", cn: "测试" },
  type_approval: { en: "Type Approval", cn: "型式认证" },
  ads_performance: { en: "ADS Performance", cn: "自动驾驶系统性能" },
  v2x: { en: "V2X", cn: "车路协同" },
  ota: { en: "OTA", cn: "OTA 升级" },
  ethics: { en: "Ethics", cn: "伦理" },
  mapping: { en: "HD Mapping", cn: "高精地图" },
  operational_domain: { en: "ODD", cn: "运行设计域" },
  hmi: { en: "HMI", cn: "人机交互" },
  recall: { en: "Recall", cn: "召回" },
};

export const STATUS_COLOR: Record<StandardStatus, string> = {
  draft: "var(--status-draft)",
  consultation: "var(--status-consultation)",
  published: "var(--status-published)",
  revised: "var(--status-revised)",
  withdrawn: "var(--status-withdrawn)",
  pending: "var(--status-pending)",
};

export const JURISDICTION_COLOR: Record<Jurisdiction, string> = {
  international: "var(--juris-international)",
  china: "var(--juris-china)",
  us: "var(--juris-us)",
  eu: "var(--juris-eu)",
  uk: "var(--juris-uk)",
  japan: "var(--juris-japan)",
  korea: "var(--juris-korea)",
};
