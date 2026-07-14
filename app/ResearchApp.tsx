"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  sourceById,
  sources,
  timeline,
  type EvidenceSource,
  type Organization,
} from "./behavior-data";

type View = "home" | "sources" | "case" | "method";
type RoleFilter = "全部材料" | "马斯克本人直接材料" | "公司 / 监管行动记录";

const viewLabels: Record<View, string> = {
  home: "首页",
  sources: "一手资料库",
  case: "FSD 专题",
  method: "研究方法",
};

const organizations: Array<Organization | "全部机构"> = [
  "全部机构",
  "Tesla",
  "SpaceX",
  "Neuralink",
  "xAI",
  "X",
  "媒体采访",
  "监管 / 法院",
];

function isView(value: string): value is View {
  return Object.prototype.hasOwnProperty.call(viewLabels, value);
}

function sourceLabel(source: EvidenceSource) {
  return `${source.date} · ${source.category}`;
}

function isDirectMuskMaterial(source: EvidenceSource) {
  return source.muskRole !== "公司 / 监管行动记录";
}

function EvidenceBadge({ level }: { level: EvidenceSource["evidenceLevel"] }) {
  const labels = {
    S: "S · 原始 / 正式材料",
    A: "A · 完整采访或转录",
    C: "C · 辅助定位材料",
  };

  return <span className={`evidence-badge evidence-${level}`}>{labels[level]}</span>;
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

  const actionRecord = source.muskRole === "公司 / 监管行动记录";

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
          <div className="eyebrow">SOURCE RECORD · 可核验资料卡</div>
          <button ref={closeButtonRef} className="icon-button" onClick={onClose} aria-label="关闭资料详情">×</button>
        </div>
        <div className="source-detail-head">
          <div>
            <p>{sourceLabel(source)}</p>
            <h2 id="source-dialog-title">{source.title}</h2>
          </div>
          <EvidenceBadge level={source.evidenceLevel} />
        </div>
        {actionRecord && (
          <p className="record-caution">这是一条公司或监管行动记录，不是马斯克本人发言。页面不会把它归为“马斯克说过”。</p>
        )}
        <div className="detail-meta-grid archive-meta-grid">
          <div><span>机构 / 场景</span><strong>{source.organization} · {source.category}</strong></div>
          <div><span>发布者</span><strong>{source.publisher}</strong></div>
          {source.publishedAt && <div><span>材料公开日期</span><strong>{source.publishedAt}</strong></div>}
          <div><span>马斯克本人出现方式</span><strong>{source.muskRole}</strong></div>
          <div><span>材料形式</span><strong>{source.sourceFormat}</strong></div>
          <div><span>完整度</span><strong>{source.completeness}</strong></div>
          <div><span>访问状态</span><strong>{source.access}</strong></div>
        </div>
        <div className="detail-section">
          <h3>当时情境</h3>
          <p>{source.context}</p>
        </div>
        <div className="detail-section emphasis-section">
          <h3>为何值得收录</h3>
          <p>{source.researchNote}</p>
        </div>
        <div className="detail-section">
          <h3>引用与核验提醒</h3>
          <p>{source.verificationNote}</p>
        </div>
        <div className="source-detail-tags" aria-label="资料标签">
          {source.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="source-dialog-actions">
          <a className="button button-dark" href={source.primaryUrl} target="_blank" rel="noreferrer">打开原始资料 ↗</a>
          {source.supplementaryUrl && <a className="button button-light" href={source.supplementaryUrl} target="_blank" rel="noreferrer">{source.supplementaryLabel ?? "打开相关材料"} ↗</a>}
          {source.archiveUrl && <a className="button button-light" href={source.archiveUrl} target="_blank" rel="noreferrer">打开备份档案 ↗</a>}
        </div>
      </section>
    </div>
  );
}

export function ResearchApp() {
  const [view, setView] = useState<View>("home");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [sourceQuery, setSourceQuery] = useState("");
  const [sourceOrganization, setSourceOrganization] = useState<Organization | "全部机构">("全部机构");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("全部材料");
  const [stableOnly, setStableOnly] = useState(false);

  useEffect(() => {
    const syncView = () => {
      const candidate = window.location.hash.replace("#", "");
      if (isView(candidate)) setView(candidate);
    };
    syncView();
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  const navigate = (nextView: View) => {
    setView(nextView);
    if (typeof window !== "undefined") {
      window.location.hash = nextView;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openLibrary = (organization: Organization | "全部机构" = "全部机构", nextRole: RoleFilter = "全部材料") => {
    setSourceOrganization(organization);
    setRoleFilter(nextRole);
    setStableOnly(false);
    navigate("sources");
  };

  const selectedSource = selectedSourceId ? sourceById[selectedSourceId] : undefined;
  const directSourceCount = sources.filter(isDirectMuskMaterial).length;
  const actionRecordCount = sources.length - directSourceCount;
  const stableSourceCount = sources.filter((source) => source.access === "稳定直达").length;

  const filteredSources = useMemo(() => {
    const query = sourceQuery.trim().toLocaleLowerCase();
    return sources.filter((source) => {
      const matchesOrganization = sourceOrganization === "全部机构" || source.organization === sourceOrganization;
      const matchesRole = roleFilter === "全部材料"
        || (roleFilter === "马斯克本人直接材料" && isDirectMuskMaterial(source))
        || (roleFilter === "公司 / 监管行动记录" && !isDirectMuskMaterial(source));
      const matchesAccess = !stableOnly || source.access === "稳定直达";
      const haystack = `${source.title} ${source.publisher} ${source.organization} ${source.category} ${source.muskRole} ${source.tags.join(" ")} ${source.context}`.toLocaleLowerCase();
      return matchesOrganization && matchesRole && matchesAccess && (!query || haystack.includes(query));
    });
  }, [roleFilter, sourceOrganization, sourceQuery, stableOnly]);

  const renderHome = () => (
    <>
      <section className="archive-hero">
        <div className="archive-hero-copy">
          <div className="eyebrow">ELON MUSK · PRIMARY SOURCE ARCHIVE</div>
          <p className="hero-kicker">直接看原话、完整活动、正式文件与可核验行动记录</p>
          <h1>不是“马斯克语录”。<span>而是一座能回到原始材料的研究档案。</span></h1>
          <p className="hero-copy">这里把马斯克本人说的话、本人署名文本、公司公开活动、投资者问答、媒体采访、监管文件和测试结果明确分开。每一条都给出可点击的原始入口、材料形式、完整度、场景和引用限制。</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => openLibrary("全部机构", "马斯克本人直接材料")}>浏览 {directSourceCount} 条本人直接材料</button>
            <button className="button button-light" onClick={() => openLibrary()}>查看全部 {sources.length} 条资料</button>
          </div>
          <p className="hero-microcopy">优先提供无需登录的公开直达链接；YouTube 等平台可能因地区或 Cookie 提示受限，会在资料卡中如实标明。</p>
        </div>
        <aside className="archive-ledger" aria-label="资料库概览">
          <div className="ledger-topline"><span>ARCHIVE STATUS</span><strong>持续扩充</strong></div>
          <div className="ledger-total"><strong>{sources.length}</strong><span>已建档可点击资料</span></div>
          <div className="ledger-metrics">
            <div><strong>{directSourceCount}</strong><span>本人直接材料</span></div>
            <div><strong>{actionRecordCount}</strong><span>行动 / 法律记录</span></div>
            <div><strong>{stableSourceCount}</strong><span>稳定直达入口</span></div>
          </div>
          <div className="ledger-rule"><span>分层规则</span><p>“马斯克说过”与“他所领导的公司做过”永远不混为同一类证据。</p></div>
        </aside>
      </section>

      <section className="page-section archive-introduction">
        <div className="section-intro">
          <div><span className="index">01</span><h2>先选情境，再打开原始记录</h2></div>
          <p>这不是一个把人“内化”为人格模板的网站。它首先是一套可追溯的资料入口：你可以在不同压力、组织和公开场景中看他实际说了什么，以及公司或监管机构记录了什么行动。</p>
        </div>
        <div className="archive-track-grid">
          <button className="archive-track-card tesla-track" onClick={() => openLibrary("Tesla")}>
            <span>01 · TESLA</span><h3>公司、投资者与产品</h3><p>总体计划、完整活动、财报问答、员工邮件、召回与监管对照。</p><strong>进入 Tesla 资料 ↗</strong>
          </button>
          <button className="archive-track-card spacex-track" onClick={() => openLibrary("SpaceX")}>
            <span>02 · SPACEX</span><h3>Starship、火星与工程测试</h3><p>完整演讲、产品更新、测试成功和异常的官方行动记录。</p><strong>进入 SpaceX 资料 ↗</strong>
          </button>
          <button className="archive-track-card neural-track" onClick={() => openLibrary("Neuralink")}>
            <span>03 · NEURALINK / xAI</span><h3>神经接口与 AI 路线</h3><p>发布会、论文、试验进度与模型产品公告分层存档。</p><strong>进入 Neuralink 资料 ↗</strong>
          </button>
          <button className="archive-track-card pressure-track" onClick={() => openLibrary("监管 / 法院")}>
            <span>04 · PRESSURE</span><h3>媒体追问、法律与监管</h3><p>公开采访、SEC 证词、诉状、公司披露与 NHTSA 文件。</p><strong>进入压力场景资料 ↗</strong>
          </button>
        </div>
      </section>

      <section className="page-section source-first-section">
        <div className="section-intro compact-intro">
          <div><span className="index">资料使用法</span><h2>一条资料，先辨身份，再谈含义。</h2></div>
        </div>
        <div className="source-first-rules">
          <article><span>01</span><h3>本人直接材料</h3><p>完整发言、参与问答、署名文章和公开邮件。可以讨论原话，但仍要保留问题、时间和上下文。</p></article>
          <article><span>02</span><h3>公司与监管行动</h3><p>公司公告、测试页、召回、诉状、监管问询。能说明记录中的行动，不能冒充为本人心理或发言。</p></article>
          <article><span>03</span><h3>完整度优先</h3><p>优先看完整视频、完整回放、文字稿或原始文件；短片、新闻摘要和孤立帖子只能用于定位。</p></article>
        </div>
      </section>

      <section className="page-section featured-case-section archive-case-section">
        <div className="featured-case-copy">
          <span className="index">首个专题档案</span>
          <h2>FSD / Autopilot：把公开说法、产品推进与监管记录放在同一条时间线上。</h2>
          <p>这个专题不提供人格结论。它展示一个更有用的研究问题：公开预期、技术展示、测试阶段、监管动作和后续运营信息之间，究竟如何相互关联。</p>
          <button className="button button-cream" onClick={() => navigate("case")}>打开 FSD 专题 ↗</button>
        </div>
        <div className="featured-case-stats archive-case-stats">
          <div><strong>{timeline.length}</strong><span>已整理节点</span></div>
          <div><strong>4</strong><span>材料类型并列</span></div>
          <div><strong>0</strong><span>人格诊断结论</span></div>
        </div>
      </section>
    </>
  );

  const renderSources = () => (
    <>
      <section className="page-heading evidence-library-heading archive-library-heading">
        <div>
          <div className="eyebrow">PRIMARY SOURCE LIBRARY</div>
          <h1>一手资料库</h1>
          <p>每一条都可以直接打开。先用筛选区分“马斯克本人直接材料”和“公司 / 监管行动记录”，再按机构、关键词和访问稳定性缩小范围。</p>
        </div>
        <div className="library-total"><strong>{sources.length}</strong><span>已建档资料</span></div>
      </section>
      <section className="page-section source-library-section">
        <div className="archive-filter-panel">
          <label className="search-field"><span>搜索标题、机构、场景或标签</span><input value={sourceQuery} onChange={(event) => setSourceQuery(event.target.value)} placeholder="例如：财报、Starship、召回、采访、Grok…" /></label>
          <div className="filter-row">
            <span>按机构</span>
            <div className="filter-pills" role="group" aria-label="按机构筛选">
              {organizations.map((organization) => <button key={organization} className={sourceOrganization === organization ? "is-active" : ""} onClick={() => setSourceOrganization(organization)}>{organization}</button>)}
            </div>
          </div>
          <div className="filter-row filter-row-bottom">
            <span>按材料身份</span>
            <div className="filter-pills" role="group" aria-label="按资料身份筛选">
              {(["全部材料", "马斯克本人直接材料", "公司 / 监管行动记录"] as RoleFilter[]).map((role) => <button key={role} className={roleFilter === role ? "is-active" : ""} onClick={() => setRoleFilter(role)}>{role}</button>)}
              <button className={stableOnly ? "is-active stable-filter" : "stable-filter"} onClick={() => setStableOnly(!stableOnly)}>{stableOnly ? "✓ 仅稳定直达" : "仅稳定直达"}</button>
            </div>
          </div>
        </div>
        <div className="library-result-line"><p>显示 <strong>{filteredSources.length}</strong> / {sources.length} 条资料</p><span>资料卡会明确标示原话、行动记录、完整度与访问状态。</span></div>
        <div className="source-card-grid archive-source-grid">
          {filteredSources.map((source) => {
            const actionRecord = !isDirectMuskMaterial(source);
            return (
              <article className="evidence-card archive-evidence-card" key={source.id}>
                <div className="evidence-card-top"><span>{sourceLabel(source)}</span><EvidenceBadge level={source.evidenceLevel} /></div>
                <div className="source-card-heading"><span className={`source-role-chip ${actionRecord ? "role-action" : "role-direct"}`}>{source.muskRole}</span><span className="source-org-chip">{source.organization}</span></div>
                <h2>{source.title}</h2>
                <p>{source.context}</p>
                <div className="source-card-meta archive-source-meta"><span>{source.sourceFormat}</span><span>{source.completeness}</span><span>{source.access}</span></div>
                <div className="card-actions"><button className="text-button" onClick={() => setSelectedSourceId(source.id)}>资料说明 ↗</button><a href={source.primaryUrl} target="_blank" rel="noreferrer">打开原始资料 ↗</a></div>
              </article>
            );
          })}
        </div>
        {filteredSources.length === 0 && <div className="empty-results"><strong>没有匹配的资料。</strong><p>试着清空关键词，或取消“仅稳定直达”和材料身份筛选。</p></div>}
      </section>
    </>
  );

  const renderCase = () => (
    <>
      <section className="case-hero archive-case-hero">
        <div>
          <button className="back-button" onClick={() => navigate("home")}>← 返回资料档案首页</button>
          <div className="eyebrow">TOPIC DOSSIER · 01</div>
          <h1>FSD / Autopilot</h1>
          <p className="case-hero-question">研究问题：当公开愿景、时间判断、技术展示、产品测试与监管文件出现在同一主题中时，怎样避免把它们混成一句简单的“他说过 / 做到了 / 没做到”？</p>
          <div className="case-tag-row"><span>2014—2025</span><span>{timeline.length} 个节点</span><span>原话与行动分层</span><span>持续补档</span></div>
        </div>
        <aside className="case-side-note"><span>阅读顺序</span><ol><li>打开原始资料</li><li>辨认说话人或记录主体</li><li>比较后续行动与外部约束</li></ol></aside>
      </section>
      <section className="page-section case-intro-grid">
        <article className="research-question"><span>专题说明</span><h2>这是一份事件档案，而不是一份人物判词。</h2><p>每个节点都链接到资料卡。资料卡会说明这是本人发言、公司记录还是监管文件，并提示什么能够从中确认、什么不能由它单独推出。</p></article>
        <article className="uncertainty-card"><span>保留未知</span><p>公开材料能显示当时的说法、行动和可观察后果，却不能直接证明私人动机，也无法用单一事件覆盖一个人的全部行为方式。</p></article>
      </section>
      <section className="page-section">
        <div className="section-intro"><div><span className="index">证据时间线</span><h2>情境 · 公开记录 · 后续节点</h2></div><p>时间线只负责整理可比对的原始记录，不替读者下结论。每个节点都可打开它对应的资料卡并直达原始链接。</p></div>
        <div className="evidence-timeline">
          {timeline.map((item) => {
            const source = sourceById[item.sourceId];
            if (!source) return null;
            return (
              <article className="evidence-event" key={item.id}>
                <div className="timeline-date"><strong>{item.year}</strong><span>{item.type}</span></div>
                <div className="timeline-rail" />
                <div className="event-body">
                  <div className="event-title-line"><h3>{item.title}</h3><span className={`certainty certainty-${item.certainty}`}>{item.certainty}</span></div>
                  <p className="event-context">{item.context}</p>
                  <div className="claim-action-grid">
                    <div><span>可观察内容</span><p>{item.observation}</p></div>
                    <div><span>后续节点</span><p>{item.action}</p></div>
                    <div><span>研究边界</span><p>{item.outcome}</p></div>
                  </div>
                  <button className="source-reference" onClick={() => setSelectedSourceId(source.id)}><span>查看对应资料</span><small>{sourceLabel(source)}</small><span aria-hidden="true">→</span></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );

  const renderMethod = () => (
    <>
      <section className="page-heading method-heading">
        <div><div className="eyebrow">METHOD & BOUNDARIES</div><h1>研究方法与边界</h1><p>这个站点把“直接发言”“署名文本”“公司行动”“监管记录”分开，不诊断人格，不推测私人动机，也不把单条资料包装成结论。</p></div>
      </section>
      <section className="page-section">
        <div className="method-rule-grid archive-method-grid">
          <article><span>01</span><h2>先确认主体</h2><p>“马斯克本人完整发言、参与问答、署名文本”才属于本人直接材料。公司页面和监管文件会单独标作行动记录。</p><small>资料卡必须让读者先看清：谁说的、谁记录的、谁对它负责。</small></article>
          <article><span>02</span><h2>完整度优先</h2><p>完整视频、完整回放、完整文字稿和原始法律文件优先。官方摘录和公司公告用于确定事实范围，不替代完整材料。</p><small>引用具体话语时，保留问题、时间码或说话人身份。</small></article>
          <article><span>03</span><h2>行动不等于动机</h2><p>测试页、召回、监管问询和公司公告能记录可观察动作；它们不能自动证明马斯克的个人心理、性格或单一因果。</p><small>研究网页应当允许“不知道”，而不是强行给人物下结论。</small></article>
        </div>
        <div className="evidence-levels archive-evidence-levels">
          <div><EvidenceBadge level="S" /><p>本人署名文本、公司正式渠道、官方完整活动、监管或法院原始文件。</p></div>
          <div><EvidenceBadge level="A" /><p>采访制作方发布的完整视频、完整转录或可核验的正式采访页面。</p></div>
          <div><EvidenceBadge level="C" /><p>只用于定位或辅助核验的材料；不会被放到“本人直接发言”的优先入口。</p></div>
        </div>
        <div className="method-notice"><strong>资料库的承诺</strong><p>当一条资料的原始链接不稳定、是节录、不是马斯克本人发言，或需要更多外部核验时，网站会直接说出来。资料越多，越需要这种区分，而不是用数量制造确定感。</p></div>
      </section>
    </>
  );

  const content = {
    home: renderHome,
    sources: renderSources,
    case: renderCase,
    method: renderMethod,
  }[view]();

  return (
    <main className="app-shell">
      <header className="site-header archive-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="返回马斯克一手资料档案首页"><span className="brand-mark">M</span><span>马斯克一手资料档案</span></button>
        <nav aria-label="主导航">
          <button className={view === "sources" ? "is-current" : ""} onClick={() => openLibrary()}>资料库</button>
          <button className={view === "case" ? "is-current" : ""} onClick={() => navigate("case")}>FSD 专题</button>
          <button className={view === "method" ? "is-current" : ""} onClick={() => navigate("method")}>研究方法</button>
        </nav>
        <button className="header-cta" onClick={() => openLibrary("全部机构", "马斯克本人直接材料")}>直接看原始资料</button>
      </header>
      {content}
      <footer>
        <button className="brand footer-brand" onClick={() => navigate("home")}><span className="brand-mark">M</span><span>马斯克一手资料档案</span></button>
        <p>以公开可核验材料为起点；把原话、行动记录、外部追问与未知边界分开保存。</p>
        <button className="footer-link" onClick={() => navigate("method")}>阅读研究方法与边界 ↗</button>
      </footer>
      {selectedSource && <SourceDialog source={selectedSource} onClose={() => setSelectedSourceId(null)} />}
    </main>
  );
}
