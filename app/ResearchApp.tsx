"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  drills,
  patterns,
  sourceById,
  sources,
  timeline,
  type Drill,
  type EvidenceSource,
  type Pattern,
} from "./behavior-data";

type View = "home" | "case" | "sources" | "patterns" | "lab" | "journal" | "method";

type JournalEntry = {
  id: string;
  createdAt: string;
  title: string;
  reflection: string;
  nextAction: string;
};

const viewLabels: Record<View, string> = {
  home: "首页",
  case: "FSD 案例",
  sources: "证据库",
  patterns: "模式库",
  lab: "训练室",
  journal: "行动日志",
  method: "方法",
};

function isView(value: string): value is View {
  return Object.prototype.hasOwnProperty.call(viewLabels, value);
}
function isJournalEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<JournalEntry>;
  return [entry.id, entry.createdAt, entry.title, entry.reflection, entry.nextAction].every(
    (field) => typeof field === "string",
  );
}
function sourceLabel(source: EvidenceSource) {
  return `${source.date} · ${source.category}`;
}

function EvidenceBadge({ level }: { level: EvidenceSource["evidenceLevel"] }) {
  const labels = {
    S: "S · 原始 / 正式材料",
    A: "A · 完整采访材料",
    C: "C · 辅助定位材料",
  };

  return <span className={`evidence-badge evidence-${level}`}>{labels[level]}</span>;
}

function EvidenceLink({
  sourceId,
  onOpen,
  compact = false,
}: {
  sourceId: string;
  onOpen: (id: string) => void;
  compact?: boolean;
}) {
  const source = sourceById[sourceId];
  if (!source) return null;

  return (
    <button className={compact ? "source-inline" : "source-reference"} onClick={() => onOpen(sourceId)}>
      <span>{compact ? source.title : "查看证据资料"}</span>
      {!compact && <small>{sourceLabel(source)}</small>}
      <span aria-hidden="true">↗</span>
    </button>
  );
}
function SourceDialog({ source, onClose }: { source: EvidenceSource; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    closeButtonRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="source-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dialog-topline">
          <div className="eyebrow">资料详情 · 可核验证据</div>
          <button ref={closeButtonRef} className="icon-button" onClick={onClose} aria-label="关闭资料详情">×</button>
        </div>
        <div className="source-detail-head">
          <div>
            <p>{sourceLabel(source)}</p>
            <h2 id="source-dialog-title">{source.title}</h2>
          </div>
          <EvidenceBadge level={source.evidenceLevel} />
        </div>
        <div className="detail-meta-grid">
          <div><span>发布者</span><strong>{source.publisher}</strong></div>
          <div><span>材料完整度</span><strong>{source.completeness}</strong></div>
          <div><span>来源身份</span><strong>{source.official ? "官方或本人来源" : "外部采访 / 媒体来源"}</strong></div>
          <div><span>主题标签</span><strong>{source.tags.join(" · ")}</strong></div>
        </div>
        <div className="detail-section">
          <h3>当时情境</h3>
          <p>{source.context}</p>
        </div>
        <div className="detail-section emphasis-section">
          <h3>研究要点</h3>
          <p>{source.researchNote}</p>
        </div>
        <div className="detail-section">
          <h3>核验提醒</h3>
          <p>{source.verificationNote}</p>
        </div>
        <div className="source-dialog-actions">
          <a className="button button-dark" href={source.primaryUrl} target="_blank" rel="noreferrer">打开原始来源</a>
          <a className="button button-light" href={source.archiveUrl} target="_blank" rel="noreferrer">打开备用档案</a>
        </div>
      </section>
    </div>
  );
}

function PatternCard({
  pattern,
  onOpenSource,
  expanded,
  onToggle,
}: {
  pattern: Pattern;
  onOpenSource: (id: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`pattern-card ${expanded ? "is-expanded" : ""}`}>
      <div className="pattern-topline"><span>{pattern.number}</span><span>模式假设</span></div>
      <h3>{pattern.title}</h3>
      <p>{pattern.summary}</p>
      <button className="text-button" onClick={onToggle}>{expanded ? "收起分析" : "展开分析"} <span aria-hidden="true">{expanded ? "↑" : "→"}</span></button>
      {expanded && (
        <div className="pattern-detail">
          <div><span>可观察行为</span><p>{pattern.observed}</p></div>
          <div><span>支持材料</span><div className="inline-source-list">{pattern.supportIds.map((id) => <EvidenceLink key={id} sourceId={id} onOpen={onOpenSource} compact />)}</div></div>
          <div><span>适用边界</span><p>{pattern.boundary}</p></div>
          <div className="counter"><span>反证 / 保留项</span><p>{pattern.counterEvidence}</p></div>
          <div className="practice"><span>小型练习</span><p>{pattern.practice}</p></div>
        </div>
      )}
    </article>
  );
}

export function ResearchApp() {
  const [view, setView] = useState<View>("home");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceCategory, setSourceCategory] = useState("全部");
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(patterns[0].id);
  const [selectedDrillId, setSelectedDrillId] = useState(drills[0].id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalReflection, setJournalReflection] = useState("");
  const [journalAction, setJournalAction] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const syncView = () => {
      const candidate = window.location.hash.replace("#", "");
      if (isView(candidate)) setView(candidate);
    };
    syncView();
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("musk-behavior-lab-journal");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setJournal(parsed.filter(isJournalEntry));
      }
    } catch {
      // Local storage may be unavailable in private browser contexts.
    }
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    if (typeof window !== "undefined") {
      window.location.hash = nextView;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openSource = (id: string) => setSelectedSourceId(id);
  const selectedSource = selectedSourceId ? sourceById[selectedSourceId] : undefined;
  const selectedDrill = drills.find((drill) => drill.id === selectedDrillId) ?? drills[0];

  const filteredSources = useMemo(() => {
    const query = sourceQuery.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesCategory = sourceCategory === "全部" || source.category === sourceCategory;
      const haystack = `${source.title} ${source.publisher} ${source.tags.join(" ")} ${source.researchNote}`.toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [sourceCategory, sourceQuery]);

  const saveJournal = (entry: JournalEntry) => {
    const nextEntries = [entry, ...journal];
    setJournal(nextEntries);
    try {
      window.localStorage.setItem("musk-behavior-lab-journal", JSON.stringify(nextEntries));
      setSavedMessage("已保存到这台设备的行动日志。");
    } catch {
      setSavedMessage("此浏览器无法保存本地日志；你仍可以复制这段内容。 ");
    }
  };

  const saveDrillToJournal = () => {
    const pattern = patterns.find((item) => item.id === selectedDrill.patternId);
    const answer = answers[selectedDrill.id]?.trim() || "尚未填写初步回应。";
    saveJournal({
      id: `${selectedDrill.id}-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("zh-CN"),
      title: `训练：${selectedDrill.title}`,
      reflection: answer,
      nextAction: pattern ? pattern.practice : selectedDrill.nextExperiment,
    });
  };

  const saveManualJournal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!journalTitle.trim() || !journalReflection.trim() || !journalAction.trim()) {
      setSavedMessage("请补全标题、复盘和下一步行动后再保存。 ");
      return;
    }
    saveJournal({
      id: `manual-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("zh-CN"),
      title: journalTitle.trim(),
      reflection: journalReflection.trim(),
      nextAction: journalAction.trim(),
    });
    setJournalTitle("");
    setJournalReflection("");
    setJournalAction("");
  };

  const renderHome = () => (
    <>
      <section className="hero lab-hero">
        <div className="hero-copy-column">
          <div className="eyebrow">EVIDENCE-BASED BEHAVIOR LAB</div>
          <p className="hero-kicker">研究公开行为，练习自己的判断。</p>
          <h1>不是复刻一个人。<span>而是把可验证的行为方式，变成你的行动能力。</span></h1>
          <p className="hero-copy">从原视频、公开帖子、正式文件和后续结果出发，观察马斯克在技术不确定、公开压力与高目标场景中的决策与沟通方式。每一层都保留证据、反例与未知项。</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => navigate("case")}>进入 FSD 行为案例</button>
            <button className="button button-light" onClick={() => navigate("lab")}>开始一次情景训练</button>
          </div>
        </div>
        <aside className="hero-compass" aria-label="研究闭环">
          <p>学习闭环</p>
          <ol>
            <li><span>01</span><div><strong>证据</strong><small>回到原始材料</small></div></li>
            <li><span>02</span><div><strong>案例</strong><small>放回真实情境</small></div></li>
            <li><span>03</span><div><strong>模式</strong><small>保留反例与边界</small></div></li>
            <li><span>04</span><div><strong>训练</strong><small>转化为自己的行动</small></div></li>
          </ol>
        </aside>
      </section>

      <section className="page-section home-overview">
        <div className="section-intro">
          <div><span className="index">01</span><h2>从资料导航，升级为行为学习系统</h2></div>
          <p>网站不替你判断“他真实是什么样的人”。它只呈现可追溯的公开行为，并帮助你检验：什么策略有效、什么代价不可忽略、什么根本无法判断。</p>
        </div>
        <div className="layer-grid">
          <article><span className="layer-number">01</span><h3>证据层</h3><p>12 条已建档材料，原始来源优先，备用档案保留。</p><button onClick={() => navigate("sources")}>浏览证据库 →</button></article>
          <article><span className="layer-number">02</span><h3>行为层</h3><p>FSD 案例把情境、主张、行动与后果放在一起。</p><button onClick={() => navigate("case")}>阅读 FSD 案例 →</button></article>
          <article><span className="layer-number">03</span><h3>模式层</h3><p>四张模式卡同时呈现支持材料、反证与适用边界。</p><button onClick={() => navigate("patterns")}>查看模式库 →</button></article>
          <article><span className="layer-number">04</span><h3>训练层</h3><p>四个真实压力情境，帮助你形成自己的回应方式。</p><button onClick={() => navigate("lab")}>进入训练室 →</button></article>
        </div>
      </section>

      <section className="page-section featured-case-section">
        <div className="featured-case-copy">
          <span className="index">首条完整样板</span>
          <h2>FSD / Autopilot：<br />当公开预测遇到产品、监管与运营现实。</h2>
          <p>从早期概念、时间判断、Autonomy Day、Beta、监管文件，到 Austin 运营节点。不是判断谁对谁错，而是追踪公开表达与可观察行动如何相互关联。</p>
          <button className="button button-cream" onClick={() => navigate("case")}>研究这个案例</button>
        </div>
        <div className="featured-case-stats">
          <div><strong>10</strong><span>时间节点</span></div>
          <div><strong>12</strong><span>可核验资料</span></div>
          <div><strong>4</strong><span>行为模式</span></div>
          <div><strong>4</strong><span>训练情境</span></div>
        </div>
      </section>

      <section className="page-section principles-section">
        <div className="section-intro compact-intro"><div><span className="index">研究原则</span><h2>先看证据，再谈模式。</h2></div></div>
        <div className="principle-row">
          <div><strong>事实</strong><p>原视频、原帖、正式文件和可复查时间节点。</p></div>
          <div><strong>推断</strong><p>从多个案例中归纳出的可观察策略，不能当作内心动机。</p></div>
          <div><strong>未知</strong><p>资料不足、因果不明或仍在发展中的结果，明确保留。</p></div>
        </div>
      </section>
    </>
  );

  const renderCase = () => (
    <>
      <section className="case-hero">
        <div>
          <button className="back-button" onClick={() => navigate("home")}>← 返回学习首页</button>
          <div className="eyebrow">行为案例 · 01 / 完整样板</div>
          <h1>FSD / Autopilot</h1>
          <p className="case-hero-question">研究问题：当技术目标、公开时间判断、监管约束与实际交付发生冲突时，公开表达与后续行动如何相互关联？</p>
          <div className="case-tag-row"><span>2014—2025</span><span>10 个节点</span><span>12 条材料</span><span>结果持续更新</span></div>
        </div>
        <aside className="case-side-note"><span>阅读方式</span><ol><li>先看材料</li><li>再看行为观察</li><li>最后比较模式与边界</li></ol></aside>
      </section>

      <section className="page-section case-intro-grid">
        <article className="research-question"><span>案例摘要</span><h2>不要把公开预测、技术展示、产品测试和运营结果当成同一件事。</h2><p>本案例把它们拆开记录。这样既能看见长期愿景如何被表达，也能看见哪些信息仍需要监管、产品和运营材料来补充。</p></article>
        <article className="uncertainty-card"><span>必须保留的未知</span><p>公开资料只能显示发言、行动和可观察结果；它不能证明某个判断背后的私人动机，也不能用单一事件概括一个人的全部行为方式。</p></article>
      </section>

      <section className="page-section">
        <div className="section-intro"><div><span className="index">证据时间线</span><h2>情境—观察—行动—结果</h2></div><p>每一项都链接到可阅读的资料详情。时间线不是结论，它是让读者自行比对的证据框架。</p></div>
        <div className="evidence-timeline">
          {timeline.map((item) => {
            const source = sourceById[item.sourceId];
            return (
              <article className="evidence-event" key={item.id}>
                <div className="timeline-date"><strong>{item.year}</strong><span>{item.type}</span></div>
                <div className="timeline-rail" />
                <div className="event-body">
                  <div className="event-title-line"><h3>{item.title}</h3><span className={`certainty certainty-${item.certainty}`}>{item.certainty}</span></div>
                  <p className="event-context">{item.context}</p>
                  <div className="claim-action-grid">
                    <div><span>可观察行为</span><p>{item.observation}</p></div>
                    <div><span>后续行动</span><p>{item.action}</p></div>
                    <div><span>可观察结果</span><p>{item.outcome}</p></div>
                  </div>
                  {source && <EvidenceLink sourceId={source.id} onOpen={openSource} />}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-section case-pattern-section">
        <div className="section-intro"><div><span className="index">模式假设</span><h2>从案例中能学什么？</h2></div><p>以下内容是研究假设，不是人格诊断。每张卡都要同时阅读支持材料、反证和适用边界。</p></div>
        <div className="case-pattern-grid">
          {patterns.map((pattern) => <PatternCard key={pattern.id} pattern={pattern} onOpenSource={openSource} expanded={selectedPatternId === pattern.id} onToggle={() => setSelectedPatternId(selectedPatternId === pattern.id ? null : pattern.id)} />)}
        </div>
        <button className="button button-dark" onClick={() => navigate("lab")}>把一个模式带入训练 →</button>
      </section>
    </>
  );

  const renderSources = () => {
    const categories = ["全部", "采访", "财报电话会", "公司活动", "监管文件", "公开帖子"];
    return (
      <>
        <section className="page-heading evidence-library-heading">
          <div><div className="eyebrow">EVIDENCE LIBRARY</div><h1>证据库</h1><p>每条资料都明确标记来源身份、完整度、研究用途和核验提醒。原始来源优先，档案链接仅作备用入口。</p></div>
          <div className="library-total"><strong>{sources.length}</strong><span>已建档资料</span></div>
        </section>
        <section className="page-section source-library-section">
          <div className="library-controls">
            <label className="search-field"><span>搜索资料</span><input value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="FSD、监管、财报、Robotaxi……" /></label>
            <div className="filter-pills" role="group" aria-label="资料分类筛选">
              {categories.map((category) => <button key={category} className={sourceCategory === category ? "is-active" : ""} onClick={() => setSourceCategory(category)}>{category}</button>)}
            </div>
          </div>
          <p className="result-count">显示 {filteredSources.length} / {sources.length} 条资料</p>
          <div className="source-card-grid">
            {filteredSources.map((source) => (
              <article className="evidence-card" key={source.id}>
                <div className="evidence-card-top"><span>{sourceLabel(source)}</span><EvidenceBadge level={source.evidenceLevel} /></div>
                <h2>{source.title}</h2>
                <p>{source.researchNote}</p>
                <div className="source-card-meta"><span>{source.official ? "官方或本人来源" : "外部采访 / 媒体来源"}</span><span>{source.completeness}</span></div>
                <div className="card-actions"><button className="text-button" onClick={() => openSource(source.id)}>资料详情 →</button><a href={source.primaryUrl} target="_blank" rel="noreferrer">原始来源 ↗</a></div>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  };

  const renderPatterns = () => (
    <>
      <section className="page-heading pattern-heading">
        <div><div className="eyebrow">PATTERN LIBRARY</div><h1>行为模式库</h1><p>模式不是“马斯克人格标签”。它们是从多条公开材料中提出的、可被反证的行为假设。</p></div>
        <div className="heading-aside"><strong>4</strong><span>可检验的模式假设</span></div>
      </section>
      <section className="page-section">
        <div className="pattern-library-grid">
          {patterns.map((pattern) => <PatternCard key={pattern.id} pattern={pattern} onOpenSource={openSource} expanded={selectedPatternId === pattern.id} onToggle={() => setSelectedPatternId(selectedPatternId === pattern.id ? null : pattern.id)} />)}
        </div>
      </section>
    </>
  );

  const renderLab = () => {
    const relatedPattern = patterns.find((pattern) => pattern.id === selectedDrill.patternId);
    const isRevealed = Boolean(revealed[selectedDrill.id]);
    return (
      <>
        <section className="page-heading lab-heading">
          <div><div className="eyebrow">DECISION PRACTICE LAB</div><h1>情景训练室</h1><p>先写出你自己的回应，再阅读案例的对照轴。这里不计算“你有多像马斯克”，只帮助你检查证据、机制、风险和下一步。</p></div>
          <div className="lab-rule"><strong>先回答</strong><span>再看证据</span></div>
        </section>
        <section className="page-section lab-layout">
          <aside className="drill-list" aria-label="训练场景">
            <p>选择情境</p>
            {drills.map((drill, index) => <button key={drill.id} className={drill.id === selectedDrill.id ? "is-active" : ""} onClick={() => { setSelectedDrillId(drill.id); setSavedMessage(""); }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{drill.title}</strong></button>)}
          </aside>
          <div className="drill-workspace">
            <div className="drill-label">训练情境</div>
            <h2>{selectedDrill.title}</h2>
            <p className="drill-situation">{selectedDrill.situation}</p>
            <div className="drill-prompt"><span>你的任务</span><p>{selectedDrill.prompt}</p></div>
            <label className="answer-field"><span>先写下你的初步回应</span><textarea value={answers[selectedDrill.id] ?? ""} onChange={(event) => setAnswers({ ...answers, [selectedDrill.id]: event.target.value })} placeholder="不需要模仿任何人。请写事实、判断、风险和下一步。" rows={7} /></label>
            <div className="drill-actions"><button className="button button-dark" onClick={() => setRevealed({ ...revealed, [selectedDrill.id]: true })}>查看对照轴</button><button className="button button-light" onClick={saveDrillToJournal}>保存到行动日志</button></div>
            {isRevealed && relatedPattern && (
              <section className="drill-feedback">
                <div><span>相关模式</span><h3>{relatedPattern.shortTitle}</h3><p>{relatedPattern.summary}</p></div>
                <div><span>检查问题</span><ul>{selectedDrill.lenses.map((lens) => <li key={lens}>{lens}</li>)}</ul></div>
                <div><span>下一次小实验</span><p>{selectedDrill.nextExperiment}</p></div>
                <div className="feedback-sources"><span>回到案例材料</span>{relatedPattern.supportIds.map((sourceId) => <EvidenceLink key={sourceId} sourceId={sourceId} onOpen={openSource} compact />)}</div>
              </section>
            )}
            {savedMessage && <p className="saved-message" role="status">{savedMessage}</p>}
          </div>
        </section>
      </>
    );
  };

  const renderJournal = () => (
    <>
      <section className="page-heading journal-heading">
        <div><div className="eyebrow">PERSONAL ACTION LOG</div><h1>我的行动日志</h1><p>你的复盘保存在当前浏览器这台设备中。它记录你从案例中选择了什么、实践了什么、下一步要验证什么。</p></div>
        <div className="heading-aside"><strong>{journal.length}</strong><span>本机保存的记录</span></div>
      </section>
      <section className="page-section journal-layout">
        <form className="journal-form" onSubmit={saveManualJournal}>
          <span className="form-eyebrow">新增一条复盘</span>
          <label><span>标题</span><input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} placeholder="例如：延期沟通的第一次实践" /></label>
          <label><span>我观察到 / 我选择了什么</span><textarea value={journalReflection} onChange={(event) => setJournalReflection(event.target.value)} rows={5} placeholder="写下事实、你的判断，以及结果。" /></label>
          <label><span>下一步可验证行动</span><input value={journalAction} onChange={(event) => setJournalAction(event.target.value)} placeholder="例如：周五前把新里程碑拆成三项可验证假设" /></label>
          <button className="button button-dark" type="submit">保存这条复盘</button>
          {savedMessage && <p className="saved-message" role="status">{savedMessage}</p>}
        </form>
        <div className="journal-entries">
          <div className="journal-list-heading"><span>已有记录</span><small>不会上传到服务器</small></div>
          {journal.length === 0 ? <div className="empty-journal"><strong>还没有记录</strong><p>完成一次训练，或手动写下你正在验证的行动方式。</p><button className="text-button" onClick={() => navigate("lab")}>去训练室 →</button></div> : journal.map((entry) => <article className="journal-entry" key={entry.id}><div><span>{entry.createdAt}</span><h2>{entry.title}</h2></div><p>{entry.reflection}</p><div className="journal-next"><span>下一步</span><strong>{entry.nextAction}</strong></div></article>)}
        </div>
      </section>
    </>
  );

  const renderMethod = () => (
    <>
      <section className="page-heading method-heading">
        <div><div className="eyebrow">METHOD & BOUNDARIES</div><h1>方法与边界</h1><p>这个项目研究的是公开可观察行为，不诊断人格、不推测私人动机，也不把单条材料包装成结论。</p></div>
      </section>
      <section className="page-section">
        <div className="method-rule-grid">
          <article><span>F</span><h2>事实</h2><p>可回到原始视频、帖子、正式文件或明确时间节点的内容。</p><small>页面应给出来源、日期、发布者和可访问链接。</small></article>
          <article><span>I</span><h2>推断</h2><p>基于多条事实提出的行为模式假设，必须说明支持材料与反证。</p><small>推断不是动机，不等于内在人格结论。</small></article>
          <article><span>?</span><h2>未知</h2><p>资料不足、因果不清或仍在发展的结果，必须显式保留。</p><small>“不知道”是研究质量的一部分。</small></article>
        </div>
        <div className="evidence-levels">
          <div><EvidenceBadge level="S" /><p>本人账号、公司正式渠道、监管或法院文件。</p></div>
          <div><EvidenceBadge level="A" /><p>采访制作方发布的完整视频、音频或文字稿。</p></div>
          <div><EvidenceBadge level="C" /><p>第三方档案、镜像或自动转录，仅用于定位和辅助核验。</p></div>
        </div>
        <div className="method-notice"><strong>本网站的承诺</strong><p>不把公开材料变成“人格神话”。每条模式都应能被反驳；每个训练都应帮助你形成自己的判断，而非模仿某个人的语气或身份。</p></div>
      </section>
    </>
  );

  const content = {
    home: renderHome,
    case: renderCase,
    sources: renderSources,
    patterns: renderPatterns,
    lab: renderLab,
    journal: renderJournal,
    method: renderMethod,
  }[view]();

  return (
    <main className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="返回行为学习实验室首页"><span className="brand-mark">M</span><span>马斯克行为学习实验室</span></button>
        <nav aria-label="主导航">
          <button className={view === "case" ? "is-current" : ""} onClick={() => navigate("case")}>案例</button>
          <button className={view === "sources" ? "is-current" : ""} onClick={() => navigate("sources")}>证据库</button>
          <button className={view === "patterns" ? "is-current" : ""} onClick={() => navigate("patterns")}>模式库</button>
          <button className={view === "lab" ? "is-current" : ""} onClick={() => navigate("lab")}>训练室</button>
          <button className={view === "journal" ? "is-current" : ""} onClick={() => navigate("journal")}>行动日志</button>
          <button className={view === "method" ? "is-current" : ""} onClick={() => navigate("method")}>方法</button>
        </nav>
        <button className="header-cta" onClick={() => navigate("lab")}>开始训练</button>
      </header>

      {content}

      <footer>
        <button className="brand footer-brand" onClick={() => navigate("home")}><span className="brand-mark">M</span><span>马斯克行为学习实验室</span></button>
        <p>基于公开资料的行为研究与个人行动练习。</p>
        <button className="footer-link" onClick={() => navigate("method")}>阅读方法与边界 →</button>
      </footer>

      {selectedSource && <SourceDialog source={selectedSource} onClose={() => setSelectedSourceId(null)} />}
    </main>
  );
}
