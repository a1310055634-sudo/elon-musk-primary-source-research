"use client";

import { useMemo, useState } from "react";

type Source = {
  year: string;
  title: string;
  kind: "财报" | "公司活动" | "采访";
  publisher: string;
  official: boolean;
  transcript: "完整" | "片段" | "待建";
  archive: string;
  original: string;
  note: string;
};

const sources: Source[] = [
  { year: "2023", title: "Tesla Q3 财报电话会", kind: "财报", publisher: "Tesla", official: true, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-q3-2023-earnings-call-2023-10-18", original: "https://www.youtube.com/watch?v=O5aJbvWr4gs", note: "Cybertruck量产、利率与成本" },
  { year: "2023", title: "Tesla Q1 财报电话会", kind: "财报", publisher: "Tesla", official: true, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-q1-2023-earnings-call-2023-04-19", original: "https://www.youtube.com/watch?v=3MVIWeU36ZY", note: "降价、利润率与Cybertruck时间表" },
  { year: "2022", title: "Tesla Q3 财报电话会", kind: "财报", publisher: "CNET Highlights", official: false, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-q3-2022-earnings-call-2022-10-19", original: "https://www.youtube.com/watch?v=t0pZPz23T80", note: "利润率、现金流与需求判断" },
  { year: "2020", title: "Tesla Q3 财报电话会", kind: "财报", publisher: "Solving The Money Problem", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-q3-2020-earnings-call-2020-10-21", original: "https://www.youtube.com/watch?v=U_Zr-bhHW9A", note: "FSD、产能与工厂扩张" },
  { year: "2020", title: "Tesla Q2 财报电话会", kind: "财报", publisher: "Solving The Money Problem", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-q2-2020-earnings-call-2020-07-22", original: "https://www.youtube.com/watch?v=3lvmOJGC_es", note: "Austin工厂、连续盈利与FSD" },
  { year: "2020", title: "Tesla Q1 财报电话会", kind: "财报", publisher: "Solving The Money Problem", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-q1-2020-earnings-call-2020-04-29", original: "https://www.youtube.com/watch?v=vEvXfHHEdNc", note: "疫情、停工、盈利与自动驾驶" },
  { year: "2020", title: "Tesla 2019 Q4 财报电话会", kind: "财报", publisher: "Solving The Money Problem", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-q4-2019-earnings-call-2020-01-29", original: "https://www.youtube.com/watch?v=LTOetiSVJnc", note: "Cybertruck与2020年展望" },
  { year: "2018", title: "Tesla Q2 财报电话会", kind: "财报", publisher: "AlphaStreet", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-q2-2018-earnings-call-2018-08-02", original: "https://www.youtube.com/watch?v=1I9UtyZMTek", note: "Model 3产能、Autopilot与自研芯片" },
  { year: "2018", title: "Tesla Q1 财报相关节目", kind: "财报", publisher: "HyperChange", official: false, transcript: "片段", archive: "https://elonmuskarchive.org/entry/tesla-q1-2018-earnings-call-2018-05-02", original: "https://www.youtube.com/watch?v=gK3oRIvePJA", note: "包含主持人与评论者，不是完整财报" },
  { year: "2016", title: "Tesla–SolarCity 收购电话会", kind: "公司活动", publisher: "Electrek", official: false, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-solarcity-acquisition-call-2016-06-22", original: "https://www.youtube.com/watch?v=dm3q5ABMP14", note: "收购理由与能源愿景" },
  { year: "2019", title: "Tesla Autonomy Day", kind: "公司活动", publisher: "Tesla", official: true, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-autonomy-day-2019", original: "https://www.youtube.com/watch?v=Ucp0TTmvqOE", note: "FSD芯片、神经网络与Robotaxi预测" },
  { year: "2022", title: "Tesla 股东大会", kind: "公司活动", publisher: "CNET Highlights", official: false, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-shareholder-meeting-2022-08-04", original: "https://www.youtube.com/watch?v=pnXy8c0GOpE", note: "公司更新与股东问答" },
  { year: "2022", title: "Tesla AI Day", kind: "公司活动", publisher: "Tesla", official: true, transcript: "完整", archive: "https://elonmuskarchive.org/entry/tesla-ai-day-2022", original: "https://www.youtube.com/watch?v=ODSJsviD_SU", note: "Optimus、Dojo与自动驾驶AI" },
  { year: "2023", title: "Tesla Investor Day", kind: "公司活动", publisher: "Tesla", official: true, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-investor-day-2023-03-01", original: "https://www.youtube.com/watch?v=Hl1zEzVUV7w", note: "Master Plan 3与下一代平台" },
  { year: "2023", title: "Tesla 股东大会", kind: "公司活动", publisher: "Tesla", official: true, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-shareholder-meeting-2023-05-16", original: "https://www.youtube.com/watch?v=bZNL_8bUz6A", note: "FSD、Cybertruck与公司更新" },
  { year: "2024", title: "Tesla 股东大会", kind: "公司活动", publisher: "Benzinga", official: false, transcript: "待建", archive: "https://elonmuskarchive.org/entry/tesla-shareholder-meeting-2024-06-13", original: "https://www.youtube.com/watch?v=UQhnxPu67G4", note: "薪酬方案、迁册与AI" },
  { year: "2025", title: "X Takeover", kind: "公司活动", publisher: "Tesla Owners Silicon Valley", official: false, transcript: "完整", archive: "https://elonmuskarchive.org/entry/x-takeover-2025-musk", original: "https://www.youtube.com/watch?v=YqDehngsBHw", note: "Robotaxi、Optimus与Tesla Semi" },
  { year: "2025", title: "CNBC David Faber 采访", kind: "采访", publisher: "CNBC", official: true, transcript: "完整", archive: "https://elonmuskarchive.org/entry/cnbc-faber-musk-2025", original: "https://www.cnbc.com/2025/05/20/cnbc-transcript-elon-musk-sits-down-with-cnbcs-david-faber-live-on-cnbc-today-.html", note: "Austin无人驾驶上线前追问" },
];

const timeline = [
  { year: "2014", type: "概念", title: "Autopilot与完全自动驾驶的边界", body: "早期采访中区分辅助驾驶与完全自主驾驶，作为后续术语变化的基准。", archive: "https://elonmuskarchive.org/entry/interview-with-bloomberg-2014-10-10", original: "https://www.youtube.com/watch?v=Bjq6tXRKfUQ" },
  { year: "2015", type: "预测", title: "高速公路自动驾驶与时间判断", body: "记录对近期高速公路能力和更长期完全自动驾驶的预测版本。", archive: "https://elonmuskarchive.org/entry/interview-in-denmark-2015-09-15", original: "https://www.youtube.com/watch?v=bl5vLC3Xlgc" },
  { year: "2018", type: "财报", title: "coast-to-coast延期与自研计算机", body: "把分析师问题、延期解释、硬件主张和后续产品节点连接起来。", archive: "https://elonmuskarchive.org/entry/tesla-q2-2018-earnings-call-2018-08-02", original: "https://www.youtube.com/watch?v=1I9UtyZMTek" },
  { year: "2019", type: "产品", title: "Autonomy Day与Robotaxi网络", body: "FSD芯片、神经网络、车队学习以及Robotaxi时间预测集中出现。", archive: "https://elonmuskarchive.org/entry/tesla-autonomy-day-2019", original: "https://www.youtube.com/watch?v=Ucp0TTmvqOE" },
  { year: "2020", type: "产品", title: "FSD Beta与商业模型", body: "有限测试、功能描述、规模预测与Robotaxi商业模式必须分开记录。", archive: "https://elonmuskarchive.org/entry/tesla-q3-2020-earnings-call-2020-10-21", original: "https://www.youtube.com/watch?v=U_Zr-bhHW9A" },
  { year: "2022", type: "技术", title: "AI Day：数据、训练与Dojo", body: "从产品承诺转向数据闭环、训练基础设施和端到端AI方法。", archive: "https://elonmuskarchive.org/entry/tesla-ai-day-2022", original: "https://www.youtube.com/watch?v=ODSJsviD_SU" },
  { year: "2023", type: "监管", title: "NHTSA Recall 23V838", body: "驾驶员参与控制与软件补救成为正式监管行动节点。", archive: "https://static.nhtsa.gov/odi/rcl/2023/RCLQRT-23V838-0414.PDF", original: "https://static.nhtsa.gov/odi/rcl/2023/RCLQRT-23V838-0414.PDF" },
  { year: "2024", type: "产品", title: "We, Robot与Cybercab", body: "现场展示、无监督FSD预测、Cybercab产品与量产时间分别建档。", archive: "https://elonmuskarchive.org/entry/we-robot-robotaxi-reveal-2024-10-10", original: "https://www.youtube.com/watch?v=6v6dbxPlsXs" },
  { year: "2025", type: "追问", title: "Austin上线前的CNBC追问", body: "保存记者追问、上线条件与马斯克的明确回答。", archive: "https://elonmuskarchive.org/entry/cnbc-faber-musk-2025", original: "https://www.cnbc.com/2025/05/20/cnbc-transcript-elon-musk-sits-down-with-cnbcs-david-faber-live-on-cnbc-today-.html" },
  { year: "2025", type: "运营", title: "Austin Robotaxi上线声明", body: "本人宣布有限范围服务上线；车辆数量、安全安排与持续运营仍需外部资料核验。", archive: "https://elonmuskarchive.org/posts/1936834688188129503", original: "https://x.com/elonmusk/status/1936834688188129503" },
];

const cases = [
  { title: "FSD / Autopilot", years: "2014—2025", state: "首条完整样板", detail: "10个节点 · 8张主张—行动卡规划" },
  { title: "Twitter 收购", years: "2022", state: "资料装配中", detail: "SEC文件 · 法院短信 · 最终交割" },
  { title: "Funding secured", years: "2018—2026", state: "骨架完成", detail: "原帖 · SEC证词 · 法院材料" },
  { title: "竞选与DOGE", years: "2024—2025", state: "待补关键材料", detail: "集会 · 政府记者会 · 离任" },
];

export function ResearchApp() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("全部");
  const [timelineType, setTimelineType] = useState("全部");

  const filtered = useMemo(() => sources.filter((source) => {
    const haystack = `${source.title} ${source.note} ${source.publisher} ${source.year}`.toLowerCase();
    return (kind === "全部" || source.kind === kind) && haystack.includes(query.toLowerCase());
  }), [query, kind]);

  const filteredTimeline = timeline.filter((item) => timelineType === "全部" || item.type === timelineType);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top"><span className="brand-mark">M</span><span>马斯克一手言行研究档案</span></a>
        <nav aria-label="主导航">
          <a href="#cases">事件档案</a><a href="#fsd">FSD时间线</a><a href="#sources">资料库</a><a href="#method">方法</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">PRIMARY-SOURCE RESEARCH ARCHIVE</div>
        <h1>不要只看他说了什么。<br /><span>还要看后来发生了什么。</span></h1>
        <p className="hero-copy">从原视频、原帖和正式文件出发，把马斯克的公开表达放回真实情境，并与Tesla的产品行动、监管文件和后续结果相互对照。</p>
        <div className="hero-actions"><a className="button primary" href="#fsd">查看FSD时间线</a><a className="button secondary" href="#sources">浏览18项核验资料</a></div>
        <div className="metrics" aria-label="网站数据">
          <div><strong>18</strong><span>Tesla核验资料</span></div><div><strong>10</strong><span>FSD时间节点</span></div><div><strong>65+</strong><span>可追溯外部链接</span></div><div><strong>0</strong><span>登录墙财报入口</span></div>
        </div>
      </section>

      <section className="section" id="cases">
        <div className="section-heading"><div><span className="index">01</span><h2>从事件开始研究</h2></div><p>资料不是孤立链接。每个事件把本人表态、正式文件、公司行动和结果串成证据链。</p></div>
        <div className="case-grid">{cases.map((item) => <article className="case-card" key={item.title}><div className="case-top"><span>{item.years}</span><span className="state">{item.state}</span></div><h3>{item.title}</h3><p>{item.detail}</p><span className="case-link">进入事件档案 →</span></article>)}</div>
      </section>

      <section className="section fsd-section" id="fsd">
        <div className="section-heading"><div><span className="index">02</span><h2>FSD / Autopilot主题时间线</h2></div><p>从概念定义到有限范围运营，分别查看预测、产品阶段、监管动作和实际结果。</p></div>
        <div className="filter-row" role="group" aria-label="时间线筛选">{["全部", "概念", "预测", "财报", "产品", "技术", "监管", "追问", "运营"].map((item) => <button className={timelineType === item ? "active" : ""} key={item} onClick={() => setTimelineType(item)}>{item}</button>)}</div>
        <div className="timeline">{filteredTimeline.map((item) => <article className="timeline-item" key={`${item.year}-${item.title}`}><div className="timeline-year">{item.year}</div><div className="timeline-dot" /><div className="timeline-content"><span className={`type type-${item.type}`}>{item.type}</span><h3>{item.title}</h3><p>{item.body}</p><div className="source-actions"><a href={item.archive} target="_blank" rel="noreferrer">档案/文件</a><a href={item.original} target="_blank" rel="noreferrer">原始来源 ↗</a></div></div></article>)}</div>
      </section>

      <section className="section" id="sources">
        <div className="section-heading"><div><span className="index">03</span><h2>Tesla公司沟通资料库</h2></div><p>每项资料都区分发布者、官方身份、转录状态和原始平台。</p></div>
        <div className="library-tools"><label className="search"><span>搜索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="FSD、Cybertruck、利润率……" /></label><div className="tabs">{["全部", "财报", "公司活动", "采访"].map((item) => <button className={kind === item ? "active" : ""} key={item} onClick={() => setKind(item)}>{item}</button>)}</div></div>
        <div className="results-count">显示 {filtered.length} / {sources.length} 项资料</div>
        <div className="source-grid">{filtered.map((source) => <article className="source-card" key={`${source.year}-${source.title}`}><div className="source-meta"><span>{source.year} · {source.kind}</span><span className={source.official ? "official" : "third-party"}>{source.official ? "官方发布" : "第三方发布"}</span></div><h3>{source.title}</h3><p>{source.note}</p><dl><div><dt>发布者</dt><dd>{source.publisher}</dd></div><div><dt>转录</dt><dd className={`transcript transcript-${source.transcript}`}>{source.transcript === "完整" ? "接近完整" : source.transcript}</dd></div></dl><div className="source-actions"><a href={source.archive} target="_blank" rel="noreferrer">直接阅读</a><a href={source.original} target="_blank" rel="noreferrer">原始平台 ↗</a></div></article>)}</div>
      </section>

      <section className="section method-section" id="method">
        <div className="section-heading"><div><span className="index">04</span><h2>如何判断一条资料可信</h2></div><p>网站提供证据，不替用户自动判定动机。</p></div>
        <div className="method-grid"><article><span>S</span><h3>原始证据</h3><p>本人账号、公司官方频道、监管与法院正式文件。</p></article><article><span>A</span><h3>完整采访</h3><p>采访制作方发布的完整原片或完整音频。</p></article><article><span>C</span><h3>辅助定位</h3><p>第三方档案、自动转录和镜像；关键引文必须回查。</p></article><article><span>?</span><h3>保留未知</h3><p>无法确认的结果明确标记，不把推测包装成结论。</p></article></div>
        <div className="notice"><strong>独立研究项目</strong><p>本站与Elon Musk、Tesla及Elon Musk Archive无隶属关系。外部视频、文字与商标归各自权利人所有；本站仅提供研究导航、短引和来源关系。</p></div>
      </section>

      <footer><div className="brand footer-brand"><span className="brand-mark">M</span><span>马斯克一手言行研究档案</span></div><p>从事件出发，回到原始证据。</p><a href="#top">返回顶部 ↑</a></footer>
    </main>
  );
}
