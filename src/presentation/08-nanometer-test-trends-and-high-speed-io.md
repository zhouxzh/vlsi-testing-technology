---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 8 章 · 纳米测试议题与高速接口'
---

<!-- _class: lead -->

# 纳米测试议题与高速接口

## 从工艺变异与可靠性风险走向异构系统、MEMS、I/O 与 RF 判据

<p class="small">3 × 45 分钟（评审估计）· [1] 第 12 章与受控现代补充</p>

<!--
本章从 2006 年[1] 的历史路线图出发，先讲纳米尺度的物理失效和统计风险，再讲 FPGA、MEMS、高速 I/O 与 RF 的不同测试模型。现代标准补充必须另核当期资料。
-->

---

# 核心问题与学习目标

<div class="grid-3"><div class="concept"><h3>风险</h3><p>固定型故障之外，延迟、完整性、变异与软错误如何进入测试计划？</p></div><div class="concept"><h3>异构</h3><p>FPGA、MEMS、SerDes 与 RF 为什么需要不同的可控制性与响应指标？</p></div><div class="concept"><h3>现代</h3><p>2.5D/3D、IJTAG、在役测试与 AI 辅助如何改变证据边界？</p></div></div>

<p class="small">学习证据：能区分历史书页、理论推导和现代标准补充，并为异构器件选择合适判据。</p>

<!--
目标强调证据来源的层级：2006 年[1]、通用公式推导、现代标准资料三类不能混写。
-->

---

# 三个连续节次

<div class="grid-3"><div class="agenda-item"><h3>01 · 纳米风险</h3><p>路线图、缺陷驱动、延迟、信号/电源完整性、工艺变异、软错误与容错</p></div><div class="agenda-item"><h3>02 · 异构器件</h3><p>FPGA、MEMS、高速 I/O 与 RF 的结构、故障模型和测试指标</p></div><div class="agenda-item"><h3>03 · 现代补充</h3><p>2.5D/3D、IJTAG、低功耗/在役测试与 AI 辅助的证据边界</p></div></div>

<p class="small">三节均为纯理论讲授，时间标注为内容容量评审估计，不是课堂实测。</p>

<!--
先给出风险—异构—现代补充的逻辑。第三节只使用已核对资料；未核对版本的标准不写版本号和事实断言。
-->

---

<!-- _class: divider -->

# 第一节

## 纳米风险：从单个缺陷扩展到统计与系统失效

<p>45 分钟（评审估计）· 延迟、完整性、变异、软错误与容错</p>

<!--
本节不声称纳米尺寸必然导致某一种失效，而是解释为什么单固定型覆盖率不足以描述完整质量风险。
-->

---

# 2004 路线图是历史证据，不是当前工艺判断

<div class="compare"><div class="compare-panel"><h3>[1] 材料</h3><ul><li>特征尺寸从 4 μm 走向 65 nm</li><li>讨论百亿晶体管级 SoC</li><li>近端挑战按 ≥45 nm、至 2010 年划分</li><li>长期挑战按 &lt;45 nm、2010 年后划分</li></ul></div><div class="compare-panel highlight"><h3>阅读边界</h3><ul><li>它反映 2004 ITRS 的时代判断</li><li>不能把当时的节点预测当作现状</li><li>“成本可能超过硅制造”是趋势判断</li><li>现代结论必须另找当期证据</li></ul></div></div>

<p class="small">以下历史数字都只用于说明当时为什么把测试视为系统性问题。</p>

<!--
来源：[1] 第 12 章 第 679–684 页。把 ITRS 的角色讲成技术预见与需求评估，不把它当作已经发生的实验结论。
-->

---

# 互连线与封装使性能风险离开单纯晶体管尺寸

<div class="flow"><div class="flow-step">特征尺寸缩小</div><div class="flow-step">互连延迟占比上升</div><div class="flow-step">为降电阻增加互连高度</div><div class="flow-step">耦合、噪声与完整性风险增加</div></div>

<div class="grid-3"><div class="metric"><strong>时序</strong><h3>延迟</h3><p>局部缩短并不保证全局连线变快。</p></div><div class="metric"><strong>信号</strong><h3>串扰</h3><p>电容和电感耦合改变波形与到达时间。</p></div><div class="metric"><strong>电源</strong><h3>Ldi/dt</h3><p>同步开关造成电压跌落与地弹。</p></div></div>

<p>因此，测试对象不仅是逻辑值，还包括“在目标速度与工作条件下，波形是否仍落在安全裕度内”。</p>

<!--
来源：[1] 第 12 章 第 680–681、693–695 页。明确这是机理解释；不给出未经测量的具体噪声幅度。
-->

---

# 缺陷驱动测试从版图枚举可能的物理失效

<div class="compare"><div class="compare-panel"><h3>传统结构测试</h3><ul><li>以固定型等逻辑故障为入口</li><li>覆盖率按所选故障表报告</li><li>一次检测可能遗漏参数性缺陷</li></ul></div><div class="compare-panel highlight"><h3>缺陷驱动测试</h3><ul><li>从版图枚举桥接、开路与参数缺陷</li><li>映射到逻辑故障和关键路径</li><li>组合 at-speed、桥接、固定型与功能测试</li></ul></div></div>

<div class="formula"><span class="formula-label">N 次检测的含义</span>每个目标故障至少被 N 个不同条件检测</div>

<p>N-detect 试图增加激活条件与观察路径的多样性；它不自动保证所有物理缺陷均被覆盖。</p>

<!--
来源：[1] 第 12 章 第 696–698 页。[1] 讨论的工业百分比与具体器件不在这里复制为现状结论。
-->

---

# 延迟测试用一对向量分离“功能对”与“速度对”

<div class="flow"><div class="flow-step">v1 初始化</div><div class="flow-step">v2 产生变迁并敏化路径</div><div class="flow-step">在 T<sub>c</sub> 时刻捕获</div><div class="flow-step">与无故障响应比较</div></div>

<table>
<tr><th>模型</th><th>假设</th><th>主要边界</th></tr>
<tr><td>Transition</td><td>单门或端点慢上升/慢下降</td><td>短路径可能掩盖小延迟</td></tr>
<tr><td>Gate-delay</td><td>单门延迟增量，并考虑路径裕量</td><td>仍忽略多个小缺陷累积</td></tr>
<tr><td>Path-delay</td><td>整条路径超过时限</td><td>路径数可能呈指数增长</td></tr>
</table>

<!--
来源：[1] 第 12 章 第 685–691 页。transition fault 的 v2 可借用固定型测试；path-delay 能描述分布缺陷，但全路径不可行。
-->

---

# 信号完整性违约可以写成“越出安全带的面积”

<div class="formula"><span class="formula-label">概念性完整度损失</span>IL = Σ<sub>i</sub> ∫<sub>b<sub>i</sub></sub><sup>e<sub>i</sub></sup> [V<sub>i</sub> − f(t)] dt</div>

<div class="grid-3"><div class="concept"><h3>位置</h3><p>互连、供电网络和对噪声敏感的接收端。</p></div><div class="concept"><h3>图形</h3><p>最大攻击者模式与多跳变模式激发容性、感性耦合。</p></div><div class="concept"><h3>传感</h3><p>片内噪声、偏斜与抖动检测器把波形违约转为数字证据。</p></div></div>

<div class="callout warning">IL 积分是概念模型；真实阈值、采样带宽和时间窗口必须由工艺与接口规格定义。</div>

<!--
来源：[1] 第 12 章 第 693–696 页。积分式用于解释越界面积，不把它冒充任何具体芯片的测量标准。
-->

---

# 电源完整性测试寻找最坏同步开关条件

<div class="compare"><div class="compare-panel"><h3>物理链路</h3><p>同时翻转 → 瞬时电流变化 → 封装与片上供电网络压降 → 门延迟和保持时间改变。</p></div><div class="compare-panel highlight"><h3>测试难点</h3><ul><li>最坏电流波形依赖输入图形</li><li>慢速测试可能看不到 at-speed 违约</li><li>降低测试活动又可能降低覆盖率</li></ul></div></div>

<div class="formula"><span class="formula-label">一阶供电压降项</span>ΔV ≈ L · di/dt + I · R</div>

<p>片内监测点应覆盖供电薄弱区和关键接收端；仅测外部电源引脚可能错过局部压降。</p>

<!--
来源：[1] 第 12 章 第 680–681、693–696 页。公式是一阶概念关系，实际供电网络需分布式阻抗与时域分析。
-->

---

# 工艺变异把关键路径从确定集合变成概率集合

<div class="flow"><div class="flow-step">器件与互连参数随机化</div><div class="flow-step">单元延迟成为相关随机变量</div><div class="flow-step">芯片实例的关键路径可能不同</div><div class="flow-step">统计路径选择与统计 ATPG</div></div>

<div class="grid-3"><div class="metric"><strong>随机</strong><h3>局部变异</h3><p>掺杂、线宽和界面等局部波动。</p></div><div class="metric"><strong>系统</strong><h3>全局偏移</h3><p>同批或同区域参数整体偏移。</p></div><div class="metric"><strong>相关</strong><h3>空间相关</h3><p>邻近器件的偏差不可当独立事件。</p></div></div>

<div class="callout">“最坏路径”不再是所有芯片共有的单一确定答案，而是一个受制造实例与测试图形影响的概率集合。</div>

<!--
来源：[1] 第 12 章 第 691–692 页。统计延迟测试仍是理论框架；这里不引用未经核验的良率提升数字。
-->

---

# 软错误是瞬态电荷扰动，不是可重复制造缺陷

<div class="compare"><div class="compare-panel"><h3>形成机理</h3><p>辐射粒子穿过硅产生电子—空穴对；节点收集电荷后可能翻转存储状态或在组合逻辑形成脉冲。</p></div><div class="compare-panel highlight"><h3>测试含义</h3><ul><li>同一位置通常不可重复</li><li>短暂电测试难以按普通缺陷筛除</li><li>需要在线检测、纠错或容错结构</li></ul></div></div>

<div class="formula"><span class="formula-label">节点临界电荷</span>Q<sub>crit</sub> = C · V</div>

<p>[1] 指出缩小电容和电压会降低可承受电荷，但同时更小的收集面积等因素也影响实际错误率。</p>

<!--
来源：[1] 第 12 章 第 698–701 页。不得用 Q=CV 单独推出当前工艺的 SER；它只说明临界电荷的一阶构成。
-->

---

# 容错与测试是互补而非替代关系

<table>
<tr><th>方式</th><th>基本机制</th><th>主要代价或边界</th></tr>
<tr><td>空间冗余</td><td>复制计算并比较或表决</td><td>面积、功耗和检查器自身可测性</td></tr>
<tr><td>时间冗余</td><td>重复执行后比较</td><td>难检测稳定复现的硬故障</td></tr>
<tr><td>信息冗余</td><td>Parity / ECC 等编码</td><td>额外校验位、编解码与多位错误边界</td></tr>
<tr><td>缺陷容忍</td><td>备用行列或资源重映射</td><td>备用资源也会故障，收益边际递减</td></tr>
</table>

<div class="callout">容错结构可能把制造缺陷“藏”在正确输出之后，因此冗余自身和剩余纠错能力也必须被测试。</div>

<!--
来源：[1] 第 12 章 第 701–705 页。测试负责暴露缺陷，容错负责运行中避免失效；两者不能互相替代。
-->

---

<!-- _class: divider -->

# 第二节

## 异构器件：可编程资源、机电耦合与高频接口

<p>45 分钟（评审估计）· FPGA、MEMS、高速 I/O 与 RF</p>

<!--
本节按被测量对象的物理属性组织，而不是按仪器分类。可编程性、机械位移和高频模拟波形分别改变测试模型。
-->

---

# FPGA 的可编程性同时提供测试手段与测试难题

<div class="grid-2"><div class="concept"><h3>结构</h3><p>二维逻辑块、可编程互连、I/O 与专用 RAM/DSP/处理器核。</p></div><div class="concept"><h3>配置存储器</h3><p>配置位决定逻辑、布线和开关状态，本身也必须检测固定型故障。</p></div><div class="concept"><h3>优势</h3><p>可重构 TPG/ORA，且可生成应用相关或应用无关测试配置。</p></div><div class="concept"><h3>难点</h3><p>大量配置需要下载；布线资源数量和故障模型远大于逻辑块。</p></div></div>

<p class="small">[1] 讨论的规模数字属于当时 FPGA 器件，不能外推为当前器件容量。</p>

<!--
来源：[1] 第 12 章 第 706–708 页。FPGA 测试不是只测用户设计，还要在多种配置下测试可编程逻辑与路由资源。
-->

---

# FPGA BIST 把一部分逻辑块临时变成测试器

<div class="flow"><div class="flow-step">配置 TPG/BUT/ORA</div><div class="flow-step">施加多模式测试</div><div class="flow-step">比较相邻同构输出</div><div class="flow-step">翻转角色重复测试</div></div>

<div class="compare"><div class="compare-panel"><h3>逻辑资源</h3><p>若干 test session；每个 PLB 需覆盖组合、时序、进位等功能模式。</p></div><div class="compare-panel highlight"><h3>路由资源</h3><p>需要比较法或奇偶校验法覆盖线网、开关、桥接和固定型故障。</p></div></div>

<div class="callout">配置次数、诊断分辨率与测试时间是三个相互制约的目标；比较区域越大，定位越粗。</div>

<!--
来源：[1] 第 12 章 第 708–710 页。具体 session 和配置次数在[1] 中是历史经验范围，不作为现代器件常数。
-->

---

# MEMS 测试必须同时观察电学响应与机械状态

<div class="formula"><span class="formula-label">静态差分电容</span>C<sub>1</sub> = C<sub>2</sub> = ε<sub>0</sub>S / d<sub>0</sub></div>

<div class="formula"><span class="formula-label">小位移近似</span>C<sub>1</sub> ≈ C<sub>0</sub>(1+x/d<sub>0</sub>)，C<sub>2</sub> ≈ C<sub>0</sub>(1−x/d<sub>0</sub>)</div>

<p>对固定极板施加互补调制电压，可由中心可动电极电压恢复位移；因此，电气测试可间接观察机械激励。</p>

<div class="callout warning">小位移近似要求 <code>|x|≪d<sub>0</sub></code>；驱动电压过大可能发生吸合失稳。</div>

<!--
来源：[1] 第 12 章 第 711–713 页。MEMS 的“输出”来自机电耦合，并不能只用普通逻辑真值表描述。
-->

---

# MEMS BIST 用静电力代替外部物理激励

<div class="compare"><div class="compare-panel"><h3>灵敏度测试</h3><p>驱动极板施加测试电压，产生模拟物理刺激的静电力，再比较可动电极响应与校准范围。</p></div><div class="compare-panel highlight"><h3>对称性测试</h3><p>将固定极板分区并施加互补信号；无缺陷时差分结构中心电压为零，局部缺陷破坏对称。</p></div></div>

<div class="formula"><span class="formula-label">静电驱动力概念式</span>F<sub>d</sub> = ε<sub>0</sub>S V<sub>d</sub><sup>2</sup> / (2d<sup>2</sup>)</div>

<p>双模式 BIST 组合灵敏度与对称性证据，可覆盖部分驱动极板、质量块与局部结构缺陷。</p>

<!--
来源：[1] 第 12 章 第 713–716 页。静电力与电压平方成正比，驱动方向与上下分区配置决定测试激励。
-->

---

# 高速 I/O 把时间裕量变成接口测试的核心

<table>
<tr><th>接口</th><th>时序参考</th><th>主要风险</th></tr>
<tr><td>公共时钟 CC</td><td>系统时钟同时约束收发</td><td>时钟偏斜侵蚀周期裕量</td></tr>
<tr><td>源同步 SS</td><td>数据与选通共同传输</td><td>数据位间偏斜、建立/保持</td></tr>
<tr><td>嵌入式时钟串行</td><td>CDR 从数据恢复时钟</td><td>抖动、均衡、误码率、协议层</td></tr>
</table>

<div class="formula"><span class="formula-label">有效时序直观关系</span>周期 ≥ 驱动延迟 + 飞行时间 + 建立/保持 + 偏斜与抖动</div>

<p>串行链路还需区分 PHY 的模拟波形质量与链路层的编码、纠错和重传。</p>

<!--
来源：[1] 第 12 章 第 719–724 页。[1] 中的具体 Mbps/Gbps 数值属于当时技术背景，只保留机制和相对关系。
-->

---

# I/O 测试从逐引脚指标转向环回与统计判据

<div class="compare"><div class="compare-panel"><h3>I/O wrap</h3><p>输出经内部或测试接口回到输入，主要检测总体延迟缺陷。</p></div><div class="compare-panel highlight"><h3>AC I/O loopback</h3><p>移动选通相对数据的相位，分别压缩 Tvb 与 Tva，测量组合时序裕量。</p></div></div>

<div class="grid-3"><div class="metric"><strong>Eye</strong><h3>眼图</h3><p>幅度与时间开口描述可采样区域。</p></div><div class="metric"><strong>Jitter</strong><h3>抖动</h3><p>确定性抖动与随机抖动共同压缩时间余量。</p></div><div class="metric"><strong>BER</strong><h3>误码率</h3><p>链路质量必须连同测试时间与置信度解释。</p></div></div>

<!--
来源：[1] 第 12 章 第 724–728 页。环回降低仪器需求，但直接环回不一定覆盖真实信道的最坏损伤。
-->

---

# RF 前端测试按模块规格与系统规格分层

<div class="grid-2"><div class="concept"><h3>接收链路</h3><p>LNA、混频器与基带：增益、噪声系数、三阶截点与解调质量。</p></div><div class="concept"><h3>发射链路</h3><p>基带、混频器与 PA：转换增益、输出功率、线性度与邻道泄漏。</p></div><div class="concept"><h3>公共条件</h3><p>频率、输入功率、LO 功率、阻抗匹配和负载都必须写进指标。</p></div><div class="concept"><h3>系统层</h3><p>BER、灵敏度、动态范围、EVM 与协议一致共同约束可用性。</p></div></div>

<p class="small">同一“增益”在混频器中还要注明输入频率、LO 频率与输出频率。</p>

<!--
来源：[1] 第 12 章 第 729–730 页。模块性能和系统性能不能互相替代，窄带单音指标也不能完整代表调制信号质量。
-->

---

# RF 指标把非线性、噪声与调制误差分开测量

<div class="grid-2"><div class="concept"><h3>Gain / TOI</h3><p>线性区测增益；两音靠近时，三阶互调分量靠近基波，不能简单滤除。</p></div><div class="concept"><h3>Noise Figure</h3><p><code>NF = SNR<sub>in</sub>/SNR<sub>out</sub></code>，必须绑定频率、带宽与源阻抗。</p></div><div class="concept"><h3>ACPR</h3><p>发射频谱泄漏到相邻信道；取决于调制、功率和 PA 非线性。</p></div><div class="concept"><h3>EVM</h3><p>实测星座点相对理想点的矢量误差，综合反映噪声、失真与相位误差。</p></div></div>

<div class="formula"><span class="formula-label">三阶截点估算</span>TOI = P<sub>out</sub> + (P<sub>out</sub> − P<sub>IMD</sub>) / 2</div>

<!--
来源：[1] 第 12 章 第 730–735 页。TOI 公式在[1] 使用 dB/dBm 语境；输入/输出参考面必须明确，避免随意混用 IIP3 与 OIP3。
-->

---

<!-- _class: divider -->

# 第三节

## 现代补充：堆叠、仪器网络、在役风险与数据驱动方法

<p>45 分钟（评审估计）· 截至 2026-10-26 的受控标准状态核对</p>

<!--
本节只补足 [1] 之后的结构性变化。标准与近期资料依据 [2]–[10]，不把 Active PAR 当作已发布标准，也不把资料元数据当作实验效果。
-->

---

# 现代内容必须先标明证据层级

<table>
<tr><th>层级</th><th>可写内容</th><th>不能推出什么</th></tr>
<tr><td>2006 [1]</td><td>历史路线图、机制、经典模型</td><td>不能代表当前工艺与标准状态</td></tr>
<tr><td>通用公式</td><td>在假设范围内可推导的关系</td><td>不能替代真实器件参数与实验</td></tr>
<tr><td>2026 标准资料</td><td>发布版、行政状态与在研 PAR</td><td>不能推出工具支持或产品覆盖率</td></tr>
<tr><td>研究专著与综述</td><td>方法分类、问题空间与开放挑战</td><td>不能把文中结果当作本课程实测</td></tr>
</table>

<p class="small">以下标准状态均为 2026-10-26 的 IEEE SA 页面核验结果。</p>

<!--
来源：[2]–[10]。证据分层是现代补充页的总规则。
-->

---

# 2.5D/3D 测试把“已知合格裸片”变成系统问题

<div class="compare"><div class="compare-panel"><h3>2.5D</h3><p>多个裸片通过中介层或封装互连；每颗裸片的测试、互连测试和装配后系统测试共享封装边界。</p></div><div class="compare-panel highlight"><h3>3D</h3><p>裸片垂直堆叠，层间互连可能只能在键合后访问；越晚暴露的缺陷，损失越大。</p></div></div>

<div class="grid-3"><div class="concept"><h3>Pre-bond</h3><p>先确认可测试的裸片与关键结构，降低继续堆叠的风险。</p></div><div class="concept"><h3>Inter-die</h3><p>检查层间连接的通断、桥接与参数异常。</p></div><div class="concept"><h3>Post-bond</h3><p>在部分或完整堆叠上执行系统级访问、隔离与诊断。</p></div></div>

<!--
概念来源：三维测试通用问题空间；标准状态见 [5]、[10]。IEEE 1838-2019 于 2020-03-13 发布，状态 Active Standard；P1838a 为 Active PAR，不能写成已发布修订。
-->

---

# IEEE 1838 解决堆叠裸片的测试访问入口

<div class="grid-2"><div class="concept"><h3>已发布标准</h3><p>IEEE Std 1838-2019 [5]，2020-03-13 发布，2026-10-26 状态为 Active Standard。</p></div><div class="concept"><h3>在研修订</h3><p>P1838a [10] 于 2024-02-15 批准为 Active PAR，方向是外部互连边界扫描测试修订。</p></div></div>

<div class="flow"><div class="flow-step">裸片级入口</div><div class="flow-step">堆叠访问路径</div><div class="flow-step">层间互连观察</div><div class="flow-step">系统级隔离与诊断</div></div>

<div class="callout warning">“有标准入口”不等于所有封装形态、所有缺陷模型或所有 EDA 工具都已覆盖。</div>

<!--
来源：[5]–[7]、[10]。只陈述标准编号、日期、状态和公开范围；不猜测协议寄存器细节。
-->

---

# IJTAG 把片内仪器组织成可访问网络

<div class="compare"><div class="compare-panel"><h3>测试访问的变化</h3><p>从少量固定数据寄存器，走向大量嵌入式传感器、监视器、BIST 与调试仪器。</p></div><div class="compare-panel highlight"><h3>描述与过程分离</h3><p>ICL 描述仪器网络结构；PDL 描述通过该网络执行的操作序列。</p></div></div>

<table>
<tr><th>项目</th><th>核验状态</th></tr>
<tr><td>IEEE Std 1687-2014 [7]</td><td>Inactive-Reserved，2025-03-27 转入</td></tr>
<tr><td>P1687 [8]</td><td>Active PAR，2022-03-24 批准</td></tr>
<tr><td>P1687.1 [9]</td><td>Active PAR，2025-02-13 批准，网络接口与控制器扩展</td></tr>
</table>

<!--
来源：[7]–[9]。不要说 1687-2014 是“当前 Active Standard”；它已是 Inactive-Reserved，修订仍在 PAR 阶段。
-->

---

# 低功耗与在役测试扩展了“何时测、以多大活动测”

<div class="grid-2"><div class="concept"><h3>测试功耗</h3><p>并行扫描、at-speed 捕获与多核并发可能产生超过功能模式的瞬时电流和热点。</p></div><div class="concept"><h3>低功耗结构引入新故障</h3><p>电源门控、保持模式与睡眠/唤醒序列需要新的状态与时序判据。</p></div><div class="concept"><h3>在役测试</h3><p>利用片内监视、周期性自检或后台测试观察老化、间歇故障与软错误。</p></div><div class="concept"><h3>风险边界</h3><p>观测越持续，对性能、功耗、隐私与功能干扰的约束越强。</p></div></div>

<p class="small">[1] 已提出 drowsy fault 与 online testing 问题；这里只保留机制，不把当时工艺判断写成现状。</p>

<!--
历史来源：[1] 第 12 章 第 680–681、697–705 页。现代内容作概念补充，不绑定未核验的标准版本或工具指标。
-->

---

# AI 辅助测试可分成预测、生成与分析三类

<div class="grid-3"><div class="concept"><h3>可测性预测</h3><p>从结构或图特征预测难测节点和测试点收益，辅助传统 SCOAP/COP 与搜索。</p></div><div class="concept"><h3>测试与验证</h3><p>学习图形选择、故障排序或验证刺激分布，减少无效尝试。</p></div><div class="concept"><h3>诊断与数据分析</h3><p>从响应、日志和失效特征产生候选根因，供物理诊断验证。</p></div></div>

<div class="callout warning">训练集泄漏、工艺分布漂移、标签噪声与不可解释输出都可能把“预测准确”误当成测试覆盖率。</div>

<p class="small">资料依据：可测性预测专著 [2]、机器学习与 VLSI 专著 [3]、数字测试机器学习综述 [4]。</p>

<!--
来源：[2]–[4]。资料只支持方法分类与研究边界；本项目没有复现任何 AI 测试性能数字。
-->

---

# 完整例题：高置信度 BER 测试为何耗时

<div class="compare"><div class="compare-panel"><h3>假设</h3><p>独立误码、目标 <code>p=10<sup>−12</sup></code>、观测到零错误、要求 95% 单侧置信上限。</p></div><div class="compare-panel highlight"><h3>所需位数</h3><div class="formula">n = ln(1−C) / ln(1−p)<br>≈ 2.996×10<sup>12</sup> bit</div></div></div>

<table>
<tr><th>有效速率</th><th>纯测试时间</th></tr>
<tr><td>10 Gbit/s</td><td>≈ 299.6 s</td></tr>
<tr><td>25 Gbit/s</td><td>≈ 119.8 s</td></tr>
<tr><td>50 Gbit/s</td><td>≈ 59.9 s</td></tr>
</table>

<div class="callout warning">这是基于理想独立模型的公式例题，不含均衡、突发错误、建立时间与实际仪器开销。</div>

<!--
计算推导：n=ln(0.05)/ln(1−10^-12)≈2.996×10^12；除以 10^10、2.5×10^10、5×10^10 bit/s 得 299.6、119.8、59.9 秒。假设和目标可换，结论只说明 BER 证据的时间成本。
-->

---

# 本讲结论：测试选择取决于物理风险与证据成本

<ul class="takeaways">
<li>纳米风险由延迟、完整性、工艺变异、软错误和系统交互共同构成。</li>
<li>缺陷驱动、N 次检测与统计延迟测试补充固定型覆盖率，但不取消其定义。</li>
<li>FPGA、MEMS、高速 I/O 与 RF 分别要求配置、机电耦合、时序和频域判据。</li>
<li>容错、在役测试与低功耗设计把可靠性目标延伸到制造测试之外。</li>
<li>IEEE Std 1838-2019 [5] 与 IEEE Std 1500-2022 [6] 为 Active Standard；IEEE Std 1687-2014 [7] 为 Inactive-Reserved。</li>
<li>P1838a [10]、P1687 [8]、P1687.1 [9] 均为 Active PAR，不能写成已发布标准。</li>
</ul>

<p class="small">素材来源：[1] 第 12 章 679–737 页；现代标准与近期资料依据 [2]–[10]。</p>

<!--
口头思考题：如果固定型覆盖率很高，是否可以直接宣称产品满足全部可靠性要求？不能。应补充缺陷分布、延迟、完整性、软错误、测试条件和逃逸成本等证据。
-->

---

<!-- _class: dense -->

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

[2] H. Ren and J. Hu, Eds., *Machine Learning Applications in Electronic Design Automation*. Cham, Switzerland: Springer, 2022.

[3] A. Kumar, S. L. Tripathi, and K. S. Rao, Eds., *Machine Learning Techniques for VLSI Chip Design*. Hoboken, NJ, USA: Wiley, 2023.

[4] M. Pradhan and B. B. Bhattacharya, "A survey of digital circuit testing in the light of machine learning," *WIREs Data Mining and Knowledge Discovery*, vol. 11, no. 1, e1360, 2021.

[5] IEEE, *IEEE Standard for Test Access Architecture for Three-Dimensional Stacked Integrated Circuits*, IEEE Std 1838-2019, 2019.

---

# 参考文献（续）

[6] IEEE, *IEEE Standard for Embedded Core Test*, IEEE Std 1500-2022, 2022.

[7] IEEE, *IEEE Standard for Access and Control of Instrumentation Embedded within a Semiconductor Device*, IEEE Std 1687-2014, 2014.

[8] IEEE Standards Association, "P1687: Standard for Access and Control of Instrumentation Embedded within a Semiconductor Device," Project Authorization Request, 2022. [Online]. Available: <https://standards.ieee.org/ieee/1687/10896/>.

[9] IEEE Standards Association, "P1687.1: Standard for the IJTAG Network Interface and Controller," Project Authorization Request, 2025. [Online]. Available: <https://standards.ieee.org/ieee/1687.1/11961/>.

[10] IEEE Standards Association, "P1838a: Standard for Test Access Architecture for Three-Dimensional Stacked Integrated Circuits, Amendment 1," Project Authorization Request, 2024. [Online]. Available: <https://standards.ieee.org/ieee/1838a/11536/>.
