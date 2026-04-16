# AD Standards Tracker

> 自动驾驶标准与法规追踪 · Autonomous-Driving Standards & Regulations Tracker

中英双语追踪全球自动驾驶 / 智能网联汽车领域的标准、法规、征求意见与型式认证动态。

**Maintainer**: 张玉新副教授 (Assoc. Prof. Zhang Yuxin), Jilin University — College of Automotive Engineering · Joint Lab for Autonomous-Driving Safety.
**Contact**: zhangyuxin@jlu.edu.cn

## Coverage

- 🇺🇳 UNECE WP.29 / GRVA, ISO TC22/SC33
- 🇨🇳 SAC/TC114/SC34, 工信部, 市场监督管理总局, 交通运输部, CATARC, CAERI, CMC, 北京/上海/深圳示范区
- 🇺🇸 NHTSA, California DMV, SAE (J3016/J3018/J3131/...), UL 4600, IEEE 2846/2848
- 🇪🇺 European Commission DG MOVE, Euro NCAP, UK CCAV
- 🇯🇵 METI, MLIT

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- YAML-first data (`standards/{jurisdiction}/{year}/{id}.yaml`)
- GitHub Actions daily crawler (`tools/crawler/`)

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Data schema

See `lib/types.ts`. One record per YAML file, indexed on build. Only metadata and source URLs are stored — no full-text reproduction of the standards.

## License

- Code: MIT
- Data (metadata index): CC BY 4.0 — attribute "AD Standards Tracker (AutoZYX)"
- Linked standard documents remain the property of their issuing bodies.
