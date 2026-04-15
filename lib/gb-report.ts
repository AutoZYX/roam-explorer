import type { Incident } from "./types";
import { STANDARDS_MAPPING, GB_EVENT_CODE_NAMES } from "./standards";

/**
 * Generate a GB/T Appendix C "立即报告" (Immediate Report) template
 * from a ROAM incident record. Returns structured Markdown ready to
 * copy into the CATARC submission portal or print as PDF.
 */
export function generateGbImmediateReport(incident: Incident): string {
  const mapping = STANDARDS_MAPPING.find(
    (m) => m.scenarioCode === incident.scenario.primary
  );
  const gbCodes = incident.gb_event_type
    ? [incident.gb_event_type]
    : mapping?.gbEventCodes ?? [];

  const gbCodesStr = gbCodes
    .map((c) => `${c} ${GB_EVENT_CODE_NAMES[c]?.zh ?? ""}`)
    .join("、");

  const date = incident.date;
  const time = incident.time || "未记录";
  const desc = incident.description_cn?.trim() || incident.description.trim();

  return `# 立即报告（GB/T《智能网联汽车 安全事件数据交互与管理系统技术规范》附录 C 格式）

## 基本信息

| 字段 | 内容 |
|---|---|
| 报告编号 | ROAM-${incident.id} |
| 企业名称 | ${incident.operator} |
| 事件发生日期 | ${date} |
| 事件发生时间 | ${time} |
| 事件发生地点 | ${incident.location.city}${incident.location.specific ? "（" + incident.location.specific + "）" : ""} |
| 驾驶自动化等级 | ${incident.driving_automation_level || "待补充（参照 GB/T 44373）"} |
| VIN（脱敏） | ${incident.vin_masked || "待补充"} |
| 车辆型号 | ${incident.vehicle_model || "待补充"} |

## 事件类型

**GB/T 附录 B 事件编码**：${gbCodesStr || "待映射"}

**ROAM 场景代码**：${incident.scenario.primary}${incident.scenario.secondary?.length ? "（辅助场景：" + incident.scenario.secondary.join("、") + "）" : ""}

**严重度 / 紧急度**：${incident.severity} / ${incident.urgency ?? "U0"}

## 事件描述

${desc}

## 影响

${incident.impact ? renderImpact(incident.impact) : "待补充"}

## 应急响应

${incident.emergency_response ? renderEmergency(incident.emergency_response, incident.description_cn ? "zh" : "en") : "待补充"}

## 根本原因分析

${
  incident.root_cause
    ? `- **类别**：${incident.root_cause.category_cn || incident.root_cause.category}
- **描述**：${incident.root_cause.description_cn || incident.root_cause.description}
- **确认状态**：${incident.root_cause.confirmed ? "已确认" : "调查中"}`
    : "待补充"
}

## 系统性问题

${
  incident.systemic_issues_cn?.length
    ? incident.systemic_issues_cn.map((s) => `- ${s}`).join("\n")
    : incident.systemic_issues?.length
    ? incident.systemic_issues.map((s) => `- ${s}`).join("\n")
    : "待补充"
}

## 监管行动

${
  incident.regulatory_action_cn?.trim() ||
  incident.regulatory_action?.trim() ||
  "待补充"
}

## 信息来源

${
  incident.sources?.length
    ? incident.sources.map((s) => `- [${s.title}](${s.url})`).join("\n")
    : "待补充"
}

---

**数据上报填写说明**：

1. 本模板仅为参考格式，实际提交时应按 GB/T 附录 C.2 的字段顺序填写。
2. 本记录来自 ROAM 开源数据库（https://roam.autozyx.com），对于海外事件，仅作对标参考，不作为监管合规数据。
3. 中国境内事件企业应按 GB/T 7.1-7.3 要求通过加密协议（SM2/SM4/RSA/AES128）直接上报至国家平台。
4. 响应层级（ROAM Layer）：${
    incident.response_layer_actual
      ? `Layer ${incident.response_layer_actual}`
      : "未记录"
  }

**生成时间**：${new Date().toISOString()}
**生成工具**：ROAM Explorer (https://roam-explorer.autozyx.com)
`;
}

function renderImpact(i: Incident["impact"]): string {
  if (!i) return "";
  const parts: string[] = [];
  if (i.vehicles_affected != null) parts.push(`受影响车辆：${i.vehicles_affected} 辆`);
  if (i.duration_minutes != null) parts.push(`持续时间：${i.duration_minutes} 分钟`);
  if (i.traffic_disruption) parts.push(`交通影响：${i.traffic_disruption}`);
  if (i.injuries != null) parts.push(`受伤人数：${i.injuries}`);
  if (i.fatalities != null) parts.push(`死亡人数：${i.fatalities}`);
  return parts.map((p) => `- ${p}`).join("\n");
}

function renderEmergency(
  e: NonNullable<Incident["emergency_response"]>,
  _lang: string
): string {
  const parts: string[] = [];
  if (e.sos_button) parts.push(`SOS 按钮：${e.sos_button}`);
  if (e.customer_service) parts.push(`客服响应：${e.customer_service}`);
  if (e.remote_intervention) parts.push(`远程干预：${e.remote_intervention}`);
  if (e.on_site_response) parts.push(`现场处置：${e.on_site_response}`);
  if (e.resolution_method_cn || e.resolution_method)
    parts.push(`解决方式：${e.resolution_method_cn || e.resolution_method}`);
  return parts.map((p) => `- ${p}`).join("\n");
}
