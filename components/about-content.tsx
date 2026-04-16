"use client";

import { useI18n } from "@/lib/i18n";

export default function AboutContent() {
  const { lang } = useI18n();
  const cn = lang === "zh";

  return (
    <article className="prose max-w-3xl space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">
        {cn ? "关于" : "About"}
      </h1>

      {cn ? (
        <>
          <p>
            <b>自动驾驶标准追踪 (AD Standards Tracker)</b>{" "}
            是一个中英双语、开源的元数据索引，面向自动驾驶与智能网联汽车领域，追踪全球主要 SDO
            与监管机构的标准、法规、征求意见与型式认证动态。
          </p>
          <p>
            维护者：<b>张玉新副教授</b>，吉林大学汽车工程学院，自动驾驶安全联合实验室主任。
          </p>
          <h2 className="text-xl font-semibold mt-6">为什么做这个</h2>
          <ul className="list-disc list-inside">
            <li>UNECE、ISO、SAC、NHTSA、SAE、UL、IEEE、Euro NCAP、METI、MLIT 等机构各自独立发布，标准分散、中英参差；</li>
            <li>L3/L4 条例与征求意见窗口期短、容易错过；</li>
            <li>研究人员、OEM 合规团队与政策咨询方需要一个可靠、可引用的“首要来源”导航。</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">方法论</h2>
          <ul className="list-disc list-inside">
            <li>每日 GitHub Actions 爬虫遵守 <code>robots.txt</code>，仅抓取公开页面；</li>
            <li>User-Agent 固定：<code>AD-Standards-Tracker-Bot/1.0 (contact: zhangyuxin@jlu.edu.cn)</code>；</li>
            <li>结构化 YAML（<code>standards/{"{jurisdiction}/{year}"}/{"{id}"}.yaml</code>），字段含状态、辖区、类型、主题、自动化等级、官方链接；</li>
            <li>不转发标准全文，仅元数据 + 链接；</li>
            <li>分类与术语遵循 SAE J3016 自动化等级与国内行业惯用表述（智能网联汽车、征求意见、型式认证等）。</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">许可</h2>
          <ul className="list-disc list-inside">
            <li>代码：MIT</li>
            <li>元数据：CC BY 4.0 — 需署名“AD Standards Tracker (AutoZYX)”</li>
            <li>所链接标准全文版权归原发布机构</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">联系</h2>
          <p>
            反馈、勘误与新数据源建议：
            <a href="mailto:zhangyuxin@jlu.edu.cn">zhangyuxin@jlu.edu.cn</a> ·{" "}
            <a href="https://github.com/AutoZYX/ad-standards-tracker" target="_blank" rel="noreferrer">
              GitHub Issues
            </a>
            。
          </p>
        </>
      ) : (
        <>
          <p>
            <b>AD Standards Tracker</b> is a bilingual, open-source metadata index covering
            standards, regulations, consultations and type-approval activity for autonomous and
            connected vehicles, across the main global SDOs and regulators.
          </p>
          <p>
            Maintained by <b>Associate Professor Zhang Yuxin</b>, Jilin University — College of
            Automotive Engineering, Director of the Joint Laboratory for Autonomous Driving Safety.
          </p>
          <h2 className="text-xl font-semibold mt-6">Why this exists</h2>
          <ul className="list-disc list-inside">
            <li>Bodies like UNECE, ISO, SAC/TC114, NHTSA, SAE, UL, IEEE, Euro NCAP, METI and MLIT publish independently — visibility is fragmented.</li>
            <li>Consultation windows for L3/L4 regulations are short and easy to miss.</li>
            <li>Researchers, OEM compliance teams and policy advisors need a reliable, citable index of primary sources.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Methodology</h2>
          <ul className="list-disc list-inside">
            <li>A daily GitHub Actions crawler respects <code>robots.txt</code> and only fetches public pages.</li>
            <li>Fixed User-Agent: <code>AD-Standards-Tracker-Bot/1.0 (contact: zhangyuxin@jlu.edu.cn)</code>.</li>
            <li>Structured YAML (<code>standards/{"{jurisdiction}/{year}/{id}"}.yaml</code>) with status, jurisdiction, type, topics, automation levels and official link.</li>
            <li>No full-text redistribution — metadata and links only.</li>
            <li>Taxonomy follows SAE J3016 automation levels and standard Chinese industry terminology where applicable.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Licensing</h2>
          <ul className="list-disc list-inside">
            <li>Code: MIT</li>
            <li>Metadata: CC BY 4.0 — attribute &ldquo;AD Standards Tracker (AutoZYX)&rdquo;</li>
            <li>Copyright for the underlying standards remains with their issuing bodies.</li>
          </ul>
          <h2 className="text-xl font-semibold mt-6">Contact</h2>
          <p>
            Corrections and new-source suggestions:{" "}
            <a href="mailto:zhangyuxin@jlu.edu.cn">zhangyuxin@jlu.edu.cn</a> ·{" "}
            <a href="https://github.com/AutoZYX/ad-standards-tracker" target="_blank" rel="noreferrer">
              GitHub Issues
            </a>
            .
          </p>
        </>
      )}
    </article>
  );
}
