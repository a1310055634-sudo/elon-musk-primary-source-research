export type EvidenceLevel = "S" | "A" | "C";

export type EvidenceSource = {
  id: string;
  title: string;
  date: string;
  category: "采访" | "财报电话会" | "公司活动" | "监管文件" | "公开帖子";
  publisher: string;
  official: boolean;
  completeness: "完整原片" | "完整文字稿" | "片段或镜像" | "待人工核验";
  evidenceLevel: EvidenceLevel;
  primaryUrl: string;
  archiveUrl: string;
  context: string;
  researchNote: string;
  verificationNote: string;
  tags: string[];
};

export type TimelineItem = {
  id: string;
  year: string;
  type: "概念" | "预测" | "产品" | "技术" | "监管" | "追问" | "运营";
  title: string;
  sourceId: string;
  context: string;
  observation: string;
  action: string;
  outcome: string;
  certainty: "已核验" | "需补充" | "结果待观察";
};

export type Pattern = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  summary: string;
  observed: string;
  supportIds: string[];
  boundary: string;
  counterEvidence: string;
  practice: string;
};

export type Drill = {
  id: string;
  title: string;
  situation: string;
  prompt: string;
  patternId: string;
  lenses: string[];
  nextExperiment: string;
};

export const sources: EvidenceSource[] = [
  {
    id: "bloomberg-2014",
    title: "Bloomberg 采访：Autopilot 与完全自动驾驶的边界",
    date: "2014-10-10",
    category: "采访",
    publisher: "Bloomberg",
    official: false,
    completeness: "完整原片",
    evidenceLevel: "A",
    primaryUrl: "https://www.youtube.com/watch?v=Bjq6tXRKfUQ",
    archiveUrl: "https://elonmuskarchive.org/entry/interview-with-bloomberg-2014-10-10",
    context: "早期公开访谈，讨论驾驶辅助、自动化和未来技术路径。",
    researchNote: "作为后续术语变化与能力边界讨论的早期基线材料。",
    verificationNote: "需要在引用具体措辞前回看原片并记录时间戳。",
    tags: ["FSD", "概念", "采访"],
  },
  {
    id: "denmark-2015",
    title: "丹麦采访：高速公路自动驾驶与时间判断",
    date: "2015-09-15",
    category: "采访",
    publisher: "DR / Danish television archive",
    official: false,
    completeness: "完整原片",
    evidenceLevel: "A",
    primaryUrl: "https://www.youtube.com/watch?v=bl5vLC3Xlgc",
    archiveUrl: "https://elonmuskarchive.org/entry/interview-in-denmark-2015-09-15",
    context: "围绕自动驾驶路线和可能的时间窗口进行的公开视频采访。",
    researchNote: "用于比较技术预测、产品阶段与实际交付之间的时间关系。",
    verificationNote: "时间判断需保留原始问题，不能脱离采访语境单独引用。",
    tags: ["FSD", "预测", "采访"],
  },
  {
    id: "tesla-q2-2018",
    title: "Tesla 2018 Q2 财报电话会",
    date: "2018-08-02",
    category: "财报电话会",
    publisher: "Tesla / 视频镜像",
    official: false,
    completeness: "待人工核验",
    evidenceLevel: "C",
    primaryUrl: "https://www.youtube.com/watch?v=1I9UtyZMTek",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-q2-2018-earnings-call-2018-08-02",
    context: "投资者与分析师针对 Model 3、Autopilot、自研芯片和跨州自动驾驶演示提出追问。",
    researchNote: "可观察在投资者压力下如何把产品延期、工程解释和长期愿景放在同一回答中。",
    verificationNote: "先核验视频上传者与完整性；关键引文应回到官方电话会记录或原始音频。",
    tags: ["FSD", "财报", "延期", "投资者"],
  },
  {
    id: "autonomy-day-2019",
    title: "Tesla Autonomy Day",
    date: "2019-04-22",
    category: "公司活动",
    publisher: "Tesla",
    official: true,
    completeness: "完整原片",
    evidenceLevel: "S",
    primaryUrl: "https://www.youtube.com/watch?v=Ucp0TTmvqOE",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-autonomy-day-2019",
    context: "面向投资者和公众的技术活动，集中说明 FSD 芯片、神经网络、车队数据与 Robotaxi 设想。",
    researchNote: "适合拆解技术叙事、公开目标与商业化时间判断如何被组合表达。",
    verificationNote: "活动包含多位发言人；记录时必须区分马斯克本人、工程负责人和主持人的话。",
    tags: ["FSD", "Robotaxi", "技术叙事", "公司活动"],
  },
  {
    id: "tesla-q3-2020",
    title: "Tesla 2020 Q3 财报电话会",
    date: "2020-10-21",
    category: "财报电话会",
    publisher: "Tesla / 视频镜像",
    official: false,
    completeness: "待人工核验",
    evidenceLevel: "C",
    primaryUrl: "https://www.youtube.com/watch?v=U_Zr-bhHW9A",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-q3-2020-earnings-call-2020-10-21",
    context: "FSD Beta 初期、产能扩张和盈利能力同时成为讨论对象。",
    researchNote: "用于区分有限测试、产品功能、规模化计划和 Robotaxi 商业模型。",
    verificationNote: "第三方视频可能有剪辑；完整问答需要与官方材料交叉核验。",
    tags: ["FSD", "Beta", "财报", "产品阶段"],
  },
  {
    id: "ai-day-2022",
    title: "Tesla AI Day 2022",
    date: "2022-09-30",
    category: "公司活动",
    publisher: "Tesla",
    official: true,
    completeness: "完整原片",
    evidenceLevel: "S",
    primaryUrl: "https://www.youtube.com/watch?v=ODSJsviD_SU",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-ai-day-2022",
    context: "围绕训练数据、Dojo、端到端 AI、Optimus 与自动驾驶工程路线的公开活动。",
    researchNote: "可观察在技术不确定性较高时如何把基础设施、数据闭环和产品目标连接起来。",
    verificationNote: "技术展示不等于产品已经达成；页面应明确区分演示、计划与可用能力。",
    tags: ["FSD", "AI", "Dojo", "技术"],
  },
  {
    id: "nhtsa-recall-2023",
    title: "NHTSA Recall 23V838：Autopilot 软件补救文件",
    date: "2023-12-12",
    category: "监管文件",
    publisher: "NHTSA",
    official: true,
    completeness: "完整文字稿",
    evidenceLevel: "S",
    primaryUrl: "https://static.nhtsa.gov/odi/rcl/2023/RCLQRT-23V838-0414.PDF",
    archiveUrl: "https://static.nhtsa.gov/odi/rcl/2023/RCLQRT-23V838-0414.PDF",
    context: "监管机构对 Autopilot 驾驶员参与控制问题的正式召回与软件补救记录。",
    researchNote: "为公开产品叙事提供一个独立于公司表述的监管行动节点。",
    verificationNote: "正式监管文件可直接引用，但仍应清楚写明它描述的是监管结论，不是对个人动机的判断。",
    tags: ["FSD", "监管", "召回", "结果"],
  },
  {
    id: "tesla-investor-day-2023",
    title: "Tesla Investor Day 2023",
    date: "2023-03-01",
    category: "公司活动",
    publisher: "Tesla",
    official: true,
    completeness: "完整原片",
    evidenceLevel: "S",
    primaryUrl: "https://www.youtube.com/watch?v=Hl1zEzVUV7w",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-investor-day-2023-03-01",
    context: "Master Plan 3、成本、产能、下一代平台与长期愿景的公开陈述。",
    researchNote: "适合研究如何把抽象使命、制造策略与资本市场叙事放在同一框架内。",
    verificationNote: "应区分现场演讲、展示材料与后来实际执行之间的关系。",
    tags: ["投资者", "长期叙事", "公司活动"],
  },
  {
    id: "tesla-q3-2023",
    title: "Tesla 2023 Q3 财报电话会",
    date: "2023-10-18",
    category: "财报电话会",
    publisher: "Tesla / 视频镜像",
    official: false,
    completeness: "待人工核验",
    evidenceLevel: "C",
    primaryUrl: "https://www.youtube.com/watch?v=O5aJbvWr4gs",
    archiveUrl: "https://elonmuskarchive.org/entry/tesla-q3-2023-earnings-call-2023-10-18",
    context: "围绕 Cybertruck、利率、需求、成本与经营节奏的分析师问答。",
    researchNote: "作为在外部约束增强时如何调整公开沟通语气与预测范围的观察材料。",
    verificationNote: "关键问答需要补齐完整音频、问题人和时间戳。",
    tags: ["财报", "压力沟通", "投资者"],
  },
  {
    id: "we-robot-2024",
    title: "We, Robot：Cybercab 与无人监督 FSD 展示",
    date: "2024-10-10",
    category: "公司活动",
    publisher: "Tesla",
    official: true,
    completeness: "完整原片",
    evidenceLevel: "S",
    primaryUrl: "https://www.youtube.com/watch?v=6v6dbxPlsXs",
    archiveUrl: "https://elonmuskarchive.org/entry/we-robot-robotaxi-reveal-2024-10-10",
    context: "Cybercab 与 Robotaxi 的现场展示，涉及产品形式、服务设想和后续时间判断。",
    researchNote: "用于比较现场展示、产品路线、运营承诺和实际服务范围之间的差异。",
    verificationNote: "现场展示的条件、地点和监督安排应单列，不可等同于全面商业可用。",
    tags: ["FSD", "Robotaxi", "产品", "公开展示"],
  },
  {
    id: "cnbc-faber-2025",
    title: "CNBC David Faber 采访：Austin 上线前追问",
    date: "2025-05-20",
    category: "采访",
    publisher: "CNBC",
    official: false,
    completeness: "完整文字稿",
    evidenceLevel: "A",
    primaryUrl: "https://www.cnbc.com/2025/05/20/cnbc-transcript-elon-musk-sits-down-with-cnbcs-david-faber-live-on-cnbc-today-.html",
    archiveUrl: "https://elonmuskarchive.org/entry/cnbc-faber-musk-2025",
    context: "媒体以具体上线条件、时间与运营问题进行连续追问。",
    researchNote: "补足公司活动之外的外部追问情境，观察回答如何处理边界与不确定性。",
    verificationNote: "文字稿应与原节目或官方 CNBC 页面核验；页面只把它作为公开回答记录。",
    tags: ["FSD", "媒体追问", "Robotaxi", "采访"],
  },
  {
    id: "austin-post-2025",
    title: "Austin Robotaxi 上线声明",
    date: "2025-06-22",
    category: "公开帖子",
    publisher: "@elonmusk",
    official: true,
    completeness: "待人工核验",
    evidenceLevel: "S",
    primaryUrl: "https://x.com/elonmusk/status/1936834688188129503",
    archiveUrl: "https://elonmuskarchive.org/posts/1936834688188129503",
    context: "围绕有限范围服务上线的即时公开表达。",
    researchNote: "适合与采访、监管和实际运营材料并列，避免把单条帖子单独当作完整事实。",
    verificationNote: "X 帖可能出现访问限制；保存归档链接、截图日期和上下文线程。",
    tags: ["FSD", "X", "运营", "Robotaxi"],
  },
];

export const timeline: TimelineItem[] = [
  {
    id: "t-2014",
    year: "2014",
    type: "概念",
    title: "辅助驾驶与完全自主驾驶的边界",
    sourceId: "bloomberg-2014",
    context: "早期公开采访中的能力定义讨论。",
    observation: "先建立辅助驾驶与完全自主驾驶之间的概念边界。",
    action: "将长期技术方向置于公开叙事中。",
    outcome: "成为后续术语、能力与时间预测比较的基线。",
    certainty: "已核验",
  },
  {
    id: "t-2015",
    year: "2015",
    type: "预测",
    title: "高速公路自动驾驶与时间窗口",
    sourceId: "denmark-2015",
    context: "媒体采访提出技术进展与实现时间问题。",
    observation: "公开讨论近期能力与长期完全自动驾驶的不同时间尺度。",
    action: "把远期目标转化为可被持续追问的公开预期。",
    outcome: "后续可与产品功能、Beta 测试和运营范围进行对照。",
    certainty: "已核验",
  },
  {
    id: "t-2018",
    year: "2018",
    type: "预测",
    title: "跨州演示延期与自研计算机",
    sourceId: "tesla-q2-2018",
    context: "财报电话会中的投资者问答。",
    observation: "工程路线、演示目标和时间判断在同一压力场景中被讨论。",
    action: "用技术细节与长期愿景回应短期执行追问。",
    outcome: "原定演示与后续产品节点需要继续以资料核验。",
    certainty: "需补充",
  },
  {
    id: "t-2019",
    year: "2019",
    type: "产品",
    title: "Autonomy Day 与 Robotaxi 网络",
    sourceId: "autonomy-day-2019",
    context: "面向投资者与公众的技术发布活动。",
    observation: "芯片、数据、神经网络和商业模式被组织成一个统一叙事。",
    action: "将技术路线与长期商业设想公开绑定。",
    outcome: "构成后续时间判断、产品路线与服务范围的对照起点。",
    certainty: "已核验",
  },
  {
    id: "t-2020",
    year: "2020",
    type: "产品",
    title: "FSD Beta 与商业模型",
    sourceId: "tesla-q3-2020",
    context: "有限测试与规模化预期同时进入公开讨论。",
    observation: "产品测试、功能表述、规模预测和商业模式并不处于同一成熟度。",
    action: "以 Beta 作为推进与公开沟通之间的过渡阶段。",
    outcome: "需要分别追踪实际可用范围、用户条件和后续版本。",
    certainty: "需补充",
  },
  {
    id: "t-2022",
    year: "2022",
    type: "技术",
    title: "AI Day：数据、训练与 Dojo",
    sourceId: "ai-day-2022",
    context: "以技术基础设施为重点的公开活动。",
    observation: "表达重心从单一功能承诺延伸到数据闭环和训练能力。",
    action: "把长期产品目标嵌入基础设施叙事。",
    outcome: "技术展示与产品交付之间仍需独立记录。",
    certainty: "已核验",
  },
  {
    id: "t-2023-regulation",
    year: "2023",
    type: "监管",
    title: "NHTSA Recall 23V838",
    sourceId: "nhtsa-recall-2023",
    context: "监管机构的正式软件补救文件。",
    observation: "外部监管材料为产品叙事提供独立的风险与约束信息。",
    action: "公司通过软件更新实施补救。",
    outcome: "不能只用公司愿景判断能力边界，必须并列监管节点。",
    certainty: "已核验",
  },
  {
    id: "t-2024",
    year: "2024",
    type: "产品",
    title: "We, Robot 与 Cybercab",
    sourceId: "we-robot-2024",
    context: "现场产品展示与服务设想。",
    observation: "产品形式、服务愿景和时间判断被集中呈现。",
    action: "将无人监督驾驶、专用车型与未来运营图景公开连接。",
    outcome: "需要追踪展示条件与后来实际运营条件的差异。",
    certainty: "结果待观察",
  },
  {
    id: "t-2025-interview",
    year: "2025",
    type: "追问",
    title: "Austin 上线前的媒体追问",
    sourceId: "cnbc-faber-2025",
    context: "外部媒体围绕上线条件进行连续追问。",
    observation: "公开回答需要同时处理时间、范围和安全条件。",
    action: "以采访形式回应外部约束和具体质疑。",
    outcome: "可与上线声明和运营材料交叉核验。",
    certainty: "已核验",
  },
  {
    id: "t-2025-operation",
    year: "2025",
    type: "运营",
    title: "Austin Robotaxi 上线声明",
    sourceId: "austin-post-2025",
    context: "围绕有限范围服务的即时公开帖子。",
    observation: "短帖子能表达事件发生，但无法单独说明运行范围与全部条件。",
    action: "通过本人账号公开宣布服务节点。",
    outcome: "运营规模、安全安排与持续情况应继续补充外部证据。",
    certainty: "结果待观察",
  },
];

export const patterns: Pattern[] = [
  {
    id: "first-principles",
    number: "01",
    title: "从机制拆解问题，而非只接受既有分类",
    shortTitle: "机制拆解",
    summary: "观察公开表达是否把成本、技术、物理限制或数据流程拆成更底层的变量。",
    observed: "当讨论自动驾驶和 AI 时，常见做法是把产品目标连接到芯片、数据、训练和制造等机制层。",
    supportIds: ["autonomy-day-2019", "ai-day-2022", "tesla-q2-2018"],
    boundary: "机制拆解不能替代用户安全、监管、组织能力和商业化条件。",
    counterEvidence: "技术讲解很强并不自动说明时间预测会准确，也不自动等于产品已准备好。",
    practice: "把你正在解决的问题写成：目标、不可改变约束、可测试假设、下一次验证。",
  },
  {
    id: "ambitious-commitment",
    number: "02",
    title: "用高目标和公开时间表制造推进压力",
    shortTitle: "高目标承诺",
    summary: "观察公开的时间判断如何把技术愿景、组织节奏和外部期待绑定在一起。",
    observed: "多次公开讨论把较远期技术目标转化为可被媒体、投资者和用户持续追问的节点。",
    supportIds: ["denmark-2015", "autonomy-day-2019", "we-robot-2024"],
    boundary: "公开目标能提高执行压力，也可能导致误解、信誉成本和不必要的风险。",
    counterEvidence: "没有充分证据时，公开时间表不应被视为可靠预测；必须与实际交付独立比较。",
    practice: "把自己的目标拆成方向、可承诺里程碑和明确不确定项，避免把三者混为一句口号。",
  },
  {
    id: "narrative-under-pressure",
    number: "03",
    title: "在压力下把短期约束放回长期叙事",
    shortTitle: "压力下重构叙事",
    summary: "观察面对投资者、媒体或监管追问时，如何在短期问题与长期方向之间切换。",
    observed: "财报和采访材料显示，经营、产品与长期技术愿景常被放在一个框架中回答。",
    supportIds: ["tesla-q2-2018", "tesla-q3-2023", "cnbc-faber-2025"],
    boundary: "长期叙事不能掩盖短期事实；延期、范围和风险必须清楚说出。",
    counterEvidence: "当外部条件高度具体时，抽象愿景无法替代对条件、范围和责任的明确回答。",
    practice: "面对质疑时按“事实—机制—下一步—未知项”四段写回应，而不是只重复愿景。",
  },
  {
    id: "public-action-loop",
    number: "04",
    title: "把公开表达与后续行动放在同一条证据链中",
    shortTitle: "表达—行动闭环",
    summary: "不把帖子、演讲或采访当成结论，而是追踪它后面是否出现产品、监管或运营动作。",
    observed: "FSD 相关表达必须与 Beta、软件补救、展示、采访与运营材料共同阅读。",
    supportIds: ["tesla-q3-2020", "nhtsa-recall-2023", "austin-post-2025"],
    boundary: "相关时间顺序不等于因果关系；资料不足时应保留未知。",
    counterEvidence: "单条帖子或单次展示往往缺少完整上下文，不能独立证明能力、动机或结果。",
    practice: "为自己的每个公开承诺建立行动表：承诺、证据、下一步、验证日期、撤回条件。",
  },
];

export const drills: Drill[] = [
  {
    id: "delay",
    title: "核心项目延期六个月",
    situation: "你负责的核心产品未能按原计划交付，投资人要求当天说明原因与新计划。",
    prompt: "先写一段 150 字以内的回应：哪些是事实、哪些是技术机制、下一步如何验证、哪些仍不确定？",
    patternId: "narrative-under-pressure",
    lenses: ["是否先承认可核验事实？", "是否解释机制而不是只给情绪化保证？", "是否把新的里程碑和未知项分开？"],
    nextExperiment: "下一次项目复盘用四栏：事实 / 机制 / 下一步 / 未知项。",
  },
  {
    id: "ambitious-goal",
    title: "团队需要一个远期突破目标",
    situation: "你希望团队围绕一个三年愿景集中资源，但现阶段证据仍有限。",
    prompt: "写出你的远期方向、近期可验证里程碑，以及你拒绝承诺的部分。",
    patternId: "ambitious-commitment",
    lenses: ["方向和承诺是否分开？", "是否写出可测量的近期证据？", "是否为错误判断保留调整空间？"],
    nextExperiment: "把公开目标改写成“方向 + 90 天验证 + 风险边界”。",
  },
  {
    id: "technical-explanation",
    title: "外部人不理解你的技术路线",
    situation: "合作方认为你的方案只是口号，要求解释为什么它比现有方案更可行。",
    prompt: "不用行业黑话，写出问题的底层约束、你的机制假设和一个可验证实验。",
    patternId: "first-principles",
    lenses: ["是否从机制而非标签出发？", "是否提出可验证的假设？", "是否承认非技术限制？"],
    nextExperiment: "把一页方案中的形容词替换成变量、约束和测试方法。",
  },
  {
    id: "public-commitment",
    title: "你准备发布一项公开承诺",
    situation: "你想在公开场合宣布一个重要产品节点，但团队内部仍存在关键不确定性。",
    prompt: "列出这项承诺的目标、行动证据、验证日期和撤回条件，再决定是否应公开。",
    patternId: "public-action-loop",
    lenses: ["公开表述是否超过已有证据？", "行动与验证是否已经安排？", "外界会把它理解为愿景还是保证？"],
    nextExperiment: "为每项公开承诺新增一行：如果条件未满足，我将如何更新说明？",
  },
];

export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
