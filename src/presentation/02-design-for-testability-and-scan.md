---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 2 章 · 可测性设计与扫描架构'
source: '课程定位见 src/plan/README.md；理论依据为[1] 第 2 章（印刷页 37–104）'
---

<!-- _class: lead -->
<!-- _header: '' -->
<!-- _footer: '' -->

# 可测性设计与扫描架构

## 让内部状态变得可控制、可观察、可复用

<p class="small">3 × 45 分钟理论课堂 · [1] 第 2 章章节结构 · 从可测性度量到扫描流程</p>

<p class="small">理论依据：[1] 第 2 章 §2.1–§2.9。</p>

<!--
本页提出全章中心问题：时序状态藏在芯片内部，外部引脚只能看到有限输入输出。可测性设计不是增加测试数量，而是改变结构，使状态控制和观察变成可计算、可实施的设计任务。
-->

---

# 中心问题与三个连续节次

<div class="agenda-grid">
<div class="agenda-item"><h3>01 · 度量</h3><p>SCOAP、概率型、模拟型与 RTL 可测性分析，回答“哪里难测”。</p></div>
<div class="agenda-item"><h3>02 · 结构</h3><p>Ad hoc 测试点、MUX-D、Clocked-scan、LSSD、全/部分/随机访问扫描。</p></div>
<div class="agenda-item"><h3>03 · 规则与流程</h3><p>六类扫描规则、移位/捕获验证、成本、特殊扫描与 RTL DFT。</p></div>
<div class="agenda-item"><h3>贯穿问题</h3><p>如何把时序电路测试转化为可控状态、组合响应和可复用测试结构？</p></div>
</div>

<div class="formula"><span class="formula-label">全章评价链</span>可测性度量 → 结构改造 → 规则检查 → 扫描验证 → 面积/时延/时间成本</div>

<p class="small">学时口径：3 × 45 分钟（评审估计）；全章只讨论理论模型与结构，不安排工具操作。</p>

<!--
说明三个节次的递进关系。度量不是装饰性数字，而是决定测试点或扫描选择；结构必须经过规则和验证；最终报告必须包含成本。时间为课程设计值。
-->

---

<!-- _class: divider -->
<!-- _header: '' -->

# 第 1 节

## 如何量化“难控制”和“难观察”

<p>45 分钟（评审估计）· SCOAP、概率、模拟与 RTL 可测性</p>

<!--
进入度量。可测性不是一个绝对物理量，而是相对于主输入、主输出、测试模式和测试图形分布的相对成本。
-->

---

<!-- _class: dense -->

# 可控性与可观性是一对方向相反的成本

<div class="compare">
<div class="compare-panel highlight">
<h3>可控性</h3>
<p>从主输入出发，给内部节点赋指定逻辑值所需的操作代价。组合度量关注信号操作数，时序度量关注时钟周期数。</p>
<div class="formula">CC0(s), CC1(s)　；　SC0(s), SC1(s)</div>
</div>
<div class="compare-panel">
<h3>可观性</h3>
<p>从内部节点把逻辑差异传播到主输出所需的操作代价。数值越大，表示越难观察。</p>
<div class="formula">CO(s)　；　SO(s)</div>
</div>
</div>

<div class="callout">SCOAP 使用整数启发式：可控性通常从 1 起，可观性可从 0 起；具体边界条件必须在使用时明确。</div>

<p class="small">依据：[1] §2.2.1（印刷页 40–41）。</p>

<!--
区分组合度量和时序度量。可控性数值越小越容易控制，可观性数值越小越容易观察；不要把“数值大”误读为可测性更好。边界条件用于开始递推。
-->

---

# SCOAP 的门级规则把局部结构变成可递推数值

<table>
<tr><th>门</th><th>0-可控性</th><th>1-可控性</th><th>输入可观性</th></tr>
<tr><td>AND / NAND</td><td>min(输入 CC0) + 1</td><td>Σ 输入 CC1 + 1</td><td>CO<sub>out</sub> + 其他输入 CC1 + 1</td></tr>
<tr><td>OR / NOR</td><td>Σ 输入 CC0 + 1</td><td>min(输入 CC1) + 1</td><td>CO<sub>out</sub> + 其他输入 CC0 + 1</td></tr>
<tr><td>NOT / BUFFER</td><td>相反值输入 + 1</td><td>对应输入 + 1</td><td>CO<sub>out</sub> + 1</td></tr>
<tr><td>Primary input</td><td>1</td><td>1</td><td>—</td></tr>
<tr><td>Primary output</td><td>—</td><td>—</td><td>0</td></tr>
</table>

<p>可控性从主输入向主输出前向计算；可观性从主输出向内部节点后向计算。每个门增加一次信号操作代价，反相门交换 CC0 与 CC1。</p>

<p class="small">依据：[1] §2.2.1.1、表 2.1–2.2（印刷页 41–42）。</p>

<!--
逐行解释 AND、OR 和非门规则。不要把 XOR/XNOR 省略成错误规则；本页只保留后续例题需要的门类，下一页再用于计算。强调前向与后向两个方向。
-->

---

<!-- _class: dense -->

# 完整例题：计算 z=(a·b)+c 的 SCOAP 三元组

<div class="compare">
<div class="compare-panel">
<h3>先做可控性</h3>
<p>主输入 a、b、c 的 CC0=CC1=1。</p>
<div class="formula">g=a·b：CC0=2，CC1=3<br>z=g+c：CC0=2，CC1=5</div>
</div>
<div class="compare-panel highlight">
<h3>再做可观性</h3>
<p>主输出 z 的 CO=0。</p>
<div class="formula">CO(g)=0+CC0(c)+1=2<br>CO(c)=0+CC0(g)+1=3<br>CO(a)=CO(g)+CC1(b)+1=4<br>CO(b)=CO(a)=4</div>
</div>
</div>

<p><strong>结果（CC0/CC1/CO）：</strong>a:1/1/4　b:1/1/4　c:1/1/3　g:2/3/2　z:2/5/0</p>

<p class="small">依据：[1] §2.2.1.1（印刷页 41–43）；例题为本课程简化。</p>

<!--
完整展示每一步。解释 z 的 CC1=3+1+1=5，因为 OR 要输出 1，必须同时把一个输入置 1；观察 g 需把 c 置 0，观察 c 需把 g 置 0。结果中最难控制的是 z 的 1，最难观察的是 a、b。
-->

---

<!-- _class: dense -->

# 时序 SCOAP 每经过一个存储元件就增加一个时钟周期

<div class="compare">
<div class="compare-panel">
<h3>DFF 的数据通路</h3>
<div class="formula">SC0(q) ≥ SC0(d) + 1<br>SC1(q) ≥ SC1(d) + 1<br>SO(d) ≥ SO(q) + 1</div>
<p>数据装入或响应移出都通过一个时钟边界。</p>
</div>
<div class="compare-panel highlight">
<h3>异步控制可缩短路径</h3>
<p>若异步复位可直接把 q 清零，则 SC0(q) 可改由复位路径计算；但复位有效时的竞争和时序必须在扫描规则中另行检查。</p>
</div>
</div>

<div class="callout">组合可控性可以因逻辑优化而降低，时序可控性却可能因增加一个非扫描触发器而增加一个周期。</div>

<p class="small">依据：[1] §2.2.1.2（印刷页 43–45）。</p>

<!--
说明时序公式是下界和启发式，不等于实际 ATPG 序列长度。异步清复位提供更短路径，但可能破坏扫描移位，必须由后续规则处理。
-->

---

<!-- _class: dense -->

# 概率型可测性用随机图形成功率替代操作计数

<div class="formula"><span class="formula-label">基本定义</span>C0(s) + C1(s) = 1　；　0 ≤ C0,C1,O ≤ 1</div>

<div class="compare">
<div class="compare-panel">
<h3>AND 门递推</h3>
<div class="formula">C1(z)=C1(a)C1(b)<br>C0(z)=1−C1(z)<br>O(a)=O(z)C1(b)</div>
</div>
<div class="compare-panel highlight">
<h3>随机图形难测故障</h3>
<p>若某节点的 C0 或 C1，或从该节点到输出的 O 很小，则随机图形命中概率低，称为随机图形抵抗故障（RP-resistant）。</p>
</div>
</div>

<p><strong>解释：</strong>概率型更贴近随机测试，但递推仍假设输入独立；重汇聚扇出会破坏该假设。依据[1] §2.2.2（印刷页 45–47）。</p>

<!--
概率型数值越小越难控制和观察，与 SCOAP 的“数值越大越难”相反。AND 的输入既相互独立又均匀时 C0=.75、C1=.25。RP-resistant 是随机测试覆盖饱和的原因之一。
-->

---

# 概率例题：均匀输入下与门的随机可测性

<div class="grid-2">
<div class="compare-panel">
<h3>可控性</h3>
<p>a、b 的 P(0)=P(1)=0.5。</p>
<div class="formula">C1(z)=0.5×0.5=0.25</div>
<div class="formula">C0(z)=1−0.25=0.75</div>
<p>随机输入把 z 置 1 比置 0 更难，若目标固定型需要 z=1，测试概率更低。</p>
</div>
<div class="compare-panel highlight">
<h3>可观性</h3>
<p>z 是主输出，所以 O(z)=1。</p>
<div class="formula">O(a)=O(z)×C1(b)=0.5</div>
<div class="formula">O(b)=O(a)=0.5</div>
<p>从 a 观察差异需要 b=1，概率为 0.5；故障激活与传播联合概率约为 0.25。</p>
</div>
</div>

<div class="callout">对照 SCOAP：同一与门的 CC1=3，而概率型 C1=.25。两者量纲和方向不同，不能直接比较数值大小。</div>

<p class="small">依据：[1] §2.2.2 的规则与定义（印刷页 45–47）；数值为本课程算例。</p>

<!--
从概率型例题推出激活与传播的联合概率。强调两种度量不能混用阈值。若固定型故障的激活概率极小，可插入控制点或增加偏置随机测试。
-->

---

# 模拟型与 RTL 度量把拓扑近似变成行为证据

<div class="grid-2">
<div class="concept">
<h3>模拟型分析</h3>
<ul>
<li>对样本向量执行逻辑或故障模拟。</li>
<li>统计 0、1、跳变和故障检测事件。</li>
<li>用统计采样改善扇出重汇聚下的相关性。</li>
<li>代价是仿真时间与样本选择偏差。</li>
</ul>
</div>
<div class="concept">
<h3>RTL 分析</h3>
<ul>
<li>用寄存器结构图表示数据传递。</li>
<li>最大寄存器层数给出时序深度线索。</li>
<li>用功能块 DAG 保留运算语义，减少门级重汇聚。</li>
<li>早期修复可避免多次综合迭代。</li>
</ul>
</div>
</div>

<div class="formula"><span class="formula-label">RTL 时序深度</span>D<sub>seq</sub> = 寄存器结构图中从输入到输出的最大寄存器层数</div>

<p class="small">依据：[1] §2.2.3–§2.2.4（印刷页 47–50）。</p>

<!--
模拟型用行为证据，RTL 型用结构或功能信息。RTL 可以减少重汇聚和计算量，但保真度取决于模型粒度。时序深度不是实际测试周期数，而是相对复杂度提示。
-->

---

# 度量选择取决于测试目标与可接受的计算代价

<table>
<tr><th>方法</th><th>输入信息</th><th>计算特征</th><th>适用解释</th></tr>
<tr><td>SCOAP</td><td>门级拓扑</td><td>近线性递推，快速</td><td>确定性测试难度和测试点位置</td></tr>
<tr><td>概率型</td><td>门级拓扑与输入概率</td><td>快速，但独立性近似</td><td>随机/伪随机测试抵抗性</td></tr>
<tr><td>模拟型</td><td>电路与样本向量</td><td>较慢，依赖样本</td><td>实际向量集下的控制和观察证据</td></tr>
<tr><td>RTL</td><td>寄存器与功能块</td><td>早期、可扩展</td><td>状态深度和高层可测性改造</td></tr>
</table>

<div class="callout">任何度量都是“相对难度的代理指标”；最终结论仍应由故障覆盖、测试长度和结构代价共同支持。</div>

<p class="small">依据：[1] §2.2（印刷页 40–50）。</p>

<!--
用表比较四类度量的输入、代价和解释边界。为第二节的测试点和扫描结构铺路：哪里难控制就考虑控制点或扫描访问，哪里难观察就考虑观察点或扫描链。
-->

---

<!-- _class: divider -->
<!-- _header: '' -->

# 第 2 节

## 用测试点和扫描单元重构状态访问

<p>45 分钟（评审估计）· Ad hoc DFT、扫描单元与扫描架构</p>

<!--
进入结构改造。先讲局部测试点，再讲可系统化的扫描。核心比较是：局部修补改善若干节点，扫描把大量状态组织成统一访问机制。
-->

---

# Ad hoc DFT 改善局部节点，但结果依赖设计经验

<div class="grid-2">
<div class="compare-panel">
<h3>典型做法</h3>
<ul>
<li>避免异步置位/复位直接干扰扫描。</li>
<li>打断组合反馈环路。</li>
<li>拆分大电路以降低控制深度。</li>
<li>避免冗余逻辑和不可观察节点。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>测试点</h3>
<p>控制点从外部注入内部值，观察点把内部值送到可观察输出。插入位置通常由可测性分析结果决定。</p>
<div class="formula">目标：提高 C0 或 C1，或提高 O</div>
</div>
</div>

<div class="callout">Ad hoc 方法能显著改善特定节点，但不容易预测整体覆盖率和跨设计复用；它通常作为结构化 DFT 的补充。</div>

<p class="small">依据：[1] §2.3–§2.3.1（印刷页 50–53）。</p>

<!--
不要把 ad hoc 讲成任意加逻辑。测试点由度量或结构瓶颈驱动，并且要计入面积、时延和引脚成本。其局限正是扫描设计出现的动机。
-->

---

# 观察点与控制点用不同方向修补测试通路

<div class="compare">
<div class="compare-panel">
<h3>观察点</h3>
<p>把难观察节点的值捕获到测试触发器，再串成观察移位寄存器移出。</p>
<div class="formula">增益：降低 CO(s)，增加少量时序与布线</div>
</div>
<div class="compare-panel highlight">
<h3>控制点</h3>
<p>在原连线中插入多路选择器，测试模式选择外部值或扫描触发器值驱动目标节点。</p>
<div class="formula">代价：功能路径增加 t<sub>mux</sub></div>
</div>
</div>

<div class="callout warning">控制点不应放在关键时序路径上；多观察点合并虽能减少引脚和触发器，却可能降低诊断分辨率。</div>

<p class="small">依据：[1] §2.3.1.1（印刷页 51–53）。</p>

<!--
分别解释观察点与控制点的数据方向。控制点会改变功能输入路径，观察点主要增加负载和捕获逻辑。测试点选择要在改善量、面积、时延和诊断分辨率之间折中。
-->

---

# MUX-D 扫描单元用 SE 在功能 D 与扫描 SI 之间选择

<div class="compare">
<div class="compare-panel">
<h3>结构</h3>
<div class="flow">
<div class="flow-step">DI</div>
<div class="flow-step">MUX</div>
<div class="flow-step">D 触发器</div>
<div class="flow-step">Q/SO</div>
</div>
<p>SE=0 选择功能数据 DI；SE=1 选择扫描输入 SI。输出 Q/SO 可在功能负载与下一扫描单元之间共享。</p>
</div>
<div class="compare-panel highlight">
<h3>模式与时序</h3>
<table>
<tr><th>模式</th><th>SE</th><th>时钟沿动作</th></tr>
<tr><td>正常/捕获</td><td>0</td><td>装入 DI</td></tr>
<tr><td>移位</td><td>1</td><td>装入 SI</td></tr>
</table>
<div class="formula">功能路径延迟 ≈ t<sub>clk→Q</sub> + t<sub>comb</sub> + t<sub>mux</sub></div>
</div>
</div>

<div class="callout">MUX-D 兼容常见单时钟触发器，工具支持成熟；主要代价是扫描多路选择器进入功能路径。</div>

<p class="small">依据：[1] §2.4、§2.4.1（印刷页 55–56）。</p>

<!--
强调 SE 选择的是触发器前的数据源，不是时钟。捕获模式通常选择 DI，移位模式选择 SI。时序代价发生在 DI 路径；SE 的全局控制还必须满足建立时间和布线约束。
-->

---

# Clocked-scan 与 LSSD 用独立时钟替代输入多路选择

<div class="compare">
<div class="compare-panel">
<h3>Clocked-scan</h3>
<ul>
<li>DCK 装入功能数据，SCK 装入扫描数据。</li>
<li>数据输入没有 MUX 延迟。</li>
<li>需要额外移位时钟布线。</li>
<li>两个时钟的相位与竞争必须控制。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>LSSD</h3>
<ul>
<li>L1/L2 双锁存、极性保持结构。</li>
<li>C 捕获，A/B 非重叠移位。</li>
<li>适合锁存器设计，目标是无竞争扫描。</li>
<li>额外时钟与布线增加复杂度。</li>
</ul>
</div>
</div>

<div class="formula"><span class="formula-label">LSSD 基本时序约束</span>A、B、C 必须按设计规则非重叠；任何相邻 SRL 不能因同一时钟同时透明</div>

<p class="small">依据：[1] §2.4.2–§2.4.3（印刷页 56–59）。</p>

<!--
比较三种单元的差异：MUX-D 用数据选择，Clocked-scan 用双时钟选择，LSSD 用多相非重叠锁存。LSSD 的无竞争优势以时钟规则和布线为代价。
-->

---

# 全扫描把状态位变成伪主输入和伪主输出

<div class="compare">
<div class="compare-panel">
<h3>组合逻辑的边界扩展</h3>
<div class="formula">PPI = 扫描单元输出</div>
<div class="formula">PPO = 扫描单元输入</div>
<p>PI 与 PPI 都可控制，PO 与 PPO 都可观察；差别只是 PI/PO 并行，PPI/PPO 串行。</p>
</div>
<div class="compare-panel highlight">
<h3>测试含义</h3>
<ul>
<li>扫描移位把任意状态装入触发器链。</li>
<li>捕获周期装入组合逻辑响应。</li>
<li>组合 ATPG 可处理 PI、PPI、PO、PPO。</li>
<li>全扫描的时序深度在理想模型中变为 0。</li>
</ul>
</div>
</div>

<div class="callout">“全扫描”不等于“全部故障可测”；扫描链本身、时钟域、异步控制和不可扫描存储元件仍可能降低覆盖率。</div>

<p class="small">依据：[1] §2.3.2、§2.5.1（印刷页 53–54、59–62）。</p>

<!--
用伪主输入/伪主输出解释扫描为什么能把时序问题转成组合问题。理想时序深度为 0 只描述状态访问，不消除组合逻辑内部的约束和扫描结构故障。
-->

---

# 一次扫描测试由移位、捕获和响应回收组成

<div class="flow">
<div class="flow-step">SE=1<br>移入 PPI</div>
<div class="flow-step">SE=0<br>施加 PI</div>
<div class="flow-step">捕获沿<br>PPO 进入单元</div>
<div class="flow-step">SE=1<br>移出并装入下一向量</div>
</div>

<div class="grid-2">
<div class="compare-panel">
<h3>时序要点</h3>
<ul>
<li>链长 L 决定每个向量的移位周期。</li>
<li>捕获必须使用功能时钟和确定时钟次序。</li>
<li>当前响应移出可与下一向量移入重叠。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>形式化近似</h3>
<div class="formula">T<sub>scan</sub> ≈ (N+1)L + N c<sub>capture</sub></div>
<p>N 为测试图形数；若捕获为一个周期，通常写成 (N+1)L+N。</p>
</div>
</div>

<p class="small">依据：[1] §2.5.1.1（印刷页 59–62）。</p>

<!--
按时钟周期解释三个操作。公式假设响应移出和下一向量移入重叠、链平衡、每次捕获一个周期；实际还要加初始化、控制切换和链自检。不要漏掉捕获模式选择。
-->

---

# 部分扫描用较少状态访问换取较低面积和时延

<div class="compare">
<div class="compare-panel">
<h3>部分扫描</h3>
<ul>
<li>只把一部分存储元件替换为扫描单元。</li>
<li>非扫描触发器仍需时序 ATPG 控制。</li>
<li>可以保留关键路径上的原触发器。</li>
<li>面积较小，但覆盖率与测试时间可能变差。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>结构选择</h3>
<ul>
<li>功能分区：优先扫描控制部分。</li>
<li>前馈选择：打断所有反馈环。</li>
<li>平衡选择：限制剩余时序深度。</li>
</ul>
<div class="formula">D<sub>seq</sub> ≤ D<sub>target</sub>，例如 3–5</div>
</div>
</div>

<p class="small">依据：[1] §2.5.2（印刷页 64–67）；3–5 为[1] 示例目标，不是通用常数。</p>

<!--
解释部分扫描的优化问题：选择最少的状态位打断反馈环或限制时序深度。[1] 报告某些小设计约替换 25%–50% 的触发器可达较高覆盖率，但这是历史评估语境，不能外推。
-->

---

# 随机访问扫描用地址选择单元，牺牲布线换取低切换

<div class="grid-2">
<div class="compare-panel">
<h3>传统 RAS</h3>
<ul>
<li>扫描单元组成二维阵列。</li>
<li>行列译码选择单个单元读写。</li>
<li>可只更新需要变化的位，降低平均切换。</li>
<li>地址、译码和路由开销高。</li>
</ul>
<div class="formula">地址宽度 a = ⌈log<sub>2</sub> n⌉</div>
</div>
<div class="compare-panel highlight">
<h3>扫描时间比较</h3>
<p>全扫描应用一个向量约需 L 个移位周期；RAS 访问 d 个单元可能只需约 d×a 个地址周期。</p>
<div class="formula">T<sub>RAS</sub> ≈ d(a+1) + c<sub>capture</sub></div>
<p>仅当需更新位数 d 足够小，RAS 才明显占优。</p>
</div>
</div>

<p class="small">依据：[1] §2.5.3（印刷页 67–70）；时间为简化模型，不含刷新、竞争和压缩开销。</p>

<!--
n=4096 时地址 12 位。传统 RAS 可减少切换和部分测试数据，但译码器和布线成本大。渐进 RAS 用行使能和列地址降低地址开销，但仍需比较具体访问模式。
-->

---

<!-- _class: divider -->
<!-- _header: '' -->

# 第 3 节

## 从扫描规则到可实现、可验证的设计流程

<p>45 分钟（评审估计）· 六类规则、扫描综合、成本与特殊结构</p>

<!--
进入实施层。扫描不是简单替换触发器，还要消除会在移位或捕获时破坏可预测性的结构，并用提取、验证和成本分析闭环。
-->

---

# 六类扫描规则围绕“模式切换时保持可预测”

<table>
<tr><th>类别</th><th>典型违规</th><th>为什么破坏扫描</th><th>修复原则</th></tr>
<tr><td>三态/双向 I/O</td><td>多个驱动器竞争或方向翻转</td><td>移位时出现未知值或电气冲突</td><td>移位期强制单一驱动或固定方向</td></tr>
<tr><td>门控/派生时钟</td><td>时钟不由 PI 直接控制</td><td>扫描单元不能按预期移位</td><td>移位期旁路或使能时钟</td></tr>
<tr><td>组合反馈环</td><td>无存储元件的闭环</td><td>状态不可控或振荡</td><td>断环或插入测试点</td></tr>
<tr><td>异步置位/复位</td><td>扫描中意外清零或置位</td><td>链内容被破坏</td><td>移位期置无效，捕获期按设计释放</td></tr>
<tr><td>时钟当数据</td><td>时钟经组合逻辑进入 D 端</td><td>数据和时钟同时翻转，采样不确定</td><td>在数据路径隔离或旁路</td></tr>
<tr><td>浮空/非扫描状态</td><td>浮空总线、无法初始化的触发器</td><td>传播出 X 或状态不可重复</td><td>加 keeper、初始化、旁路或透明化</td></tr>
</table>

<p class="small">依据：[1] §2.6、表 2.7（印刷页 70–76）；本页将表 2.7 归并为六类理论问题。</p>

<!--
按六类规则讲解，不逐条背工具命令。关键判据是扫描移位和捕获期间输出是否可确定、是否只有一个驱动器、时钟是否可控。修复可能降低某些逻辑的可测性，需要权衡。
-->

---

# 规则修复既保证安全移位，也必须保留捕获期可测性

<div class="grid-2">
<div class="compare-panel">
<h3>典型修复</h3>
<ul>
<li>用 SE 在移位期禁止双向缓冲器输出。</li>
<li>用测试模式旁路派生时钟。</li>
<li>用独立复位使能区分移位和捕获。</li>
<li>用 lock-up latch 跨越时钟域。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>跨时钟域捕获条件</h3>
<div class="formula">skew &lt; t<sub>data-path</sub> + t<sub>clk→Q</sub></div>
<p>条件不满足时应错开捕获时钟或采用时钟分组；仅增加仿真周期不能修复物理竞争。</p>
</div>
</div>

<div class="callout warning">用测试模式永久禁用异步复位虽然能稳定移位，却可能使复位逻辑本身不可测；更精确的做法是按移位、捕获两阶段控制。</div>

<p class="small">依据：[1] §2.6.1–§2.6.6、§2.7.1（印刷页 70–78）。</p>

<!--
解释跨时钟域捕获不等式和修复原则。任何修复都会影响覆盖率、延迟或控制复杂度；设计者必须同时验证移位和捕获，而不是只让移位通过。
-->

---

# 扫描流程从规则修复开始，以提取和验证结束

<div class="flow">
<div class="flow-step">原始设计</div>
<div class="flow-step">规则检查与修复</div>
<div class="flow-step">可测试设计</div>
<div class="flow-step">扫描综合</div>
<div class="flow-step">扫描设计</div>
<div class="flow-step">提取与验证</div>
</div>

<div class="grid-3">
<div class="metric"><strong>Repair</strong><h3>先消除违规</h3><p>RTL 或门级阶段发现三态、时钟、反馈和异步控制问题。</p></div>
<div class="metric"><strong>Synthesize</strong><h3>再组织链</h3><p>配置、替换、重排、拼接形成可执行的 scan architecture。</p></div>
<div class="metric"><strong>Verify</strong><h3>最后证明可用</h3><p>提取实际链结构，验证移位和捕获的时序行为。</p></div>
</div>

<div class="callout">流程的箭头表示依赖顺序，不表示单向流水线：规则违规会使设计回到修复步骤，扫描综合后还要复查。</div>

<p class="small">依据：[1] §2.7（印刷页 76–79）。</p>

<!--
把流程当作理论依赖图，不涉及菜单或命令。规则修复产生可测试设计；综合产生扫描设计；提取提供实际结构；验证发现零延迟模型与全时序行为的不一致。
-->

---

# 扫描综合四个步骤各自减少哪类不确定性

<div class="grid-2">
<div class="concept">
<h3>配置与替换</h3>
<ul>
<li>确定链数、单元类型、排除项和排列。</li>
<li>把普通存储元件替换为功能等价的扫描单元。</li>
<li>按时钟域、边沿、物理布局和引脚预算决定链结构。</li>
</ul>
<div class="formula">链数 m 增大 → 最大链长 L 通常减小 → 移位时间下降</div>
</div>
<div class="concept">
<h3>重排与拼接</h3>
<ul>
<li>重排减少链连线长度和拥塞。</li>
<li>跨时钟边界插入 lock-up latch。</li>
<li>把 SI/SO 接到可访问端口并保持方向确定。</li>
<li>负边沿与正边沿单元按可移位次序组织。</li>
</ul>
</div>
</div>

<div class="callout">配置决定测试时间与引脚，替换决定面积与时延，重排决定布线，拼接决定链的正确连接；四者不能互相替代。</div>

<p class="small">依据：[1] §2.7.2（印刷页 79–83）。</p>

<!--
四个步骤是设计决策而不是操作按钮。说明链数、链长、时钟域和布局之间的耦合。锁存器跨越时钟域不是可选装饰，而是保证移位正确的时序条件。
-->

---

# 提取与验证要分别检查“链连接”和“周期行为”

<div class="compare">
<div class="compare-panel">
<h3>扫描提取</h3>
<p>在移位模式下追踪每个扫描单元实例，确认从 SI 到 SO 的实际连接和链顺序。</p>
<div class="formula">结构正确：SI → SFF<sub>1</sub> → … → SFF<sub>L</sub> → SO</div>
</div>
<div class="compare-panel highlight">
<h3>扫描验证</h3>
<ul>
<li>移位验证：flush pattern 逐拍穿过链。</li>
<li>捕获验证：比对零延迟预测与全时序响应。</li>
<li>发现 hold、setup、时钟域和初始化错误。</li>
</ul>
<div class="formula">01100 覆盖 0→1、1→1、1→0、0→0 四类相邻关系</div>
</div>
</div>

<div class="callout">长度为 L 的链，flush 模式应在第 L 个移位周期后按预期到达输出；提前到达可能提示 hold-time 或连接错误。</div>

<p class="small">依据：[1] §2.7.3–§2.7.4.2（印刷页 83–86）。</p>

<!--
区分提取和验证。提取确认拓扑，验证确认物理时序。flush pattern 的长度与链长匹配；01100 只是典型模式，实际还要覆盖各单元跳变。捕获验证需关注跨时钟域。
-->

---

# 扫描成本必须按单元、布线、引脚、时延和开发工作共同报告

<div class="grid-2">
<div class="compare-panel">
<h3>面积与引脚</h3>
<div class="formula">ΔA/A<sub>0</sub> = (A<sub>scan</sub> − A<sub>orig</sub>) / A<sub>orig</sub></div>
<p>扫描单元、额外触发器、lock-up latch、SE 和时钟布线都会增加面积；多链通常增加 SI/SO 资源。</p>
</div>
<div class="compare-panel highlight">
<h3>测试时间</h3>
<div class="formula">T<sub>clk</sub> ≈ (N+1)L + N</div>
<p>N 个图形、单捕获周期、响应移出与下一图形移入重叠。时钟频率决定实际秒数。</p>
</div>
</div>

<div class="formula"><span class="formula-label">引脚共享后的吞吐近似</span>R<sub>test</sub> ≈ B/(T<sub>handling</sub> + T<sub>clk</sub>f<sub>clock</sub><sup>−1</sup>)</div>

<p class="small">B 为并行测试工位数；该式忽略同步、功耗降频和工位失配。</p>

<p class="small">依据：[1] §2.7.4–§2.7.5（印刷页 85–87）。</p>

<!--
把成本分成面积、引脚、性能、设计工作。公式是教学模型，必须注明并行工位、时钟周期和链平衡假设。测试时间降低可能以更多扫描引脚和更高并行切换为代价。
-->

---

<!-- _class: dense -->

# 完整成本例题：20000 位状态、1000 个图形与不同链数

<div class="grid-2">
<div class="compare-panel">
<h3>扫描时间</h3>
<p>取 20 条平衡链，L=1000；10 条链，L=2000；单链，L=20000。</p>
<div class="formula">20 链：(1001)×1000+1000 = 1,002,000 周期<br>10 链：(1001)×2000+1000 = 2,003,000 周期<br>1 链：(1001)×20000+1000 = 20,021,000 周期</div>
<p>在 100 MHz 下分别约为 10.02 ms、20.03 ms、200.21 ms。</p>
</div>
<div class="compare-panel highlight">
<h3>面积示例</h3>
<p>原始组合逻辑 C=200000 等效门；M=10000 个触发器按 10 门计；8000 个 MUX-D 单元每个增加 4 门。</p>
<div class="formula">ΔA/A<sub>0</sub> = 32000/(200000+100000) ≈ 10.67%</div>
<p>尚未计入布线、锁存器、扫描控制和时钟树。</p>
</div>
</div>

<p class="small">更多链缩短时间但增加端口与切换；数值为教学算例，不是特定工艺参数。</p>

<!--
完整展示链数如何改变扫描时间，并用面积公式说明单元成本。20 链与 10 链比较可引出并行资源上限。不要把教学门当量当作流片面积结论。
-->

---

# Enhanced scan 用额外保持锁存器应用任意向量对

<div class="compare">
<div class="compare-panel">
<h3>结构与时序</h3>
<ul>
<li>普通扫描单元后再加一个扫描保持锁存器。</li>
<li>先移入 V1，再保存到保持锁存器。</li>
<li>移入 V2，保持锁存器仍保存 V1。</li>
<li>在速度下从 V1 切换到 V2 并捕获响应。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>收益与代价</h3>
<ul>
<li>可应用任意向量对，提高延迟故障覆盖。</li>
<li>每个单元增加锁存器，面积和时序控制复杂。</li>
<li>可能激活功能中不会出现的伪路径，造成过测试。</li>
</ul>
</div>
</div>

<div class="formula"><span class="formula-label">延迟测试条件</span>V1 初始化路径，V2 在功能时钟周期内传播跳变，捕获边沿记录是否按时到达</div>

<p class="small">依据：[1] §2.8.1（印刷页 87–88）。</p>

<!--
解释任意向量对与常规 launch-on-shift/launch-on-capture 的差别。Enhanced scan 的额外保持能力是优势，也是过测试的来源；成本包括锁存器和 UPDATE/CK 时序。
-->

---

# Snapshot scan 记录运行状态，Error-resilient scan 保护运行状态

<div class="compare">
<div class="compare-panel">
<h3>Snapshot scan</h3>
<ul>
<li>影子扫描单元可在不打断功能的情况下捕获状态。</li>
<li>可把内部状态移位出来用于调试、诊断和失败分析。</li>
<li>也可把测试数据并行装入系统锁存器。</li>
<li>主要代价是额外存储、时钟和面积。</li>
</ul>
</div>
<div class="compare-panel highlight">
<h3>Error-resilient scan</h3>
<ul>
<li>系统触发器与影子扫描部分并行保存状态。</li>
<li>软错误使两路不一致时，C-element 保持先前正确值。</li>
<li>测试模式下仍可移位和捕获。</li>
<li>代价是更多控制信号、时钟和面积。</li>
</ul>
</div>
</div>

<div class="callout warning">Snapshot 解决诊断可见性，Error-resilient scan 解决在线软错误保护；二者都不是单纯提高固定型覆盖率的扫描变体。</div>

<p class="small">依据：[1] §2.8.2–§2.8.3（印刷页 88–92）。</p>

<!--
区分三种特殊扫描的目标：Enhanced 解决任意向量对，Snapshot 解决运行状态可见性，Error-resilient 解决软错误。C-element 在两输入不一致时保持旧值，这是动态保护机制。
-->

---

# RTL DFT 把修复前移，减少综合环路并形成可复用测试核

<div class="compare">
<div class="compare-panel">
<h3>门级修复回路</h3>
<div class="flow">
<div class="flow-step">RTL</div>
<div class="flow-step">综合</div>
<div class="flow-step">发现 DFT 违规</div>
<div class="flow-step">修改并重新综合</div>
</div>
<p>每次修复都要重新承担综合时间和优化扰动。</p>
</div>
<div class="compare-panel highlight">
<h3>RTL 修复</h3>
<div class="flow">
<div class="flow-step">RTL</div>
<div class="flow-step">规则/可测性修复</div>
<div class="flow-step">逻辑/扫描综合</div>
<div class="flow-step">扫描设计</div>
</div>
<p>快速综合推断寄存器与时钟域，可在早期修复派生时钟、控制和可测性问题。</p>
</div>
</div>

<div class="callout">RTL scan synthesis 插入扫描等价结构；pseudo RTL scan synthesis 只声明 PPI/PPO 和链边界，便于后续集成 BIST、压缩和边界扫描。</div>

<p class="small">依据：[1] §2.9（印刷页 92–95）。</p>

<!--
说明 RTL DFT 的动机：减少重复综合、形成可复用核、提前集成高级测试结构。RTL 规则检查依赖快速综合和寄存器推断，不是跳过门级验证。
-->

---

# 全章结论：扫描把状态访问问题转化为结构设计问题

<ul class="takeaways">
<li>SCOAP、概率、模拟和 RTL 度量从不同抽象层预测控制与观察难度，均有假设边界。</li>
<li>测试点改善局部节点；MUX-D、Clocked-scan 和 LSSD 把状态组织成可移位访问路径。</li>
<li>全扫描换取组合 ATPG 复用，部分扫描保留面积优势，随机访问扫描换取低切换。</li>
<li>六类扫描规则、规则修复、提取和移位/捕获验证共同保证扫描结构可预测。</li>
<li>Enhanced、Snapshot 与 Error-resilient scan 针对延迟、调试和软错误，不能用一个覆盖率指标概括。</li>
</ul>

<div class="callout question">最终判断：一个扫描方案是否合格，应同时回答覆盖率、链和时钟是否正确、测试时间多少、面积与时延增加多少。</div>

<p class="small">依据：[1] 第 2 章 §2.1–§2.9（印刷页 37–95）。</p>

<!--
回收度量、结构、规则、验证和成本五层。最后的口头问题把全章评价链收束到四个证据维度。扫描不是“插入即完成”，而是需要结构正确、时序可预测和经济可接受。
-->

---

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

<p class="small">文中 [1] 的章、节和印刷页码均指上述文献。</p>
