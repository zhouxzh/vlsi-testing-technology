---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 5 章 · 逻辑诊断'
---

<!-- _class: lead -->

# 逻辑诊断

## 从通过/失败判定到可复核的缺陷候选定位

<div class="tag-row">
  <span class="tag">故障字典</span>
  <span class="tag">因果反演</span>
  <span class="tag">扫描链诊断</span>
  <span class="tag">BIST 诊断</span>
</div>

<p class="small">3 × 45 分钟纯理论课 · [1] 第 7 章</p>

<span class="source">[1] 第 7 章；印刷页 397-460</span>

<!-- 讲师备注：本页只建立诊断与测试的区别。测试回答芯片是否失败，诊断回答哪些候选位置和候选机制最可能解释失败，并为后续物理失效分析提供顺序。 -->

---

# 学习目标：用响应证据缩小缺陷候选并评价诊断质量

<ul class="check-list">
  <li><strong>区分</strong> 测试判定、逻辑诊断和物理失效分析各自回答的问题。</li>
  <li><strong>构造</strong> 故障字典、诊断树和响应签名，并解释压缩造成的分辨率损失。</li>
  <li><strong>推导</strong> 结构裁剪、反向追踪、注入评估与诊断 ATPG 的候选更新规则。</li>
  <li><strong>比较</strong> 扫描链硬件辅助、响应注入和信号剖面诊断的观测边界。</li>
  <li><strong>分析</strong> 区间法、卸载法与掩码法如何从不完整签名恢复时间或空间信息。</li>
</ul>

<div class="callout question">贯穿问题：一个诊断算法报告了很少的候选，是否就说明它更可能命中真实缺陷？</div>

<!-- 讲师备注：最后一个问题预埋诊断分辨率与准确率的区别。后续每次讲一种方法，都要同时问它压缩了什么信息、保留了什么证据、代价在哪里。 -->

---

# 三条主线把失败现象逐步推进到候选位置

<div class="flow">
  <div class="flow-step">失败响应</div>
  <div class="flow-step">候选生成</div>
  <div class="flow-step">候选排序</div>
  <div class="flow-step">物理核验</div>
</div>

<div class="grid-3">
  <div class="concept">
    <h3>原因到结果</h3>
    <p>预先模拟故障，记录响应签名，建立故障字典或诊断树。</p>
  </div>
  <div class="concept">
    <h3>结果到原因</h3>
    <p>从失配输出反推扇入锥、可控性路径和可复现注入位置。</p>
  </div>
  <div class="concept">
    <h3>DFT 内部诊断</h3>
    <p>扫描链与 BIST 把可观测点压缩，诊断必须恢复时间或空间信息。</p>
  </div>
</div>

<div class="callout">诊断不是证明真实物理原因，而是在模型、测试集和响应数据约束下给出可排序、可复核的候选集合。</div>

<span class="source">[1] 第 7 章，7.1 节，印刷页 397-401；7.5 节，印刷页 449-450</span>

<!-- 讲师备注：强调最后一步要由物理失效分析完成，逻辑诊断只能缩小搜索区域。三条主线分别对应字典、因果反演和 DFT 环境下的信息恢复。 -->

---

<!-- _class: divider -->

# 第一节 · 45 分钟

## 测试给出通过或失败，诊断给出候选原因与优先级

<p>本节从输出对、诊断指标和故障字典出发，建立“原因到结果”的分析框架。</p>

<!-- 讲师备注：本节不讨论扫描链细节。先把诊断对象、质量指标、字典生成和存储代价讲清，为下一节的动态因果反演作准备。 -->

---

# 测试判定与逻辑诊断的输入、输出都不同

<div class="compare">
  <div class="compare-panel">
    <h3>制造测试</h3>
    <ul>
      <li>输入：测试图形与故障模型。</li>
      <li>观测：实际芯片的主输出或扫描输出。</li>
      <li>输出：通过/失败，以及覆盖率、测试时间等测试质量指标。</li>
      <li>目标：筛选坏片，控制逃逸。</li>
    </ul>
  </div>
  <div class="compare-panel highlight">
    <h3>逻辑诊断</h3>
    <ul>
      <li>输入：无故障模型、失败芯片响应、测试集。</li>
      <li>观测：输出对与失配模式，即 syndrome。</li>
      <li>输出：门、线网、扫描单元或故障类型的候选及排序。</li>
      <li>目标：指导物理失效分析、设计调试与成品率提升。</li>
    </ul>
  </div>
</div>

<div class="formula">
  <span class="formula-label">基本对象</span>
  (z<sub>C</sub>, z<sub>F</sub>) 为输出对；存在失配的测试向量称为失败向量。
</div>

<span class="source">[1] 第 7 章，7.1 节，定义 7.1-7.2，印刷页 399-400</span>

<!-- 讲师备注：说明 circuit under diagnosis 是无故障模型，failing chip 是黑箱。输出对的一端来自模型，另一端来自芯片；只有模型与芯片在相同输入下比较才有诊断意义。 -->

---

# 诊断质量必须同时衡量候选数量、命中位置和计算代价

| 指标 | 定义 | 解释边界 |
|---|---|---|
| 诊断分辨率 | 报告候选的总数 | 候选少不一定准确，候选集合可能漏掉真实位置 |
| 首次命中位置 | 排序列表中第一个真实缺陷候选的名次 | 只适用于带排序的结果 |
| Top-10 命中 | 前十个候选中命中的真实缺陷数 | 面向多缺陷诊断 |
| 成功率 | 一次物理检查中至少命中一个缺陷的芯片比例 | 受允许检查时间与资源影响 |
| 运行时间 | 完成一次诊断所需的计算时间 | 需与定位能力共同评价 |

<div class="callout warning">诊断分辨率、准确率和计算时间不是同一个指标。一个只报告一个错误候选的方法可能分辨率很好但准确率很差。</div>

<span class="source">[1] 第 7 章，7.1 节，印刷页 400-401</span>

<!-- 讲师备注：把指标写成二维评价：定位质量与计算代价。首次命中、Top-10 和成功率更接近物理失效分析的实际收益，不能只看候选数。 -->

---

# 因果分析先模拟所有候选，再把失败响应映射回故障

<div class="flow">
  <div class="flow-step">故障集合 F</div>
  <div class="flow-step">测试集 V</div>
  <div class="flow-step">故障仿真</div>
  <div class="flow-step">响应字典</div>
  <div class="flow-step">查表定位</div>
</div>

<div class="grid-2">
  <div class="concept">
    <h3>优点</h3>
    <p>字典构建完成后，单个失败芯片的查询通常很快；适合固定型故障占主导且模型与测试集稳定的场景。</p>
  </div>
  <div class="concept">
    <h3>构造条件</h3>
    <p>先限定故障类型，通常为固定型故障；对每个故障和每个测试向量记录输出响应。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">完整响应字典的规模</span>
  |D| = O(F × V × O)
</div>

<p>F 为故障数，V 为测试向量数，O 为输出位数。大规模芯片上，三者相乘会迅速超过可接受存储量。</p>

<span class="source">[1] 第 7 章，7.2.1 节，印刷页 401-403</span>

<!-- 讲师备注：原因到结果的核心是预计算。字典大小公式解释了为什么必须压缩或转为动态反演。强调 O 可以是主输出加伪输出，因此全扫描设计也没有消除规模问题。 -->

---

# 完整例题：用五条响应区分五个固定型故障

| 电路或故障 | v1 | v2 | v3 | v4 | v5 |
|---|---:|---:|---:|---:|---:|
| 无故障 | 0 | 0 | 0 | 0 | 1 |
| f1 | 0 | 1 | 1 | 1 | 1 |
| f2 | 1 | 1 | 1 | 0 | 1 |
| f3 | 1 | 0 | 0 | 1 | 1 |
| f4 | 0 | 0 | 1 | 0 | 0 |
| f5 | 0 | 1 | 1 | 0 | 1 |

<div class="compare">
  <div class="compare-panel">
    <h3>给定失败响应</h3>
    <p>五个测试向量下的输出为 <strong>0,1,1,0,1</strong>。</p>
    <p>与无故障响应 <strong>0,0,0,0,1</strong> 比较，v2、v3、v4 失配。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>查表结论</h3>
    <p>响应行与 f5 完全一致，因此候选集合为 {f5}。</p>
    <p>这是[1] 示例中的逻辑推导，不是对实际芯片的测量结果。</p>
  </div>
</div>

<span class="source">[1] 第 7 章，7.2.1 节，例 7.1，印刷页 402-403</span>

<!-- 讲师备注：逐步比较五列响应，不要求记表。指出无故障响应必须参与对照；如果测试集不能把故障分成不同响应组，诊断分辨率会受限。 -->

---

# 压缩字典保留分辨率，普通压缩可以牺牲分辨率

<div class="grid-3">
  <div class="concept">
    <h3>完整响应字典</h3>
    <p>保存每个测试向量和每个输出的值，诊断信息最完整，但规模为 F × V × O。</p>
  </div>
  <div class="concept">
    <h3>通过/失败字典</h3>
    <p>每个故障、每个向量只保留一个失败标志，规模降为 F × V，但多个输出失配会合并。</p>
  </div>
  <div class="concept">
    <h3>检测字典</h3>
    <p>只记录失败向量编号与失败输出向量，规模约为 F · logV · k · O。</p>
  </div>
</div>

<div class="callout">
术语上，<strong>compression</strong> 要求不降低已建模故障的诊断分辨率；<strong>compaction</strong> 允许降低分辨率来换取更小字典。
</div>

<p>选择性恢复部分输出列可以在字典大小和可分辨故障组数量之间折中。</p>

<span class="source">[1] 第 7 章，7.2.1.1 节，印刷页 403-405</span>

<!-- 讲师备注：用“通过/失败”字典说明信息损失：多个原本可区分的输出模式可能塌缩成同一个失败序列。选择性恢复输出列的目标是把分辨率恢复到所需水平。 -->

---

# 结果到原因不需要预先限定单一故障模型

<div class="compare">
  <div class="compare-panel">
    <h3>因果分析的能力边界</h3>
    <ul>
      <li>字典适合已经建模且响应可枚举的故障。</li>
      <li>对桥接、阻性缺陷或多缺陷，字典条目可能与实测 syndrome 不匹配。</li>
      <li>逻辑变化后，字典需要重新生成。</li>
    </ul>
  </div>
  <div class="compare-panel highlight">
    <h3>因果反演的依据</h3>
    <ul>
      <li>直接在无故障网表上做布尔推理。</li>
      <li>不要求故障只属于单一固定型模型。</li>
      <li>可扩展到多缺陷与部分扫描设计。</li>
      <li>代价是每个失败芯片都要单独分析。</li>
    </ul>
  </div>
</div>

<div class="formula">
  <span class="formula-label">诊断目标</span>
  找到信号集合 C，使对 C 中位置的有限修改能够解释失败芯片的输出 syndrome。
</div>

<span class="source">[1] 第 7 章，7.2.2 节，印刷页 405-407</span>

<!-- 讲师备注：强调“模型灵活性”不是免费优势，而是用计算换存储和适用性。因果分析不是随机猜测，它要和无故障仿真、失配输出及扇入结构保持一致。 -->

---

# 结构裁剪先按扇入锥排除不可能影响失配输出的门

<div class="compare">
  <div class="compare-panel">
    <h3>单故障假设</h3>
    <div class="formula">C = ∩ Cone(z<sub>i</sub>)</div>
    <p>只保留所有失配输出扇入锥的交集。定位更集中，但多故障时交集可能为空。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>多故障假设</h3>
    <div class="formula">C = ∪ Cone(z<sub>i</sub>)</div>
    <p>保留任一失配输出可能到达的全部门。更保守，集合更大，但不会因多故障错误排除真实候选。</p>
  </div>
</div>

<div class="callout question">若交集为空，能否直接断言电路无故障？不能，首先应改查多故障假设或候选条件。</div>

<span class="source">[1] 第 7 章，7.2.2.1 节，例 7.6，印刷页 407-408</span>

<!-- 讲师备注：区分由结构确定的候选区域和后续由逻辑值进一步筛选的候选点。裁剪只回答“是否可能影响”，不回答“是否真能解释全部失配”。 -->

---

# 反向追踪用控制值与非控制值判断哪些输入应负责

<div class="grid-2">
  <div class="concept">
    <h3>NAND 输出为 0</h3>
    <p>0 是控制值。只有取值为 0 的输入能够单独决定当前输出，因此只把这些输入保留为责任候选。</p>
  </div>
  <div class="concept">
    <h3>NAND 输出为 1</h3>
    <p>1 是非控制值。当前输出由所有输入共同维持，因此每个扇入信号都应保留，继续反向追踪。</p>
  </div>
</div>

<div class="flow">
  <div class="flow-step">失配输出</div>
  <div class="flow-step">按门规则反推</div>
  <div class="flow-step">得到单向量候选集</div>
  <div class="flow-step">跨失败向量取交</div>
</div>

<p>复杂门先分解为 AND、OR、NAND、NOR、NOT 等基本门。单故障假设下，再对所有失败向量的候选集合取交集。</p>

<span class="source">[1] 第 7 章，7.2.2.2 节，印刷页 408-409</span>

<!-- 讲师备注：示例规则只讲 NAND，其他门可由控制值概念迁移。反向追踪是函数裁剪，比结构裁剪更强，但仍可能保留伪候选，因此下一节引入注入评估。 -->

---

<!-- _class: divider -->

# 第二节 · 45 分钟

## 注入、排序、分区，把块级候选扩展为芯片级诊断

<p>本节从可复现 syndrome 出发，讨论候选排序、竞争原因消解和诊断专用测试图形。</p>

<!-- 讲师备注：第二节的中心是“候选如何变成可排序的证据”。先讲注入评估的机制，再讲芯片级多缺陷的分解，最后讨论桥接与诊断图形。 -->

---

# 注入评估：翻转候选值并检查 syndrome 复现

<div class="flow">
  <div class="flow-step">无故障仿真</div>
  <div class="flow-step">候选注入</div>
  <div class="flow-step">事件驱动传播</div>
  <div class="flow-step">计算指标</div>
  <div class="flow-step">回滚下一候选</div>
</div>

<ol>
  <li>对每个失败向量，记录无故障网表中每个信号的值。</li>
  <li>翻转候选信号当前值，创建一个值变化事件。</li>
  <li>按拓扑顺序传播事件，记录最终输出变化。</li>
  <li>统计 cured outputs、new mismatches 等指标，然后回滚本次注入。</li>
</ol>

<div class="callout">事件历史只需记录真正发生变化的信号。否则每次候选都扫描整个网表，回滚代价会吞掉事件驱动传播的收益。</div>

<span class="source">[1] 第 7 章，7.2.2.3 节，印刷页 409-413</span>

<!-- 讲师备注：说明事件队列按拓扑层排序的原因：必须保证前级信号在扇出后级之前被处理。回滚机制属于算法正确性和复杂度的一部分，不是实现细节。 -->

---

# 可修复向量比可修复输出更强的候选证据

<div class="compare">
  <div class="compare-panel">
    <h3>可修复输出</h3>
    <p>在某个候选信号注入值后，一个原本失配的输出变得与失败芯片一致。</p>
    <p>扇出大的信号天然容易修复更多输出，可能压过真实故障位置。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>可修复向量</h3>
    <p>该向量下的所有失配输出都被修复，且没有制造新的失配输出。</p>
    <p>条件更严格，因此更适合作为第一层排序指标。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">第二层奖励与惩罚</span>
  rank<sub>2</sub> = 可修复输出数 - 0.5 × 新增失配输出数
</div>

<p>先比较可修复向量数；相同时再比较 rank<sub>2</sub>。多缺陷芯片可能只能得到部分复现，因此仍需后续方法。</p>

<span class="source">[1] 第 7 章，7.2.2.3 节，定义 7.5-7.7 与例 7.10，印刷页 411-415</span>

<!-- 讲师备注：可修复向量是更严格的全输出条件，可修复输出是局部奖励，新失配是惩罚。公式中的 0.5 是[1] 给出的启发式权重，不是普遍常数。 -->

---

# 完整例题：修复一个输出却制造新失配时不能算可修复向量

<div class="compare">
  <div class="compare-panel">
    <h3>给定观测</h3>
    <p>无故障模型输出为 (z1,z2)=(1,1)。</p>
    <p>失败芯片输出为 (0,1)，因此只有 z1 失配。</p>
    <p>对候选 f 注入后，z1 从 1 变为 0，但 z2 从 1 变为 0。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>指标计算</h3>
    <p>cured outputs = 1。</p>
    <p>new mismatched outputs = 1。</p>
    <p>rank<sub>2</sub> = 1 - 0.5 × 1 = 0.5。</p>
    <p>该向量不是 f 的可修复向量。</p>
  </div>
</div>

<div class="callout question">为什么“所有原失配都被修复”之外还要禁止新增失配？因为新增失配说明注入改变了芯片并未表现出的行为。</div>

<span class="source">[1] 第 7 章，7.2.2.3 节，例 7.10 与图 7.11，印刷页 415-416</span>

<!-- 讲师备注：本例只计算指标，不声称任何物理缺陷。说明 cured-vector 是严格匹配条件，rank2 是竞争原因排序时的次级启发式。 -->

---

# 芯片级诊断先找结构独立故障，再分解剩余依赖故障

<div class="compare">
  <div class="compare-panel">
    <h3>结构独立与依赖</h3>
    <p>若两个故障的扇出锥不重叠，则称结构独立；否则称结构依赖。</p>
    <p>独立故障更容易由各自独占的失配输出识别。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>直接分区的局限</h3>
    <p>按失配输出的扇入重叠关系连边，再取连通分量。</p>
    <p>两个真实独立故障仍可能因扇入锥重叠落入同一诊断块。</p>
  </div>
</div>

<div class="flow">
  <div class="flow-step">结构裁剪</div>
  <div class="flow-step">识别独立故障</div>
  <div class="flow-step">消解已解释 syndrome</div>
  <div class="flow-step">依赖图分区</div>
  <div class="flow-step">逐块诊断</div>
</div>

<span class="source">[1] 第 7 章，7.2.3.1 与 7.2.3.2 节，印刷页 418-420</span>

<!-- 讲师备注：直接分区把无关故障混在一个块里，原因是输出失配集合可以不相交，但它们的扇入锥仍可重叠。两阶段策略先消解部分原因，再重新分区。 -->

---

# 词级主候选通过输出组过滤伪独立候选

<div class="grid-2">
  <div class="concept">
    <h3>SIC 点</h3>
    <p>某信号对每个失败向量都能部分修复其可达的全部失配，则它是 structurally independent candidate 点。</p>
  </div>
  <div class="concept">
    <h3>主候选</h3>
    <p>SIC 点，且其可达输出集合不是另一个 SIC 点可达输出集合的真子集。</p>
  </div>
  <div class="concept">
    <h3>词级主候选</h3>
    <p>进一步要求该信号能解释其可达输出组中的全部失配，而不只是可达的单个输出。</p>
  </div>
  <div class="concept">
    <h3>电路消减</h3>
    <p>删除已解释主候选所对应失配输出的扇入锥，再对剩余电路建模依赖并分区。</p>
  </div>
</div>

<p>[1] 报告了一个历史案例：普通主候选从 72.3 个降到词级主候选 3.7 个，用于说明过滤机制；不同设计不能套用这组数值。</p>

<span class="source">[1] 第 7 章，7.2.3.2 与 7.2.3.3 节，定义 7.8-7.12，印刷页 420-425</span>

<!-- 讲师备注：解释 aliasing：靠近输出、可达输出少的非故障信号也可能部分修复 syndrome。词级输出组约束增强过滤，但可能误删真实候选，所以后续阶段仍要处理未解释失配。 -->

---

# 诊断 ATPG 为尚未区分的故障对生成区分向量

<div class="compare">
  <div class="compare-panel">
    <h3>故障等价类</h3>
    <p>一个测试集若不能区分 f1 与 f2，二者就落在同一诊断等价类。</p>
    <p>高故障覆盖率测试集不保证高诊断分辨率，因为每个等价类最大规模仍可能很大。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>区分向量模型</h3>
    <p>把 f1 电路与 f2 电路的同名输入合并，对每个对应输出做异或，再把所有异或结果送到或门 z。</p>
    <p>若向量 v 检测 z/0，则 v 使 f1 与 f2 的至少一个输出不同。</p>
  </div>
</div>

<div class="flow">
  <div class="flow-step">现有测试集</div>
  <div class="flow-step">构造等价类</div>
  <div class="flow-step">选待区分故障对</div>
  <div class="flow-step">生成并加入区分向量</div>
</div>

<span class="source">[1] 第 7 章，7.2.4 节，定义 7.13，印刷页 425-426</span>

<!-- 讲师备注：指出诊断 ATPG 的目标函数与生产测试不同：生产测试追求检测覆盖，诊断 ATPG 追求让同响应故障分开。区分向量仍可用普通 ATPG 求解，只是改变了故障模型网络。 -->

---

# SLAT 把桥接故障拆成单点修复向量再组合成故障多重集

<div class="grid-2">
  <div class="concept">
    <h3>第一阶段：找 SLAT 向量</h3>
    <p>对每个信号与失败向量执行注入，记录哪些单点修改能修复全部失配，形成失败向量与候选信号的二维表。</p>
  </div>
  <div class="concept">
    <h3>第二阶段：找故障多重集</h3>
    <p>先找覆盖全部失败向量的单点候选；若不存在，再寻找两点、三点或更高阶集合，使其 SLAT 向量并集覆盖全部失败向量。</p>
  </div>
</div>

<div class="callout">
桥接缺陷可能影响两个单元，但在一次向量中通常只有一个受害者信号发生翻转，因此可先寻找单点解释，再组合多重点。
</div>

<p>若找不到任何有效 multiplet，可能说明某个失败向量的 syndrome 由多个信号共同造成，不能由单点注入完整解释。</p>

<span class="source">[1] 第 7 章，7.2.2.3 与 7.2.5 节，例 7.11，印刷页 416-418、427</span>

<!-- 讲师备注：SLAT 不是把桥接故障简化成固定型故障，而是利用“单次只有一个受害者”的结构限制构造候选。多重集的势从 1 逐级增大，计算代价随之上升。 -->

---

# 组合逻辑诊断方法的取舍取决于模型、缺陷数和证据完整度

| 方法 | 主要输入 | 优势 | 主要边界 |
|---|---|---|---|
| 故障字典 | 预计算响应表 | 查询快，固定型故障下清晰 | 存储大，对未建模缺陷和设计变化敏感 |
| 结构裁剪 | 失配输出扇入锥 | 快速缩小区域 | 单故障取交、多故障取并，精度有限 |
| 反向追踪 | 无故障信号值与门规则 | 直接利用结构传播 | 可能保留较多伪候选 |
| 注入评估 | 候选值翻转与 syndrome 复现 | 支持多模型、排序灵活 | 每芯片计算量大，依赖注入模型 |
| 芯片级两阶段 | 独立故障与输出组 | 可处理多个竞争原因 | 词级过滤可能误删真实故障 |
| SLAT | 单点可修复表 | 可表达桥接多重集 | 候选空间和多重集搜索可能很大 |

<div class="callout warning">没有一种方法同时具备最小字典、最高精度和最低计算量；必须说明假设与失败边界。</div>

<span class="source">[1] 第 7 章，7.2 节，印刷页 401-427</span>

<!-- 讲师备注：此页作为节末比较，不引入新算法。让学生从“输入、优势、边界”三个维度复述，而不是只背方法名。 -->

---

<!-- _class: divider -->

# 第三节 · 45 分钟

## 扫描链和逻辑 BIST 把诊断变成时间与空间信息恢复

<p>本节讨论 DFT 结构内部的诊断：先定位扫描单元，再恢复失败向量或捕获错误的单元集合。</p>

<!-- 讲师备注：进入 DFT 诊断后，无故障组合逻辑假设不再总成立。扫描链故障会影响整条移出图像，BIST 签名又会压缩时间与空间信息。 -->

---

# 扫描链诊断比较快照图像与观测图像

<div class="compare">
  <div class="compare-panel">
    <h3>快照图像</h3>
    <p>某一时刻扫描触发器内容的逻辑值组合。无故障模型可通过仿真得到，失败芯片内部通常不可直接读取。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>观测图像</h3>
    <p>从扫描输出端移出的位流。无故障时等于快照图像；有故障时会被扫描链或组合逻辑改变。</p>
  </div>
</div>

<p><strong>功能故障：</strong>固定型、桥接。<strong>时序故障：</strong>建立时间违例、保持时间违例，其中建立时间问题还可细分为慢升与慢降。</p>

<div class="formula">
  <span class="formula-label">关键分解</span>
  扫描链 = SI-to-fault 段 + 故障触发器 + fault-to-SO 段
</div>

<span class="source">[1] 第 7 章，7.3.1 节，定义 7.14-7.18，印刷页 427-430</span>

<!-- 讲师备注：解释为什么扫描链故障常造成全局失真：移出时所有经过故障触发器的位都可能被改变。先区分功能与时序故障，也区分永久与间歇故障。 -->

---

# Flush 测试的响应模式可以先分类扫描链故障

<div class="grid-2">
  <div class="concept">
    <h3>固定型故障</h3>
    <p>输入交替图形 1100110011001100。</p>
    <p>Stuck-at-0 观测为全 0；stuck-at-1 观测为全 1。</p>
  </div>
  <div class="concept">
    <h3>变迁故障</h3>
    <p>Slow-to-rise 示例观测为 1000100010001000。</p>
    <p>Slow-to-fall 示例观测为 1101110111011100。</p>
  </div>
  <div class="concept">
    <h3>分类价值</h3>
    <p>Flush 响应适合判断故障类型，但单个全 0 图像不足以直接指出故障位置。</p>
  </div>
  <div class="concept">
    <h3>后续诊断</h3>
    <p>确定故障类型后，再选择更有针对性的注入模型、硬件测试或剖面序列。</p>
  </div>
</div>

<p>桥接故障可能表现为 AND 型、OR 型或随条件变化，因此响应分类通常比固定型故障更困难。</p>

<span class="source">[1] 第 7 章，7.3.1 节，图 7.23，印刷页 429-430</span>

<!-- 讲师备注：本例位串来自[1] 说明性图示，不是实测。强调最右位先进入也先移出的约定；没有统一方向约定时不能直接比较位串。 -->

---

# 硬件辅助反相可以在扫描输出中露出固定型故障边界

<div class="compare">
  <div class="compare-panel">
    <h3>修改扫描单元</h3>
    <p>在扫描触发器前加入异或门，由全局 Invert 信号控制，实现正常工作、移位和整体反相三种模式。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>16 位说明性过程</h3>
    <p>从 SI 数第 5 个触发器发生 stuck-at-0。</p>
    <p>移入全 1 后快照图像为 1111000000000000。</p>
    <p>整体反相得到 0000011111111111；移出后 0/1 边界对应故障位置。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">核心机制</span>
  SI-to-fault 段与 fault-to-SO 段在反相后形成可检测边界
</div>

<p>硬件辅助法用面积和设计修改换取更直接的位置证据，仍要分别检查 stuck-at-0 与 stuck-at-1。</p>

<span class="source">[1] 第 7 章，7.3.2 节，例 7.17，印刷页 430-432</span>

<!-- 讲师备注：本例是[1] 说明性过程。反相发生在扫描移出之前，不是把输入图形反相；边界被读出时故障位置才被定位。 -->

---

# 扫描链注入评估：模拟完整 scan-capture-scan

<div class="flow">
  <div class="flow-step">Flush 分类</div>
  <div class="flow-step">选扫描向量</div>
  <div class="flow-step">注入候选</div>
  <div class="flow-step">模拟 scan-capture-scan</div>
  <div class="flow-step">累计匹配分数</div>
</div>

<div class="grid-2">
  <div class="concept">
    <h3>与组合逻辑诊断的差异</h3>
    <p>扫描链故障在多个时钟周期中传播，固定型、桥接和时序故障可能没有统一的“翻转一个值”注入模型。</p>
  </div>
  <div class="concept">
    <h3>失真与可区分性</h3>
    <p>故障会污染整幅观测图像，不同候选可能产生相似响应，因此匹配分数和排序比唯一匹配更常见。</p>
  </div>
</div>

<p>该方法不需要额外硬件，但候选枚举和多周期仿真代价高，并且需要足够精确的故障行为模型。</p>

<span class="source">[1] 第 7 章，7.3.3 节，例 7.18，印刷页 432-434</span>

<!-- 讲师备注：说明 scan-capture-scan 是从输入位流到输出位流的映射，候选必须复现这个完整映射。扫描链诊断比组合逻辑诊断更依赖注入模型和测试向量选择。 -->

---

# 信号剖面法用功能序列制造更系统的扫描移出趋势

<div class="compare">
  <div class="compare-panel">
    <h3>Run-and-scan</h3>
    <p>先运行功能序列，在选定周期停止，再把最终快照整体移出。大量序列使各触发器出现 1 的频率接近 0.5。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>差异剖面</h3>
    <p>比较无故障与失败芯片逐位 1 频率。扫描移出使 SI-to-fault 段明显失真，而 fault-to-SO 段基本保持。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">五点平滑示例</span>
  SD[i] = 0.2 × (D[i-2] + D[i-1] + D[i] + D[i+1] + D[i+2])
</div>

<p>随后用加权边缘检测把平滑曲线的左边界转成 suspicion profile，并按可疑度排序候选触发器。</p>

<span class="source">[1] 第 7 章，7.3.4 节，定义 7.19-7.20，印刷页 434-441</span>

<!-- 讲师备注：信号剖面法的关键不是平滑公式本身，而是选择功能序列让所有触发器获得足够激励，并利用扫描移出阶段的强烈偏置恢复故障位置。 -->

---

# 逻辑 BIST 诊断要恢复失败时间和捕获错误的空间位置

<div class="flow">
  <div class="flow-step">PRPG</div>
  <div class="flow-step">多条扫描链</div>
  <div class="flow-step">核心逻辑</div>
  <div class="flow-step">MISR</div>
  <div class="flow-step">压缩签名</div>
</div>

<div class="compare">
  <div class="compare-panel">
    <h3>时间信息</h3>
    <p>哪些测试向量首次或多次产生错误响应。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>空间信息</h3>
    <p>哪些扫描单元捕获了错误响应。</p>
  </div>
</div>

<p>[1] 用“一百万个测试向量、两万个扫描单元”说明签名压缩后的搜索规模：最终签名本身通常不足以同时回答时间与空间问题。</p>

<p>直接绕过 MISR 并保存所有非压缩响应的方式需要巨大的测试设备存储和后续处理量。</p>

<span class="source">[1] 第 7 章，7.4.1 节，图 7.34，印刷页 442-443</span>

<!-- 讲师备注：STUMPS 的 PRPG 产生伪随机图形，扫描链提供观测，MISR 把多周期响应压成签名。诊断难度来自高度压缩，而不是来自测试图形数量少。 -->

---

# 区间法把整个 BIST 会话切成可重复的较短窗口

<div class="compare">
  <div class="compare-panel">
    <h3>二分搜索</h3>
    <p>先运行前一半；若失败，继续搜索前半段；若通过，则从后半段起点继续。</p>
    <p>定位每个失败向量约需 log<sub>2</sub>B 次 BIST 运行，最后一次再移出该向量的完整响应。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>区间卸载</h3>
    <p>把 28 个向量分成 7 个四向量区间。若区间 1 和 5 失败，只重跑这两个区间并移出 2 × 4 = 8 个非压缩响应。</p>
    <p>运行步骤少，但需要更多测试设备存储。</p>
  </div>
</div>

<p>二分搜索要求 PRPG 能从指定种子启动，模式计数器也能装载指定长度。区间卸载则用存储换运行次数。</p>

<span class="source">[1] 第 7 章，7.4.2 节，例 7.21-7.22，印刷页 443-446</span>

<!-- 讲师备注：[1] 示例使用 28 个向量。不要机械记忆 14、7、4、2、3 的序列，重点理解可重复种子、区间长度和测试设备存储的权衡。 -->

---

# 掩码法只压缩部分扫描单元，从而恢复空间信息

<div class="compare">
  <div class="compare-panel">
    <h3>伪随机掩码</h3>
    <p>每次 BIST 运行选择不同扫描单元进入 MISR，其余响应被屏蔽。通过多次签名的排除关系推断错误单元。</p>
    <p>一次加载可收集多轮证据，但定位精度取决于运行次数、单元总数和错误数。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>确定性掩码</h3>
    <p>把扫描单元看成“扫描链 × 扫描切片”矩阵，用 X、Y、Z 选择链集合及连续切片区间。</p>
    <p>通过分区二分搜索，可保证找到捕获错误的精确单元集合。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">确定性分区的最坏运行数</span>
  2e · log<sub>2</sub>(N/e) + 2e - 1
</div>

<p>N 为扫描单元总数，e 为捕获错误的单元数。时间信息与空间信息越完整，诊断所需的运行次数或测试设备存储越高。</p>

<span class="source">[1] 第 7 章，7.4.3 节，印刷页 446-449</span>

<!-- 讲师备注：伪随机掩码非自适应、运行快但可能不精确；确定性掩码自适应、保证精确但需要多次 BIST 运行。两者都利用故障索引与掩码分区的包含关系。 -->

---

# 小结：诊断价值来自可追溯的候选、排序与信息恢复

<ol class="takeaways">
  <li>测试把芯片分为通过或失败；诊断用无故障模型、失败向量和响应 syndrome 缩小候选位置与机制。</li>
  <li>故障字典把原因到结果预计算，因果反演把结果到原因动态推理；两者都受模型、测试集和诊断分辨率约束。</li>
  <li>结构裁剪、反向追踪、注入评估和芯片级分区逐步把大网表变成可排序候选，诊断 ATPG 则主动生成区分证据。</li>
  <li>扫描链诊断依赖快照与观测图像，硬件辅助、注入模拟和信号剖面分别用面积、计算和统计证据定位故障。</li>
  <li>逻辑 BIST 诊断通过区间法恢复失败时间，通过掩码法恢复错误空间；诊断能力必须与签名信息量一起评价。</li>
</ol>

<p class="small">理论依据：[1] 第 7 章，7.1-7.5 节，印刷页 397-450。</p>

<span class="source">[1] 第 7 章，印刷页 397-450</span>

<!-- 讲师备注：最后回收五条主线：问题定义、字典、动态反演、扫描链和 BIST。下一章把同一组“测试、诊断、证据”问题移到规则存储器阵列，并加入冗余修复。 -->

---

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

<p class="small">文中 [1] 的章、节和印刷页码均指上述文献。</p>
