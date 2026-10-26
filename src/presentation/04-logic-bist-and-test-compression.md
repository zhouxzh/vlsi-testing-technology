---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 4 章 · 逻辑内建自测试与测试压缩'
---

<!-- _class: lead -->

# 逻辑内建自测试与测试压缩

## 怎样把“生成、捕获、判定、传输”变成片上闭环

超大规模集成电路测试基础 · 第 4 章

<div class="source">理论依据：VLSI Test Principles and Architectures，第 5、6 章（[1] 印刷页 263–396）</div>

<!-- 讲师备注：先给出片上闭环，再指出伪随机覆盖难点、响应混叠和测试带宽三个限制。 -->

---

# 中心问题：测试能力能移动多少到芯片内部

<div class="flow">
<div class="flow-step">生成测试图形</div>
<div class="flow-step">施加并捕获</div>
<div class="flow-step">压缩响应</div>
<div class="flow-step">比较签名或回传</div>
</div>

<div class="agenda-grid">
<div class="agenda-item">
<h3>第 1 节 · 45 分钟（教学容量估计）</h3>
<p>BIST 分类、规则、未知源阻断，以及穷举、伪随机、加权和伪穷举生成。</p>
</div>
<div class="agenda-item">
<h3>第 2 节 · 45 分钟（教学容量估计）</h3>
<p>计数与签名分析、混叠、STUMPS、BILBO、CSTP 和覆盖增强。</p>
</div>
<div class="agenda-item">
<h3>第 3 节 · 45 分钟（教学容量估计）</h3>
<p>单/偏斜/双捕获、At-speed 多时钟控制、测试刺激与响应压缩。</p>
</div>
</div>

<div class="callout question">核心权衡：减少外部测试数据与测试时间，是否会以覆盖损失、面积、时序扰动或诊断能力下降为代价？</div>

<div class="source">[1] 第 5 章 §5.1、§5.5–§5.7，第 6 章 §6.1（印刷页 263–266、296–319、341–344）</div>

<!-- 讲师备注：让学生先记住闭环而不是缩写字面；后续每个方法都落在这个闭环的某一环。 -->

---

<!-- _class: divider -->

# 第 1 节

## BIST 规则与测试图形生成

本节目标：先确保未知值不会破坏判定，再选择能平衡覆盖率和测试长度的生成器。

<div class="source">[1] 第 5 章 §5.1–§5.3（印刷页 263–290）</div>

<!-- 讲师备注：设计规则不是附属内容；未知值可在签名分析前就把 BIST 判定变成无效。 -->

---

# BIST 是测试功能的片上或板级内嵌，不等于某一种生成器

<div class="truth-table">

| 分类维度 | 形式 | 判定含义 |
|---|---|---|
| 运行阶段 | 在线 / 离线 | 正常工作中检查，或退出正常功能后自测 |
| 在线方式 | 并发 / 非并发 | 与功能同时进行，或利用空闲窗口 |
| 离线对象 | 功能 / 结构 | 按规格功能，或按结构故障模型 |
| 硬件位置 | 外部 / 内部 | 测试电路在 CUT 外，或复用片内存储元件 |

</div>

<div class="formula">
<span class="formula-label">典型结构闭环</span>
TPG → CUT → ORA → 与黄金签名比较 → pass/fail
</div>

控制器协调 scan enable、测试时钟、种子装载、捕获窗口和签名比较。BIST 的收益不仅是少存测试数据，还包括可以在系统内周期性运行；代价是额外硬件、规则约束和潜在覆盖缺口。

<div class="source">[1] 第 5 章 §5.1（印刷页 263–266）</div>

<!-- 讲师备注：强调“在线”和“离线”看功能状态，不看是否在晶圆厂使用；内部/外部看硬件位置。 -->

---

<!-- _class: dense -->

# 未知值是逻辑 BIST 的第一道硬约束

`X` 一旦进入 ORA，就会污染签名；这不同于普通扫描测试中仅仅降低覆盖。常见来源包括模拟块与存储器、非扫描寄存器、组合反馈、异步置位/复位、三态竞争、伪/多周期路径、悬空端口及未初始化状态。

<div class="callout warning">
BIST-ready core 不仅要满足扫描规则，还必须保证测试期间 TPG、CUT、ORA 都能进入已知状态，且不存在可将 `X` 传到 ORA 的路径。
</div>

<div class="formula">
<span class="formula-label">规则目标</span>
∀ 测试周期 t：X(CUT(t)) ∩ ORA 输入 = ∅
</div>

<div class="source">[1] 第 5 章 §5.2（印刷页 266–267）</div>

<!-- 讲师备注：把 X 规则表述成集合条件；强调一个未知位可能不是覆盖降低，而是整个签名不可用。 -->

---

# X-bounding 在未知源与 ORA 之间建立可控边界

<div class="grid-3">
<div class="metric"><strong>0/1 控制点</strong><p>测试时强制源输出为常数；简单但可能损失对该源内部故障的观察。</p></div>
<div class="metric"><strong>旁路选择</strong><p>用 MUX 选择功能值或已知测试值，适合存储器和非扫描寄存器。</p></div>
<div class="metric"><strong>扫描点</strong><p>捕获并移位未知源，或驱动 0/1；面积与时序代价较高但更灵活。</p></div>
</div>

<div class="formula">
<span class="formula-label">选择原则</span>
优先阻断离 ORA 最近且覆盖面最大的 X 源；必要时在其前增加观察点
</div>

组合反馈应以控制点、旁路或扫描点打断；异步置位/复位需要避免移位期间误触发；三态总线必须保证任一时刻至多一个驱动器有效；双向端口在自测期间固定方向。

关键路径上不宜插入普通逻辑，可采用内嵌控制点；伪路径与多周期路径应被约束，避免 At-speed 响应出现假失配。

<div class="source">[1] 第 5 章 §5.2.1（印刷页 267–271）</div>

<!-- 讲师备注：讲清“阻断 X”与“观察故障”的冲突；这就是后续为何可能需要额外观察点。 -->

---

# BIST 时序还需要可重定时、可初始化、可控制的边界

<div class="compare">
<div class="compare-panel">
<h3>重定时</h3>
<p>在 TPG→CUT 和 CUT→ORA 之间插入边沿流水寄存器，隔离远距离布线与时钟偏斜。</p>
</div>
<div class="compare-panel highlight">
<h3>端口与状态</h3>
<p>悬空端口必须接到合法电平；双向端口固定方向；所有测试寄存器先复位或装载已知种子。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">BIST 时间近似</span>
T<sub>BIST</sub> ≈ N<sub>patterns</sub> × (L<sub>scan</sub> + C<sub>capture</sub>) / f<sub>test</sub>
</div>

这里 `L_scan` 是最长扫描链长度，`C_capture` 是每次扫描后的捕获周期数。该式只描述主导项；控制器开销、签名读出和多时钟等待都会增加实际时间。

<div class="callout question">若扫描链长度减半，测试数据带宽与测试时间是否必然同时减半？</div>

<div class="source">[1] 第 5 章 §5.2.2（印刷页 271）</div>

<!-- 讲师备注：提醒公式是容量模型，不是板级测量；扫描链数、通道数、时钟频率和捕获方案共同决定时间。 -->

---

# 测试图形生成器要在“覆盖保证”和“序列长度”之间取舍

<div class="truth-table">

| 生成方式 | 大致规模 | 覆盖特征 |
|---|---:|---|
| 穷举 | `2ⁿ` | 全部可测组合故障 |
| 最大长 LFSR | `2ⁿ−1` 非零状态 | 近似均匀伪随机 |
| 加权 LFSR | 可配置 | 提高难控制节点命中率 |
| 伪穷举 | 取决于输出锥 | 保留单固定型覆盖 |
| 单元自动机 | `2ⁿ−1` 最大长 | 局部连接、相关性较低 |

</div>

穷举计数器和完整 LFSR 都能生成所有 n 位组合；完整 LFSR 通过额外逻辑插入全零状态。若输入数很大，穷举长度不可接受，因此需要利用电路锥结构或偏置概率。

<div class="source">[1] 第 5 章 §5.3–§5.3.1（印刷页 271–277）</div>

<!-- 讲师备注：只讲规模量级与覆盖含义；强调“伪随机”不等于不可重复，种子确定则序列可重现。 -->

---

# 完整例题：四阶 LFSR 的特征多项式与最大周期

取特征多项式：

<div class="formula">
f(x) = 1 + x + x<sup>4</sup>
</div>

从种子 `0001` 出发，一种阶段显示顺序得到：

```text
0001 → 1100 → 0110 → 0011 → 1101
  ↓
1010 → 0101 → 1110 → 0111 → 1111
  ↓
1011 → 1001 → 1000 → 0100 → 0010 → 0001
```

周期为 `2⁴−1=15`，即遍历除 `0000` 外的全部状态。若 `T` 是使 `f(x)` 整除 `1+xᵀ` 的最小正整数，则最大长 LFSR 满足 `T=2ⁿ−1`；等价的 `f(x)` 是本原多项式。

<div class="callout warning">同样的状态数不保证同样的随机质量；抽头、相位相关和具体被测电路共同决定故障覆盖。</div>

<div class="source">[1] 第 5 章 §5.3、图 5.12（印刷页 272–274）</div>

<!-- 讲师备注：以 15 状态环为例说明周期；不在课堂手算所有多项式代数，只要求会读序列和判断最大长。 -->

---

# 伪随机长度可估计，但加权与局部连接可改善难测故障

<div class="formula">
<span class="formula-label">最难故障约束</span>
N ≥ ⌈log(1−p) / log(1−d<sub>min</sub>)⌉
</div>

若最难故障单向量检测概率 `d_min=10⁻⁴`，要求至少检测一次的概率 `p=0.99`，则 `N≥46,050`。均匀 LFSR 对 5 输入 OR 输出 `SA1` 需要全零，概率仅 `2⁻⁵=1/32`。

<div class="grid-2">
<div class="concept">
<h3>加权 / 可编程权重</h3>
<p>把 0 的概率从 0.5 调到 0.75，会使五输入 OR 的全零概率升到 `0.75⁵≈0.237`。</p>
</div>
<div class="concept">
<h3>单元自动机</h3>
<p>规则 90：`xᵢ(t+1)=xᵢ₋₁⊕xᵢ₊₁`；规则 150 再加入自身项，局部连接可降低移位相关。</p>
</div>
</div>

权重可以按故障需求分组切换，但过多权重组会增加控制与测试时间。CA 的相邻连接有利于布局，但其最大长构型必须按长度选择。

<div class="source">[1] 第 5 章 §5.3.2（印刷页 277–281）</div>

<!-- 讲师备注：先计算均匀分布的难测概率，再说明偏置为什么有效；权重不是任意偏置，需要生成器支持。 -->

---

<!-- _class: dense -->

# 伪穷举利用输出锥，避免对所有输入做完整穷举

对 `(n,w)` 组合电路，任一输出最多依赖 `w<n` 个输入。按输出锥分别穷举，向量规模上界可写成各锥规模之和：

<div class="formula">
|T<sub>pseudo-exhaustive</sub>| ≤ Σ<sub>i=1</sub><sup>m</sup> 2<sup>n<sub>i</sub></sup>
</div>

若三个输出锥分别依赖 `n₁=8,n₂=10,n₃=12` 个输入，则朴素上界为：

<div class="formula">
2⁸ + 2¹⁰ + 2¹² = 256 + 1024 + 4096 = 5376
</div>

这远小于 `2²⁰=1,048,576`，且可并发测试各个锥。SDC、常量权重、组合 LFSR/SR、condensed/cyclic LFSR 是不同实现路径；当某输出依赖全部输入时，可用硬件分段或敏化分段，但最优划分本身很难。

<div class="callout">伪穷举保证的是锥内组合故障覆盖，不自动覆盖跨锥交互、时序状态或延迟故障。</div>

<div class="callout question">如果某设计 80% 的输出只依赖 10 个输入，而剩余 20% 依赖 60 个输入，单纯增加 LFSR 长度是否是最合理的覆盖策略？</div>

<div class="source">[1] 第 5 章 §5.3.3、§5.3.5（印刷页 281–290）</div>

<!-- 讲师备注：用上界比较展示收益；以末尾问题收束“规模、覆盖保证、结构”三重取舍。 -->

---

<!-- _class: divider -->

# 第 2 节

## 响应分析、混叠与逻辑 BIST 架构

本节目标：把长响应变成可比较的签名，并说明不同架构如何复用以扫描链为中心的存储资源。

<div class="source">[1] 第 5 章 §5.4–§5.6（印刷页 290–309）</div>

<!-- 讲师备注：回扣闭环的 ORA 与控制器；所有压缩方法都要说明损失了什么信息。 -->

---

<!-- _class: dense -->

# 计数签名用极小状态概括响应，但会丢弃位置信息

**一计数**只数响应流中 1 的个数；**跳变计数**数相邻位发生 `0↔1` 的次数。

完整例题：`R₀=0101100` 得 `OC=3,TC=4`；`R₁=1100110` 得 `OC=4,TC=4`；`R₂=0101010` 得 `OC=3,TC=6`。故 `R₁` 只被一计数发现，`R₂` 只被跳变计数发现。

<div class="formula">
P<sub>OC</sub>(m) = (C(L,m)−1)/(2<sup>L</sup>−1)<br>
P<sub>TC</sub>(m) = (2C(L−1,m)−1)/(2<sup>L</sup>−1)
</div>

当 `L=7,m=3` 时，`P_OC=34/127≈26.8%`；当 `m=4` 时，`P_TC=29/127≈22.8%`。

<div class="source">[1] 第 5 章 §5.4.1–§5.4.2（印刷页 290–292）</div>

<!-- 讲师备注：逐位板书两种签名的计算，再区分无故障/故障响应和混叠；概率值是均匀错误序列假设下的模型。 -->

---

<!-- _class: dense -->

# SISR 把响应多项式除以特征多项式，余式就是签名

单输入签名寄存器在 LFSR 输入处加入响应流。设响应多项式为 `M(x)`、特征多项式为 `f(x)`：

<div class="formula">
M(x) = q(x)f(x) + r(x)
</div>

最终寄存器内容就是余式 `r(x)`。完整例题取 `f(x)=1+x+x⁴`、`M=10011011`：

<div class="formula">
M(x)=1+x³+x⁴+x⁶+x⁷<br>
q(x)=x²+x³，r(x)=1+x²+x³
</div>

按显示顺序 `r₀r₁r₂r₃` 写出签名：

<div class="formula">
1011
</div>

若故障响应为 `M'=11001011`，则 `r'(x)=1+x+x²`，签名为 `1110`，与无故障签名不同。错误多项式 `E=M⊕M'` 能被 `f` 整除时，两个响应可能落到同一余式。

<div class="source">[1] 第 5 章 §5.4.3.1（印刷页 292–294）</div>

<!-- 讲师备注：明确位序约定，避免 1011 与 1101 混淆；混叠条件是错误多项式被特征多项式整除。 -->

---

<!-- _class: dense -->

# MISR 并行压缩多路输出，并以位数控制混叠量级

MISR 对 n 条响应流同时注入一个 n 阶线性寄存器。四阶响应序列为 `M0=10010`、`M1=01010`、`M2=11000`、`M3=10011`。可用如下有效输入多项式合并多路：

<div class="formula">
M(x)=M₀(x)+xM₁(x)+x²M₂(x)+x³M₃(x)
</div>

得到有效序列 `M=10011011`，再对 `f(x)=1+x+x⁴` 求余，签名仍为 `1011`。

<div class="formula">
P<sub>PSA</sub>(n) = (2<sup>mL−n</sup>−1)/(2<sup>mL</sup>−1) ≈ 2<sup>−n</sup>（L≫n）
</div>

20 阶 MISR 的混叠量级约 `2⁻²⁰<10⁻⁵`，但它仍可能被结构性错误模式击中；位数增加降低概率，不提供零混叠保证。

<div class="source">[1] 第 5 章 §5.4.3.2（印刷页 294–295）</div>

<!-- 讲师备注：把多路输入合并成一条有效序列是理解 MISR 的关键；概率假设要讲清，不能当作实测保证。 -->

---

# STUMPS 连接 PRPG、扫描链与 MISR

<div class="flow">
<div class="flow-step">PRPG 并行生成</div>
<div class="flow-step">装载多条扫描链</div>
<div class="flow-step">CUT 捕获响应</div>
<div class="flow-step">MISR 压缩并重叠下一次装载</div>
</div>

- PRPG 同时驱动多条短扫描链，缩短每次 pattern 的移位深度。
- 捕获后，响应移位到 MISR；下一 pattern 也可同时装入扫描链。
- 可选相位移动器和相位压缩器减少 PRPG/MISR 两端的相关性。
- 控制信号安排移位、捕获和签名读出；时钟域边界需要冻结或隔离。

STUMPS 的主要优势是复用常规扫描结构，因此成为工业逻辑 BIST 的典型基础。它不自动解决随机难测故障、未知值和多时钟 At-speed 时序，这些问题仍需规则与附加结构。

<div class="source">[1] 第 5 章 §5.5.2（印刷页 297–298）</div>

<!-- 讲师备注：强调 test-per-scan 与 test-per-clock 的节奏差异；STUMPS 是架构骨架，不是覆盖率保证。 -->

---

# BILBO 系列把功能寄存器重构成生成器或签名分析器

<div class="grid-3">
<div class="metric"><strong>BILBO</strong><p>正常、扫描、TPG/MISR、复位模式；相邻模块的生成和分析可能互相牵制。</p></div>
<div class="metric"><strong>MBILBO</strong><p>增加控制输入分离 TPG 与签名分析，改善流水模块测试。</p></div>
<div class="metric"><strong>CBILBO</strong><p>用双存储元件同时做 TPG 与 MISR，可接穷举/伪穷举生成器，硬件代价更高。</p></div>
</div>

<div class="formula">
<span class="formula-label">BILBO 模式示例</span>
B₁B₂ = 11：正常；00：扫描<br>
10：伪随机生成或 MISR；01：复位
</div>

对流水线电路，若前级签名必须作为后级图形，生成与分析会耦合；CBILBO 把两条路径拆开后可降低这一约束。选择时要比较额外寄存器、控制线、覆盖增强和时序影响。

<div class="source">[1] 第 5 章 §5.5.3（印刷页 298–302）</div>

<!-- 讲师备注：用模式表讲 BILBO；区分 MBILBO 的控制分离与 CBILBO 的硬件双存储。 -->

---

# CSTP 硬件最省，但闭环结构与覆盖之间需要谨慎权衡

CSTP 把主输入、内部扫描单元和主输出重构成一条循环路径。若环上有 n 个单元，其特征结构可看成：

<div class="formula">
f(x)=1+x<sup>n</sup>
</div>

自测时输入边移位、内部与输出边压缩，响应在若干周期后读出比较。优点是额外硬件和控制较少；缺点是循环反馈会产生相关序列，并可能降低故障覆盖。所有寄存器必须先进入已知状态。

<div class="truth-table">

| 架构 | 生成器/分析器 | 节奏 | 主要边界 |
|---|---|---|---|
| STUMPS | PRPG / MISR | test-per-scan | 随机覆盖、X、扫描时序 |
| BILBO | 可重构寄存器 | test-per-clock | TPG/MISR 模式耦合 |
| CBILBO | 双存储 | test-per-clock | 面积与布线开销 |
| CSTP | 循环自测路径 | test-per-clock | 相关性导致覆盖不足 |

</div>

<div class="source">[1] 第 5 章 §5.5.3.4–§5.5.5（印刷页 302–304）</div>

<!-- 讲师备注：对比表中只保留决定架构选择的差异；CSTP 不是“更省硬件且同等覆盖”的免费替代。 -->

---

<!-- _class: dense -->

# 测试点与混合模式用于弥补伪随机的结构性盲点

伪随机覆盖率受 random-pattern-resistant 故障限制。控制点提高激励概率，观察点提高传播概率：

<div class="formula">
<span class="formula-label">六输入 AND 的 SA0 示例</span>
无测试点时 d = 2<sup>−6</sup> = 1/64<br>
插入分段控制与观察点后，某难测故障 d = 7/128
</div>

控制点可随机、分阶段或按图形确定激活；放置需权衡重汇聚、面积与时序。

<div class="grid-2">
<div class="concept">
<h3>混合模式 BIST</h3>
<p>片上伪随机图形之后，再用片内 ROM、LFSR 重播种或位翻转嵌入确定性图形。</p>
</div>
<div class="concept">
<h3>混合 BIST</h3>
<p>制造测试时，由外部测试设备补入针对剩余难测故障的确定性图形。</p>
</div>
</div>

<div class="callout question">若最终只保留 20 位签名，设计者还能从失败 BIST 结果中恢复哪些诊断信息？还需要额外保存什么？</div>

<div class="source">[1] 第 5 章 §5.4–§5.6（印刷页 290–309）</div>

<!-- 讲师备注：用 1/64→7/128 说明概率改善不是单调“加逻辑就 100%”；末尾问题把 ORA 信息损失引向诊断。 -->

---

<!-- _class: divider -->

# 第 3 节

## At-speed 捕获与测试压缩

本节目标：在正确时钟窗口捕获延迟响应，并降低测试刺激与响应跨越测试通道传输的数据量。

<div class="source">[1] 第 5 章 §5.7，第 6 章 §6.1–§6.3（印刷页 310–376）</div>

<!-- 讲师备注：先区分捕获时钟决定“测什么”，压缩决定“传多少”；二者不能互相替代。 -->

---

# At-speed BIST 取决于捕获窗口

<div class="formula">
<span class="formula-label">延迟判定</span>
路径传播时间 T<sub>path</sub> ≤ T<sub>capture</sub>
</div>

- 单捕获只施加一个捕获脉冲，适合慢速结构测试。
- 偏斜装载用最后一次移位脉冲发射跳变，再由紧随的捕获脉冲观察。
- 双捕获连续施加两个捕获脉冲，用第一沿发射、第二沿捕获。
- 一拍“one-hot”各域轮流测试；对齐方案共享参考边沿；错开方案允许域间有可调间隔。

时钟方案决定能覆盖域内还是域间、结构还是延迟故障，也决定扫描使能是否需要 At-speed 切换。

<div class="source">[1] 第 5 章 §5.7（印刷页 310）</div>

<!-- 讲师备注：用路径时间与捕获周期建立判定；指出错误捕获窗口会让延迟故障“被漏测”。 -->

---

# 单捕获结构简单，但主要覆盖慢速结构故障

<div class="compare">
<div class="compare-panel">
<h3>One-hot 单捕获</h3>
<p>每个捕获窗口只让一个时钟域产生一个脉冲；可低速测试同步和异步域。</p>
</div>
<div class="compare-panel highlight">
<h3>Staggered 单捕获</h3>
<p>各域脉冲按顺序错开；可覆盖域内和部分域间结构故障，并缩短总测试时间。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">慢速条件</span>
T<sub>capture</sub> ≫ T<sub>path</sub>
</div>

单捕获可用于发现固定型、桥接和部分结构问题，但不能证明路径在功能频率下仍然正确。它的优势是控制简单、风险较低；不足是 At-speed 延迟覆盖有限。

<div class="callout question">一个向量在慢时钟通过，为什么不能据此推断它在目标频率也通过？</div>

<div class="source">[1] 第 5 章 §5.7.1（印刷页 310–311）</div>

<!-- 讲师备注：从“捕获周期远大于路径延迟”直接解释盲区，不涉及板级测量。 -->

---

# 偏斜装载用最后两次移位形成脉冲，支持域内延迟测试

最后一个移位脉冲 `S` 与立即到来的捕获脉冲 `C` 以测试频率相邻：

<div class="flow">
<div class="flow-step">前一组扫描值</div>
<div class="flow-step">最后移位发射</div>
<div class="flow-step">功能频率捕获</div>
<div class="flow-step">比较响应签名</div>
</div>

- `one-hot skewed-load` 逐域测试，能测域内延迟，但不能测域间延迟。
- `capture aligned` 对齐所有捕获边沿，可测同步域内与域间延迟，但需要共同参考时钟。
- `launch aligned` 对齐最后一次移位边沿，控制更复杂。
- `staggered skewed-load` 用域间间隔 d₃ 消除偏斜交互，能测异步域的域内延迟和域间结构故障。

主要限制是扫描使能必须在单周期内从移位切换到捕获，增加控制和时序压力。

<div class="source">[1] 第 5 章 §5.7.2（印刷页 311–315）</div>

<!-- 讲师备注：比较三种对齐方式时只围绕可测故障类型和物理边沿要求，不背时序图细节。 -->

---

# 双捕获用两次功能频率捕获，适合复杂时钟域

<div class="formula">
<span class="formula-label">双捕获序列</span>
Shift → C₁（发射） → T<sub>period</sub> → C₂（捕获）
</div>

- `one-hot double-capture`：逐域连续两沿，能测同步/异步域的域内延迟，GSE 可保持慢速。
- `aligned double-capture`：对齐各域捕获边沿，覆盖同步域内和域间延迟，但精确对齐困难。
- `staggered double-capture`：各域两沿成对、域间可错开，用单一慢速 GSE 支持异步域测试。

双捕获通常比偏斜装载更容易与常规扫描集成，因为扫描使能不需要 At-speed 翻转。它仍需正确处理启动脉冲、捕获脉冲和域间间隔。

<div class="source">[1] 第 5 章 §5.7.3（印刷页 315–317）</div>

<!-- 讲师备注：把“两个功能沿”作为共同骨架；三种变体的差别在域间是否同时、如何错开。 -->

---

# 选择捕获方案时必须同时看故障类型、同步关系与测试时间

<div class="truth-table">

| 方案 | 域内结构 | 域内延迟 | 域间结构 | 域间延迟 | 异步域 |
|---|---:|---:|---:|---:|---:|
| One-hot 单捕获 | 是 | 否 | 是 | 否 | 是 |
| Staggered 单捕获 | 是 | 否 | 是 | 是（最佳） | 是 |
| One-hot skewed | 是 | 是 | 是 | 否 | 是 |
| Staggered double | 是 | 是 | 是 | 否 | 是 |
| Aligned skewed/double | 是 | 是 | 是 | 是 | 否 |

</div>

设计顺序通常是先以对齐或同时方案覆盖多数同步域故障，再用 one-hot/错开方案补剩余难测故障。任何方案都需要控制测试功率、无效状态与 X 的产生。

<div class="callout warning">“更高覆盖”不是唯一目标：精确对齐、扫描使能频率、峰值功耗和多域同时翻转都可能让方案不可实现。</div>

<div class="source">[1] 第 5 章 §5.7.4（印刷页 317–319）</div>

<!-- 讲师备注：表格是理论能力比较；实现可行性与设计时钟结构仍需在实际约束下验证。 -->

---

# 测试压缩是确定性测试集的片上传输压缩

<div class="compare">
<div class="compare-panel">
<h3>测试压缩</h3>
<p>ATE 存压缩数据，片上解压为确定性测试图形；CUT 收到的 care bits 与原测试集一致。</p>
</div>
<div class="compare-panel highlight">
<h3>BIST / 混合 BIST</h3>
<p>大量图形由片上伪随机生成；混合 BIST 再补少量确定性图形。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">测试数据带宽</span>
BW = N<sub>channels</sub> × f<sub>tester</sub><br>
T<sub>transfer</sub> ≈ Data<sub>tester</sub> / BW
</div>

例：16 通道、100 MHz，理论带宽 `1.6 Gb/s`；传输 `160 Mb` 数据至少约 `0.1 s`。片上压缩降低 `Data_tester`，也可能通过增加扫描链数进一步降低周期数。

<div class="source">[1] 第 6 章 §6.1（印刷页 341–344）</div>

<!-- 讲师备注：公式是峰值带宽模型；压缩减少存储和传输，不等同于减少片上扫描移位时间。 -->

---

# 测试立方体中的大量 don't-care 是刺激压缩的来源

ATPG 产生测试立方体 `Z`，只在 care bits 上有固定值；随机填充会产生完全指定向量，降低可压缩性。

<div class="formula">
<span class="formula-label">无损于覆盖</span>
解码后 Ẑ 满足：∀ i，Z[i]≠X ⇒ Ẑ[i]=Z[i]
</div>

三类刺激压缩：

<div class="grid-3">
<div class="metric"><strong>编码</strong><p>字典、Huffman、游程、Golomb 等把符号序列变短。</p></div>
<div class="metric"><strong>线性解压</strong><p>LFSR/XOR 网络用较少自由变量生成 care bits。</p></div>
<div class="metric"><strong>广播</strong><p>多个扫描链共享通道；Illinois scan 在必要时切回串行模式。</p></div>
</div>

<div class="source">[1] 第 6 章 §6.2（印刷页 344）</div>

<!-- 讲师备注：强调刺激压缩必须保留 care bits；don't-care 位可任意填充也是后续线性方程的数量来源。 -->

---

<!-- _class: dense -->

# 完整例题：Golomb 游程编码把 43 位压到 32 位

取组大小 `m=4`。组 `A_k` 的前缀为 `k−1` 个 1 后接一个 0，尾部用 2 位表示组内偏移。

原始游程序列：`001 00001 0001 00001 00001 0000 01 001 00000001 00 01`

九个零游程长度为 `2,4,3,4,4,5,2,7,3`，编码结果：`010 1000 011 1000 1000 1001 010 1011 011`

<div class="formula">
原始 43 bit → 编码 32 bit；码率 = 32/43 ≈ 0.744
</div>

游程编码依赖 0/1 分布偏斜；Golomb 以可变长前缀和尾部适应长游程，Huffman 则按符号频率缩短高频符号。

<div class="source">[1] 第 6 章 §6.2.1（印刷页 344–351）</div>

<!-- 讲师备注：逐段展开前缀和尾部；说明 32/43 是该例码率，不是对任意测试集的保证。 -->

---

<!-- _class: dense -->

# 线性解压是否可编码，归结为布尔线性方程组

设解压器特征矩阵为 `A`，自由变量向量为 `X`，目标 care bits 向量为 `Z`：

<div class="formula">
A X = Z  （运算在 GF(2)，加法为 XOR）
</div>

- 行数是 care bits，列数是 tester 自由变量；用 Gauss-Jordan 消元判断可解性并求一组解。
- 组合 XOR 只用当前周期变量，效率较低；时序 LFSR 保留历史变量。固定长度受最重测试立方体限制，可变长度按需增加时钟。

<div class="formula">
编码效率 = 测试集中的指定位数 / Tester 存储位数
</div>

若测试立方体不可编码，可选择旁路、重新生成兼容立方体，或增加自由变量；旁路会直接削弱总体压缩收益。

<div class="source">[1] 第 6 章 §6.2.2（印刷页 351–359）</div>

<!-- 讲师备注：把压缩统一成线性方程；编码效率是上界接近 1 的指标，不把所有测试时间都算作分母。 -->

---

# 广播扫描用共享换取带宽，再用可重构模式修复覆盖缺口

若两条扫描链第 i 个单元被同一通道驱动，则它们必然得到相同值；若故障需要相反值，单配置广播无法检测。

<div class="flow">
<div class="flow-step">单通道广播</div>
<div class="flow-step">覆盖多数兼容故障</div>
<div class="flow-step">剩余故障切串行或多通道</div>
<div class="flow-step">必要时动态重构分组</div>
</div>

- 独立子电路共享图形不损失可检测性；单电路内部共享可能损失覆盖。
- Illinois scan 以广播模式测多数故障，以串行模式补剩余故障。
- 多输入广播、静态/动态可重构广播、virtual scan 逐步增加控制灵活性。
- 越灵活通常意味着更多通道、更多控制数据或更复杂解压网络。

<div class="source">[1] 第 6 章 §6.2.3（印刷页 359–364）</div>

<!-- 讲师备注：用“同一扫描切片相同位”说明覆盖损失；再解释按故障子集重配置如何折中。 -->

---

# 响应可以损失信息地压缩，但 X 与混叠必须被显式处理

压缩前后矩阵由 `m×n` 变为 `p×q`：

<div class="formula">
空间压缩比 = m/p；时间压缩比 = n/q
</div>

<div class="grid-3">
<div class="metric"><strong>X-blocking</strong><p>从源头阻断；可能损失被 X 源遮挡的故障观察。</p></div>
<div class="metric"><strong>X-masking</strong><p>在压缩器前屏蔽含 X 的扫描输出；需要额外 mask 数据。</p></div>
<div class="metric"><strong>X-tolerant</strong><p>设计允许有限 X 的压缩器；X-compact 用矩阵行约束保证部分错误可检测。</p></div>
</div>

空间压缩器可保持较小组合深度；时序 MISR 混叠低但 X 会长期污染状态；无反馈 q-compactor 让错误/X 在有限周期内移出。压缩必须同时报告：数据缩减、混叠概率、X 处理开销和诊断分辨率。

<div class="source">[1] 第 6 章 §6.3（印刷页 364–376）</div>

<!-- 讲师备注：区分压缩、空间/时间压缩与 X 处理；压缩比不能单独作为设计结论。 -->

---

# 小结：BIST 与压缩移动了测试信息

<div class="takeaways">
<ul>
<li>BIST 的闭环价值依赖 BIST-ready 规则；未知源必须被阻断或容忍。</li>
<li>穷举给出强保证，伪随机给出实用性；难测故障靠加权、伪穷举、测试点或混合模式补足。</li>
<li>ORA 将响应映射为短签名，混叠是信息损失的必然风险；签名的位序和多项式必须一致解释。</li>
<li>At-speed 覆盖由捕获时序决定；测试压缩由 care bits、自由变量、X 与带宽共同决定。</li>
</ul>
</div>

<div class="callout question">若面积预算只允许增加一种结构，你会选择测试点、增加 MISR 级数，还是增加解压器自由变量？请用覆盖、混叠和诊断三个指标说明。</div>

<div class="source">[1] 第 5 章 §5.7、§5.9（印刷页 310–327）；第 6 章 §6.1–§6.5（印刷页 341–388）</div>

<!-- 讲师备注：用最后的口头问题要求学生把三类代价放在同一张判据表里，不给出唯一答案。 -->

---

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

<p class="small">文中 [1] 的章、节和印刷页码均指上述文献。</p>
