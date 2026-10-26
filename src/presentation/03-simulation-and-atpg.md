---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 3 章 · 逻辑与故障仿真、测试生成'
---

<!-- _class: lead -->

# 逻辑与故障仿真、测试生成

## 从一个故障模型到一条可执行测试向量

超大规模集成电路测试基础 · 第 3 章

<div class="source">理论依据：VLSI Test Principles and Architectures，第 3、4 章（[1] 印刷页 105–262）</div>

<!-- 讲师备注：先给出主线，仿真预测行为，故障仿真评价测试集，ATPG 反向构造测试。 -->

---

# 中心问题：故障怎样从“假设”变成“可检测”

<div class="flow">
<div class="flow-step">建立逻辑与故障模型</div>
<div class="flow-step">计算无故障/故障响应</div>
<div class="flow-step">评估覆盖率与代价</div>
<div class="flow-step">生成并压缩测试集</div>
</div>

<div class="agenda-grid">
<div class="agenda-item">
<h3>第 1 节 · 45 分钟（教学容量估计）</h3>
<p>多值逻辑、门求值、延迟模型、编译式与事件驱动仿真。</p>
</div>
<div class="agenda-item">
<h3>第 2 节 · 45 分钟（教学容量估计）</h3>
<p>串行、并行、演绎、并发、差分故障仿真与近似方法。</p>
</div>
<div class="agenda-item">
<h3>第 3 节 · 45 分钟（教学容量估计）</h3>
<p>随机与确定性 ATPG、时序扩展、非固定型故障和测试压缩。</p>
</div>
</div>

<div class="callout question">贯穿问题：当电路规模和故障数同时增长时，哪一层抽象可以保留“检测结论”，同时降低计算量？</div>

<div class="source">[1] 第 3 章 §3.1、§3.4，第 4 章 §4.1–§4.11（印刷页 105–154、161–248）</div>

<!-- 讲师备注：强调四个环节不是工具菜单，而是同一判定问题在不同阶段的表示。 -->

---

<!-- _class: divider -->

# 第 1 节

## 逻辑模型、时序与无故障仿真

本节目标：说明一个门级网络在给定输入和延迟模型下，如何得到可信的输出事件序列。

<div class="source">[1] 第 3 章 §3.1–§3.3（印刷页 105–132）</div>

<!-- 讲师备注：本节先建立语义，再讨论算法；不要把仿真等同于运行某个现成程序。 -->

---

# 逻辑仿真同时服务设计验证与测试开发

<div class="grid-2">
<div class="concept">
<h3>设计验证</h3>
<p>比较设计描述在激励下的响应与规格期望值；差异指向设计错误。</p>
</div>
<div class="concept">
<h3>测试开发</h3>
<p>在假定设计正确的前提下注入制造故障，比较故障响应与无故障响应。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">检测的必要条件</span>
存在输入向量 t，使 <strong>R<sub>good</sub>(t) ≠ R<sub>faulty</sub>(t)</strong>
</div>

抽象层次从行为级、RTL、门级到开关级逐步增加细节。测试评价通常选择门级：它保留故障传播所需的结构，又比晶体管级便宜。

<div class="callout">模型选择的核心不是“越精确越好”，而是精度必须足以支持当前判定，且代价可承受。</div>

<div class="source">[1] 第 3 章 §3.1.1–§3.1.2（印刷页 106–108）</div>

<!-- 讲师备注：用判定条件统一设计验证和故障仿真，再说明制造缺陷与设计错误不是同一类非理想性。 -->

---

# 门级网络把时序电路拆成组合逻辑与状态边界

<div class="formula">
<span class="formula-label">Huffman 模型</span>
组合逻辑输入 = PI ∪ PPI；组合逻辑输出 = PO ∪ PPO
</div>

- `PI`：主输入；`PO`：主输出。
- `PPI`：触发器当前状态，作为组合逻辑的伪主输入。
- `PPO`：触发器下一状态，作为组合逻辑的伪主输出。
- 边沿触发器中，有效时钟沿把 `PPO` 写入状态寄存器。

<div class="callout">
组合电路的一条向量只有一个时间片；时序电路通常需要向量序列，因为状态必须被带到可激励、可传播的条件。
</div>

<div class="source">[1] 第 3 章 §3.2.1（印刷页 109–110）</div>

<!-- 讲师备注：在黑板上把 PPI、PPO 与时间帧关系画成一条状态链，为后文时序 ATPG 留接口。 -->

---

# 第三值 `u` 表示“可能是 0，也可能是 1”

<div class="truth-table">

| AND | 0 | 1 | u |
|---|---:|---:|---:|
| 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | u |
| u | 0 | u | u |

</div>

<div class="formula">
<span class="formula-label">集合语义</span>
0 = {0}，1 = {1}，u = {0,1}
</div>

`0 · u = {0} · {0,1} = {0} = 0`，所以 0 是 AND 的控制值。类似地，OR 的控制值是 1。

<div class="callout warning">第三值是悲观的：相关信号可能让真实输出确定，而逐门集合运算仍返回 `u`。例如 `F = A·B + A·B̄` 在 `A=1, B=u` 时恒为 1，但逐门第三值计算会得到 `u`。</div>

<div class="source">[1] 第 3 章 §3.2.2.1（印刷页 111–112）</div>

<!-- 讲师备注：先讲集合运算，再用恒等函数说明信息损失来自忽略输入相关性。 -->

---

# 高阻 `Z` 描述“不驱动”，总线需要分辨率函数

<div class="grid-3">
<div class="metric"><strong>0</strong><p>至少一个强驱动 0，且无相反驱动。</p></div>
<div class="metric"><strong>1</strong><p>至少一个强驱动 1，且无相反驱动。</p></div>
<div class="metric"><strong>X</strong><p>同时出现相反驱动，结果不可信。</p></div>
</div>

<div class="truth-table">

| 驱动集合 | 总线结果 |
|---|---|
| `{0,Z}` | 0 |
| `{1,Z}` | 1 |
| `{Z,Z}` | Z，可由上/下拉给出默认值 |
| `{0,1}` | X，并可能造成电气损伤 |

</div>

三态总线在测试向量下可能出现正常功能中不会出现的使能组合。因此，分辨率函数不只是求值公式，也是合法性检查点。

<div class="source">[1] 第 3 章 §3.2.2.2–§3.2.2.3（印刷页 113–114）</div>

<!-- 讲师备注：区分 X 与 Z：X 是不知道值，Z 是没有有效驱动；总线冲突应显式报告。 -->

---

# 门求值可以只扫描输入，不必存完整真值表

对 AND、OR、NAND、NOR，令控制值为 `c`、反相标志为 `i`：

<div class="formula">
<span class="formula-label">输入扫描规则</span>
有任一输入等于 c ⇒ 输出 c ⊕ i<br>
无控制值但有输入 u ⇒ 输出 u<br>
全部输入为非控制值 ⇒ 输出 c ⊕ i
</div>

<div class="flow">
<div class="flow-step">扫描输入，记录是否见 c</div>
<div class="flow-step">同时记录是否见 u</div>
<div class="flow-step">按优先级返回确定值、u 或非控制输出</div>
</div>

真值表访问是 `O(1)`，但 n 输入二元门需要 `2ⁿ` 项；输入扫描是 `O(n)`，常数更小。输入计数进一步维护 `c_count` 与 `u_count`，仅当输入事件发生时更新。

<div class="source">[1] 第 3 章 §3.2.3（印刷页 114–117）</div>

<!-- 讲师备注：给出 c 与 i 表；说明控制值优先于未知值，这是门求值的关键短路规则。 -->

---

# 延迟模型决定“何时”以及“是否”出现输出变化

<div class="compare">
<div class="compare-panel">
<h3>传输延迟</h3>
<p>输入变化经过固定时间后到达输出；可区分上升、下降以及最小/最大界。</p>
</div>
<div class="compare-panel highlight">
<h3>惯性延迟</h3>
<p>窄于门最小响应宽度的脉冲被滤除，表示器件有限带宽。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">脉冲宽度变化</span>
输入脉宽 T<sub>in</sub>，上升延迟 d<sub>r</sub>，下降延迟 d<sub>f</sub><br>
T<sub>out</sub> = T<sub>in</sub> + d<sub>f</sub> − d<sub>r</sub>
</div>

若 `T_in=1 ns, d_r=2 ns, d_f=1.5 ns`，则 `T_out=0.5 ns`。若惯性延迟为 1.5 ns，宽度小于 1.5 ns 的输入脉冲不能通过。

线延迟应按驱动端到每个接收端的路径建模；扇出分支可插入独立延迟。功能单元还需给出建立、保持和异步置位/复位时序。

<div class="source">[1] 第 3 章 §3.2.4（印刷页 118–121）</div>

<!-- 讲师备注：传输延迟保形但可改变脉宽；惯性延迟负责滤波。两者不可混为同一个参数。 -->

---

# Hazard 是重汇聚路径延迟差造成的瞬态脉冲

<div class="grid-2">
<div class="concept">
<h3>静态 hazard</h3>
<p>稳定值本应不变，却在过渡中出现 `0→1→0` 或 `1→0→1`。</p>
</div>
<div class="concept">
<h3>动态 hazard</h3>
<p>本应单次翻转，却出现多次翻转。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">把未知时刻显式化</span>
V<sup>1</sup> 与 V<sup>2</sup> 的逐位过渡向量 V<sup>+</sup>：<br>
v<sub>i</sub><sup>+</sup> = v<sub>i</sub><sup>1</sup>（保持不变）；否则为 u
</div>

顺序仿真 `V¹ → V⁺ → V²`。若输出出现 `0u0` 或 `1u1`，存在静态 hazard 的最坏情况。六值逻辑可区分静态、上升、下降及静态 hazard；八值逻辑再表达动态 hazard。

<div class="callout question">若 hazard 接到异步清零端，为什么“最终逻辑值正确”仍可能不足以保证电路正确？</div>

<div class="source">[1] 第 3 章 §3.3.4（印刷页 130–132）</div>

<!-- 讲师备注：强调 hazard 是时序语义问题；询问学生最终值、脉冲宽度与接收端状态之间的关系。 -->

---

# 编译式仿真把网络变成按拓扑顺序执行的代码

<div class="flow">
<div class="flow-step">逻辑优化</div>
<div class="flow-step">逻辑分级</div>
<div class="flow-step">代码生成</div>
<div class="flow-step">逐向量执行</div>
</div>

```text
level(A,B,C) = 0
E = OR(B,C)        level(E) = 1
H = AND(A,E)       level(H) = 2
J = NOT(E)         level(J) = 2
K = NOR(H,J)       level(K) = 3
```

- 删除固定非控制输入、单输入门、冗余反相器和不可观察门，减少语句数。
- 分级保证门只在其前驱求值后执行；同一级内部顺序可交换。
- 三种实现是高级语言源码、本机机器码和解释代码，分别偏向可移植性、速度与维护性。

限制：每来一个向量通常执行整个网络，且零延迟/周期模型难以表达毛刺。若相邻向量只有少部分信号变化，大量求值是浪费。

<div class="source">[1] 第 3 章 §3.3.1（印刷页 121–125）</div>

<!-- 讲师备注：说明编译式方法的优势在高切换率和大量向量；延迟与毛刺不是它的强项。 -->

---

<!-- _class: dense -->

# 事件驱动仿真只重算被事件触发的门

<div class="compare">
<div class="compare-panel">
<h3>输入从 `001` 变为 `111`</h3>
<p>A、B 发生事件；E=B+C 仍为 1，因此 G3 不求值。</p>
</div>
<div class="compare-panel highlight">
<h3>事件传播</h3>
<p>A 的事件进入 G2；H 改变后再进入 G4。队列为空时当前向量结束。</p>
</div>
</div>

```text
EVENT_SIM():
  enqueue fanout of active PIs
  while queue:
    g = earliest event; discard if stale
    evaluate g; enqueue fanout on change at t+delay
```

调度器按时间戳递增处理，同一时间戳分组避免重复求值。两遍策略先确认当前时间片的所有真实事件，再统一更新待求值表并调度新事件；时间轮和溢出表控制远处时间戳的开销。

<div class="source">[1] 第 3 章 §3.3.2（印刷页 125–129）</div>

<!-- 讲师备注：用 001→111 的例子说明“输入变化不必然导致内部事件”；这是事件驱动效率的来源。 -->

---

# 两种仿真器应按信号变化密度、时序精度和启动代价选择

<div class="truth-table">

| 维度 | 编译式 | 事件驱动 |
|---|---|---|
| 高切换率、周期级 | 有利 | 调度开销可能更明显 |
| 低切换率、门控时钟 | 全网络浪费 | 只处理变化区域 |
| 延迟与 hazard | 表达受限 | 可接入一般延迟模型 |
| 大量向量 | 编译成本可摊薄 | 无整体编译优势 |
| 频繁修改模型 | 重编译代价较高 | 启动与增量调试更自然 |

</div>

<div class="callout">
共同目标不是产生“漂亮波形”，而是在声明的逻辑与时间语义下，得到可比较的无故障/故障响应。
</div>

<div class="callout question">若同一电路在周期级检查和 hazard 检测之间切换，仿真器最需要保留或改变的状态是什么？</div>

<div class="source">[1] 第 3 章 §3.3.3（印刷页 129）</div>

<!-- 讲师备注：收束第一节；口头问题指向时间状态与调度语义，不要求计算。 -->

---

<!-- _class: divider -->

# 第 2 节

## 故障仿真：一次评价整个测试集

本节目标：比较五类方法如何表示故障、共享计算，以及用时间、空间和精度换取覆盖评价。

<div class="source">[1] 第 3 章 §3.4（印刷页 132–154）</div>

<!-- 讲师备注：先强调所有方法共享同一判定：某向量下任一主输出是否与无故障响应不同。 -->

---

# 朴素故障仿真的代价来自“故障数 × 向量数 × 电路规模”

<div class="formula">
<span class="formula-label">串行基线</span>
时间 ∝ p × n × |F<sub>collapsed</sub>|
</div>

- `p` 是测试向量数，`n` 是逻辑规模，`|F|` 是折叠后的故障数。
- 单固定型故障数通常与线路数同阶，因此串行代价可接近 `O(pn²)`。
- 故障折叠先删除逻辑等价故障，避免为不可区分的故障重复生成向量。
- 故障仿真可做故障评分、识别未检测故障、压缩测试集，并辅助诊断。

<div class="callout">真正的加速来自共享：共享一个无故障状态、共享字中的多个故障、共享故障列表，或共享相邻故障电路的状态差。</div>

<div class="source">[1] 第 3 章 §3.4 导论、§3.4.1（印刷页 132–135）</div>

<!-- 讲师备注：明确指出故障折叠改变的是表示，不改变可检测性的定义。 -->

---

# 串行故障仿真用完整例题建立检测判定

电路：`E=B+C`，`L=E`，`H=A·L`，`J=¬E`，`K=¬(H+J)`。目标故障为 `A/1` 与 `J/0`。

<div class="truth-table">

| 向量 `ABC` | `K_good` | `K(A/1)` | `K(J/0)` |
|---|---:|---:|---:|
| `010` | 1 | 0 | 1 |
| `001` | 1 | 0 | 1 |
| `100` | 0 | 0 | 1 |

</div>

- 第一组向量使 `A/1` 的故障响应与无故障响应不同，因此检测 `A/1`。
- `J/0` 在前两组被 `H=0` 掩盖，第三组 `H=0` 且 `J` 正常应为 1，故输出差异出现。
- 故障一旦被检测即可丢弃，后续向量只继续模拟尚未检测的故障；诊断场景不能随意丢弃。

<div class="source">[1] 第 3 章 §3.4.1（印刷页 133–135）</div>

<!-- 讲师备注：板书三列响应并逐行判定；强调故障只在主输出差异处称为硬检测。 -->

---

# 并行故障仿真把多个故障压进同一个机器字

设字宽为 3：最高位保留无故障电路，另两位分别对应 `A/1` 和 `J/0`。

<div class="truth-table">

| 向量 | 打包输出 `{good,A/1,J/0}` | 判定 |
|---|---|---|
| `010` | `101` | `A/1` 与 good 不同 |
| `001` | `101` | `A/1` 仍被检测 |
| `100` | `001` | `J/0` 与 good 不同 |

</div>

<div class="formula">
<span class="formula-label">一字并行</span>
一次按位门运算同时更新 w−1 个故障副本和 1 个无故障副本<br>
理想加速比约为 w−1
</div>

并行故障仿真适合测试序列前段：每个向量通常丢弃大量故障。其限制是同一批故障必须整批继续，不能单独结束某个故障；复杂延迟模型也难以直接按位共享。

<div class="source">[1] 第 3 章 §3.4.2.1（印刷页 135–137）</div>

<!-- 讲师备注：说明位分配与故障注入侧输入；区分并行故障和并行向量。 -->

---

# 演绎故障仿真传播“使该线偏离正常值的故障集合”

令 `L_x` 表示在 `x` 上能造成逻辑差异的故障集合。无控制值时：

<div class="formula">
<span class="formula-label">故障列表传播</span>
L<sub>z</sub> = ⋃<sub>j∈I</sub> L<sub>j</sub> ∪ {z/(c ⊕ i)}
</div>

若存在控制输入集合 `S`，则：

<div class="formula">
⋃<sub>j∈S</sub> L<sub>j</sub> − ⋃<sub>j∈I−S</sub> L<sub>j</sub> ∪ {z/(c ⊕ i)}
</div>

在例题 `P1=010` 中，`L_K={A/1,H/1,B/0,E/0,F/0,J/1,K/0}`，对应 7 个被检测故障。集合差表达“只有让所有控制输入同时翻转，输出才可能翻转”。

<div class="callout warning">演绎法一次处理整个故障集合，但故障列表大小不可预测，且 `X/Z`、延迟与功能模型处理困难。</div>

<div class="source">[1] 第 3 章 §3.4.3（印刷页 139–143）</div>

<!-- 讲师备注：通过 AND 与 OR 的控制值直觉解释并集、交集和集合差，不展开全部代数证明。 -->

---

# 并发故障仿真只维护与正常门分叉的“坏门”

<div class="flow">
<div class="flow-step">无故障事件</div>
<div class="flow-step">更新相关坏门</div>
<div class="flow-step">坏门变可见则分叉传播</div>
<div class="flow-step">重新一致则收敛删除</div>
</div>

- 每个门保存并发故障列表；条目记录故障编号与该故障下的输入/输出值。
- 坏门输出与正常门相同：不可见，不向后传播。
- 坏门输出不同：可见，产生坏事件并可能在后继门分叉。
- 某个故障被主输出观察到后，可从所有相关列表中删除。

这种方法能自然处理 `X/Z` 和部分延迟/功能模型，并适合时序电路；代价是坏门状态与动态列表可能占用大量内存。

<div class="source">[1] 第 3 章 §3.4.4（印刷页 143–146）</div>

<!-- 讲师备注：分叉/收敛是并发仿真的核心状态转换；强调事件驱动只访问受影响区域。 -->

---

# 差分故障仿真在相邻故障电路之间只保存状态差

<div class="compare">
<div class="compare-panel">
<h3>同一向量内</h3>
<p>无故障状态 → 故障 f₁ → 故障 f₂ → …；每次从上一个故障状态恢复并换入目标故障。</p>
</div>
<div class="compare-panel highlight">
<h3>向量推进时</h3>
<p>恢复下一向量的无故障状态，再利用已保存的状态差恢复各故障电路。</p>
</div>
</div>

<div class="formula">
<span class="formula-label">核心存储</span>
存的是 <strong>F<sub>i,j</sub> − F<sub>i−1,j</sub></strong> 的差异事件，而不是每个故障的完整门级状态
</div>

优点是内存明显小于并发法，且在时序电路中可复用故障状态；难点是事件的实际时间顺序可能被“故障次序”打乱，若必须保留精确延迟，就要额外保存时间信息。

<div class="source">[1] 第 3 章 §3.4.5（印刷页 146–148）</div>

<!-- 讲师备注：对比并发法保留坏门，差分法保留相邻状态差；两者都不是简单的按位并行。 -->

---

# 近似方法用一次或少量无故障仿真估计覆盖率

<div class="grid-3">
<div class="metric"><strong>翻转覆盖</strong><p>统计曾经/双向翻转的线网比例；不能直接推出故障覆盖。</p></div>
<div class="metric"><strong>故障采样</strong><p>只仿真随机样本，用检测比例估计总体。</p></div>
<div class="metric"><strong>关键路径</strong><p>从主输出反向追踪当前向量下的关键线网。</p></div>
</div>

<div class="formula">
<span class="formula-label">故障采样的标准误</span>
σ<sub>fc</sub> ≈ √(FC(1−FC)/m)
</div>

若估计覆盖率 `FC=0.9`、样本 `m=1000`，则标准误约 `0.0095`；三倍标准误约 `±0.0285`。采样偏差比样本量更危险，必须随机且覆盖故障类型。

STAFAN 用无故障仿真统计 `C0_x`、`C1_x` 与敏化概率 `O_x`，估计 `d_x(SA0)=C1_x·O_x`，再预测 `N` 个向量至少检测一次的概率 `1−(1−d_x)^N`。它适合覆盖率估计，不足以替代精确诊断信息。

<div class="source">[1] 第 3 章 §3.4.8（印刷页 151–154）</div>

<!-- 讲师备注：复习概率区间；强调近似方法适合评分，不适合需要逐故障诊断结果的场景。 -->

---

# 五类故障仿真方法没有单一赢家

<div class="truth-table">

| 方法 | 主要共享对象 | 时间 | 空间 | 延迟/时序 |
|---|---|---:|---:|---|
| 串行 | 无 | 最慢 | 最低 | 直接、灵活 |
| 并行位/向量 | 机器字 | 受字宽限制 | 低 | 受按位模型限制 |
| 演绎 | 每个信号的故障集合 | 通常较快 | 列表不可预测 | 受限 |
| 并发 | 受影响坏门 | 变化相关 | 最高 | 较强 |
| 差分 | 相邻故障状态差 | 常较快 | 中等 | 事件顺序需处理 |

</div>

选择取决于信号变化密度、是否时序、是否含 `X/Z`、是否需要精确延迟，以及内存上限。多遍划分与分布式执行可控制内存和墙钟时间，但不会消除算法本身的信息损失。

<div class="callout question">如果目标是“快速估计一亿门设计的覆盖率”，与“定位一块芯片的失效候选”，应优先保留哪类信息？</div>

<div class="source">[1] 第 3 章 §3.4.6–§3.4.7（印刷页 148–151）</div>

<!-- 讲师备注：让学生从目标反推方法，而不是背算法名称；答案应围绕精确故障—向量对应关系。 -->

---

<!-- _class: divider -->

# 第 3 节

## 自动测试生成：从覆盖评价走向向量构造

本节目标：从随机基线推进到布尔差分、D 算法、PODEM、FAN，并扩展到时序与非固定型故障。

<div class="source">[1] 第 4 章 §4.1–§4.11（印刷页 161–248）</div>

<!-- 讲师备注：ATPG 是搜索问题，不是穷举所有输入；每一次决策都试图同时满足激励与传播。 -->

---

# 随机与穷举给出 ATPG 的基线复杂度

<div class="formula">
<span class="formula-label">单故障随机检测概率</span>
d<sub>f</sub> = |T<sub>f</sub>| / 2<sup>n</sup><br>
P(至少一次检测) = 1 − (1 − d<sub>f</sub>)<sup>N</sup>
</div>

8 输入 AND 的输出 `SA0` 只有在输入全为 1 时可激励，因此 `d_f=2⁻⁸=0.00390625`。若要求 `P≥0.99`：

<div class="formula">
N ≥ ⌈log(0.01) / log(1−0.00390625)⌉ = 1177
</div>

随机测试实现简单，但会重复向量，并可能长期漏掉 random-pattern-resistant 故障。穷举测试枚举 `2ⁿ` 个二元向量，对 n 小且需要所有组合故障时可靠；输入增多后成本指数上升。伪穷举可按输出锥分组，而非对全部输入直接穷举。

<div class="source">[1] 第 4 章 §4.2–§4.2.1（印刷页 163–166）</div>

<!-- 讲师备注：现场代值算 1177；区分单故障检测概率与整个测试集的质量。 -->

---

# 完整例题：布尔差分同时编码“激励”和“传播”

令 `F=x·y + y·z`，目标故障为 `y/0`。先求对 y 的布尔差分：

<div class="formula">
∂F/∂y = F(x,1,z) ⊕ F(x,0,z)<br>
= (x+z) ⊕ 0 = x ⊕ z
</div>

故障必须被激励，即 `y=1`，所以测试条件为：

<div class="formula">
y · (∂F/∂y) = y · (x ⊕ z) = x·y·z̄ + x̄·y·z = 1
</div>

<div class="callout">
两个完整测试向量是 <strong>xyz=110</strong> 与 <strong>011</strong>。它们分别验证两条敏化路径；若等式恒为 0，则故障不可测。
</div>

路径敏化可看成同一条件的结构化版本：激活故障点，沿选定路径把每个侧输入设为非控制值，再反向把内部目标值推导到主输入。

<div class="source">[1] 第 4 章 §4.3–§4.3.1（印刷页 166–169）</div>

<!-- 讲师备注：强调布尔差分与路径敏化不是两套目标，而是代数条件和结构搜索的两种表达。 -->

---

# D 算法用五值代数维护故障效应与待证明目标

`D=1/0` 表示无故障值为 1、故障值为 0；`D̄=0/1` 相反。`X` 是尚未赋值。

例题：`g1=a·b`，`g2=b·c`，`y=g1+g2`，目标 `b/0`。

<div class="flow">
<div class="flow-step">激励：b=1，写入 D/D̄</div>
<div class="flow-step">D-frontier：g1/g2</div>
<div class="flow-step">选 g1，侧输入 a=1</div>
<div class="flow-step">传播到 y，需 c=0</div>
<div class="flow-step">反向确认 a=1,c=0</div>
</div>

<div class="formula">
测试向量 (a,b,c) = (1,1,0)
</div>

- `D-frontier`：输出仍为 X，但至少一个输入含 D/D̄ 的门；它表示“下一步可能传播的位置”。
- `J-frontier`：输出已指定但尚未由输入证明的门；它表示待满足的蕴含目标。
- 冲突时撤销最近决策及其全部推导，再从另一分支搜索。

<div class="source">[1] 第 4 章 §4.4–§4.4.3（印刷页 169–182）</div>

<!-- 讲师备注：只板书一个完整回路；说明 D-frontier 负责向前传播，J-frontier 负责向后证明。 -->

---

# PODEM 把决策点限制在主输入

<div class="callout">
D 算法可能在内部节点决策；PODEM 只在主输入赋值，内部值由逻辑仿真/蕴含得到。因此内部赋值冲突转化为“故障未激励”或“D-frontier 为空”。
</div>

```text
PODEM_RECUR():
  if D/D̄ reaches a PO: return success
  objective = excite_fault() or propagate_one_D()
  pi_value = backtrace(objective)
  simulate_and_imply(pi_value)
  if PODEM_RECUR(): return success
  simulate_and_imply(opposite(pi_value))
  if PODEM_RECUR(): return success
  undo(pi_value)
  return failure
```

同例 `b/0`：目标 `b=1`，主输入决策 `b=1`；D 已激励。选 `g1` 传播，目标 `a=1`；再要求 `c=0` 为另一 OR 输入的非控制值，得到 `(1,1,0)`。

PODEM 的 `X-path` 检查要求存在一条从故障效应到主输出的未知值通路；没有这种通路时应立即回溯，而不是继续满足局部目标。

<div class="source">[1] 第 4 章 §4.4.4（印刷页 182–186）</div>

<!-- 讲师备注：说明 backtrace 只在未赋值路径上走；与 D 算法相比，决策空间从所有门缩小到 PI。 -->

---

<!-- _class: dense -->

# FAN 与逻辑蕴含进一步减少搜索和回溯

<div class="compare">
<div class="compare-panel">
<h3>FAN</h3>
<p>以 fanout-free region 的输出 headline 为决策边界；一次回溯多个目标，并用节点评分处理相关性。</p>
</div>
<div class="compare-panel highlight">
<h3>逻辑蕴含</h3>
<p>把局部赋值推出为全局约束，提前发现冲突，删去重复状态。</p>
</div>
</div>

对 AND 门 `z=a·b`：

<div class="formula">
z=1 ⇒ a=1 ∧ b=1<br>
a=0 ⇒ z=0<br>
(a=1 ∧ z=0) ⇒ b=0
</div>

静态蕴含在 ATPG 前一次性学习，动态蕴含在搜索中结合当前 D/D̄ 与已赋值传播。逆否命题可把 `a=1→z=1` 扩为 `z=0→a=0`；扩展反向蕴含再多步检查未证明的分支。

<div class="callout question">更强的蕴含一定会减少总运行时间吗？还要把学习、存储和查询成本计入。</div>

<div class="source">[1] 第 4 章 §4.4.5–§4.4.7（印刷页 186–194）</div>

<!-- 讲师备注：将 FAN 与蕴含分开讲，但指出两者共同目标是压缩搜索树并优先产生冲突。 -->

---

# 时序 ATPG 把状态机展开为有边界约束的时间帧

<div class="formula">
<span class="formula-label">时间帧展开</span>
… → 帧 −2 → 帧 −1 → 帧 0 → 帧 +1 → 帧 +2 → …
</div>

当前状态由前一帧的 PPO 驱动。为了激励故障，可能需要向前多个帧设置状态；为了观察故障，可能需要向后多个帧传播。先确定传播约束，再反向证明状态可达，可避免过早固定不可满足的状态。

<div class="callout">
五值代数不足以表达“无故障值与故障值分别可为不同状态集合”的边界。例如某侧输入只需 `a=1/X` 就能传播，强迫 `a=1/1` 会过度约束。时序搜索因此使用更强的九值语义，并结合不可达状态和已证明的状态转换序列剪枝。
</div>

门控时钟与多时钟域可先做功能等价变换，使触发器由统一测试时钟控制；变换必须保持功能并满足对应故障模型的观察条件。

<div class="source">[1] 第 4 章 §4.5（印刷页 194–200）</div>

<!-- 讲师备注：先讲帧间状态边界，再解释为什么无故障/故障值必须分开；MUX 变换只作理论。 -->

---

# 非固定型 ATPG 增加了“时间”或“双线约束”

<div class="grid-3">
<div class="metric"><strong>路径延迟</strong><p>两向量激活一条路径；robust 测试不受其他延迟故障影响，non-robust 依赖其他侧输入按时到达。</p></div>
<div class="metric"><strong>跳变故障</strong><p>节点 slow-to-rise/slow-to-fall；故障数与前缀规模线性相关，测试同样需要 `V₁,V₂`。</p></div>
<div class="metric"><strong>桥接故障</strong><p>先令两线取值不同，再按 AND/OR/支配模型预测汇聚值。</p></div>
</div>

<div class="formula">
<span class="formula-label">路径延迟的完整条件</span>
V₁ 激活路径起点；V₂ 产生跳变<br>
所有 off-input 在 V₂ 保持非控制值
</div>

应用方式有 launch-on-capture、launch-on-shift 和 enhanced-scan；前两者存储少但对第二向量有约束，后者覆盖更强但硬件与数据代价更高。

<div class="source">[1] 第 4 章 §4.10（印刷页 231–245）</div>

<!-- 讲师备注：从单向量判定切换到双向量判定；区分路径的累计延迟与节点跳变模型。 -->

---

<!-- _class: dense -->

# 小结：压缩测试集且保留覆盖

静态压缩求解集合覆盖：选择最少向量覆盖全部故障列；动态压缩填充 don't-care 位，让每条新向量覆盖更多故障。

<div class="formula">
<span class="formula-label">N 检测目标</span>
每个故障至少被 n 条不同向量检测；测试集规模通常随 n 近似线性增长
</div>

N 检测以不同传播条件重复观察同一故障，提高邻近缺陷命中率，但增加向量数与测试时间。

<div class="takeaways">
<ul>
<li>随机/穷举建立概率与规模基线；布尔差分和路径敏化给出条件。</li>
<li>D 算法、PODEM、FAN 与蕴含分别从表示、决策位置和搜索剪枝降低复杂度。</li>
<li>时序、延迟、桥接与 N 检测改变的是判定条件，不是“覆盖率数字”本身。</li>
<li>可测性来自模型、仿真和搜索的闭环，最终仍以向量能否区分故障响应为准。</li>
</ul>
</div>

<div class="callout question">若测试集已覆盖 99% 单固定型故障，却漏掉关键路径延迟，覆盖率还能否代表产品测试质量？</div>

<div class="source">[1] 第 4 章 §4.11（印刷页 246–248）；第 3 章 §3.5（印刷页 154）</div>

<!-- 讲师备注：用集合覆盖和 N 检测收束全章，并把问题引向后续章节的测试质量和延迟测试。 -->

---

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

<p class="small">文中 [1] 的章、节和印刷页码均指上述文献。</p>
