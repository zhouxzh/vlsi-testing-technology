---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 6 章 · 存储器测试、诊断与内建自修复'
---

<!-- _class: lead -->

# 存储器测试、诊断与内建自修复

## 从 RAM 故障模型到 MBIST、冗余分析与 BISR

<div class="tag-row">
  <span class="tag">March</span>
  <span class="tag">RAMSES</span>
  <span class="tag">TAGS</span>
  <span class="tag">MBIST</span>
  <span class="tag">BIRA</span>
  <span class="tag">BISR</span>
</div>

<p class="small">3 × 45 分钟纯理论课 · [1] 第 8、9 章</p>

<span class="source">[1] 第 8、9 章；印刷页 461-556</span>

<!-- 讲师备注：本页建立测试、诊断、修复三级目标。测试判断存储阵列是否失败；诊断确定故障位置和类型；冗余分析与修复尝试把可修复的失败单元替换为备用资源。 -->

---

# 学习目标：从规则阵列构造可计算、可诊断、可修复的测试链

<ul class="check-list">
  <li><strong>形式化</strong> RAM 的地址译码、静态/动态功能故障和耦合故障。</li>
  <li><strong>推导</strong> MSCAN、Checkerboard、GALPAT 与 March 的激励条件和复杂度。</li>
  <li><strong>区分</strong> 字内/字间耦合、端口间字线短路与位线短路的测试条件。</li>
  <li><strong>解释</strong> RAMSES、TAGS、MBIST 如何把算法评价、生成和执行连接起来。</li>
  <li><strong>分析</strong> FSI、March syndrome、ESP、BIRA/BISR 与修复后成品率。</li>
</ul>

<div class="callout question">贯穿问题：一个算法检测到了故障，是否就有足够信息定位故障、分配备用资源并证明修复后成品率提高？</div>

<!-- 讲师备注：最后的问题区分检测覆盖与诊断分辨率，再连接到修复决策。后续每个算法都要问它激活什么条件、观察什么响应、留下什么位置信息。 -->

---

# 测试、诊断与修复构成存储器成品率提升的连续链条

<div class="flow">
  <div class="flow-step">故障模型</div>
  <div class="flow-step">测试算法</div>
  <div class="flow-step">诊断签名</div>
  <div class="flow-step">冗余分析</div>
  <div class="flow-step">地址重映射</div>
</div>

<div class="grid-3">
  <div class="concept">
    <h3>检测</h3>
    <p>用激励激活单元、译码器、读写电路和耦合条件，把错误传播到可观察输出。</p>
  </div>
  <div class="concept">
    <h3>诊断</h3>
    <p>记录出错地址、操作序号和响应 syndrome，区分可分辨的故障类型。</p>
  </div>
  <div class="concept">
    <h3>修复</h3>
    <p>根据错误位图和备用行列资源决定替换方案；无法修复时可进入降级使用或报废。</p>
  </div>
</div>

<div class="callout">存储器成品率不只由“坏单元数”决定，还由故障分布、备用资源组织、分析算法和修复限制共同决定。</div>

<span class="source">[1] 第 8 章，8.1 节，印刷页 461-463；第 9 章，9.1 节，印刷页 517-518</span>

<!-- 讲师备注：先建立完整链条，再进入模型细节。说明可修复性与可测试性不同：算法能报错不代表能决定选择备用行还是备用列。 -->

---

<!-- _class: divider -->

# 第一节 · 45 分钟

## RAM 故障模型定义测试算法必须制造和观察的条件

<p>本节从单元阵列与译码器故障出发，推导经典图形和 March 序列的复杂度与覆盖边界。</p>

<!-- 讲师备注：本节不以算法清单组织，而以“故障条件如何映射为地址、数据和时序操作”为主线。最后扩展到字导向与多端口存储器。 -->

---

# RAM 功能模型同时包含阵列、译码器和读写周边电路

<div class="grid-2">
  <div class="concept">
    <h3>地址译码故障</h3>
    <ul>
      <li>某个地址无法访问任何单元。</li>
      <li>某个地址同时访问多个单元。</li>
      <li>某个单元无法由任何地址访问。</li>
      <li>某个单元可由多个地址访问。</li>
    </ul>
  </div>
  <div class="concept">
    <h3>单元阵列与读写电路</h3>
    <ul>
      <li>阵列呈规则行列结构，便于按地址顺序遍历。</li>
      <li>读出放大器、写缓冲、总线等周边故障可抽象为单元阵列故障。</li>
      <li>测试必须比较写入背景与读回数据。</li>
      <li>访问顺序和邻近单元状态会改变故障是否被激活。</li>
    </ul>
  </div>
</div>

<div class="formula">
  <span class="formula-label">单元状态记号</span>
  0, 1, ↑ 上升沿, ↓ 下降沿, ∀ 任意操作；&lt;S/F&gt; 表示激活条件 S 导致故障值 F。
</div>

<span class="source">[1] 第 8 章，8.2.1 节，印刷页 463-465</span>

<!-- 讲师备注：地址译码故障的四类是后续定理和 March 元素设计的基础。说明“周边电路故障等价为单元阵列故障”是模型抽象，不代表物理位置相同。 -->

---

# 单单元故障由允许状态集合与故障值直接定义

| 故障 | 记号或条件 | 判定含义 |
|---|---|---|
| Stuck-at-0 | &lt;∀/0&gt; | 单元始终读为 0 |
| Stuck-at-1 | &lt;∀/1&gt; | 单元始终读为 1 |
| Stuck-open | SOF | 单元无法访问，例如字线断开 |
| Transition 0→1 | &lt;↑/0&gt; | 写入 1 后仍读为 0 |
| Transition 1→0 | &lt;↓/1&gt; | 写入 0 后仍读为 1 |
| Data retention | DRF | 指定保持时间内丢失逻辑值 |
| Read disturb | RDF | 重复读操作使单元状态翻转 |

<div class="callout">固定型故障只描述稳定读值；变迁故障描述从一个确定状态切换到另一个状态的失败；保持故障还引入了时间条件。</div>

<span class="source">[1] 第 8 章，8.2.1 节，印刷页 465</span>

<!-- 讲师备注：不要把所有故障都归约成固定型。SOF 与 RDF 涉及访问和读操作历史，DRF 涉及保持时间，测试图形必须显式制造这些条件。 -->

---

# 耦合故障把攻击单元的状态或跳变映射成受害单元错误

<div class="grid-3">
  <div class="concept">
    <h3>反相耦合 CFin</h3>
    <p>攻击单元发生指定跳变时，受害单元内容反相。</p>
    <p>条件可记为 &lt;↑/反相&gt; 或 &lt;↓/反相&gt;。</p>
  </div>
  <div class="concept">
    <h3>幂等耦合 CFid</h3>
    <p>攻击单元跳变把受害单元强制为确定值，例如 &lt;↑1/0&gt;。</p>
    <p>结果不取决于受害单元原值。</p>
  </div>
  <div class="concept">
    <h3>状态耦合 CFst</h3>
    <p>只要攻击单元处于指定状态，就把受害单元强制为某值，例如 &lt;0 0/1&gt;。</p>
    <p>不需要攻击单元发生跳变。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">m 单元耦合</span>
  &lt;S<sub>1</sub>, ..., S<sub>m-1</sub>, S<sub>m</sub>/F&gt;
</div>

<p>前 m−1 个状态描述攻击条件，最后一个单元是受害者，F 是错误值。完整模型还要记录攻击地址高于还是低于受害地址。</p>

<span class="source">[1] 第 8 章，8.2.1 节，印刷页 465；第 9 章，9.2 节，表 9.1，印刷页 519-520</span>

<!-- 讲师备注：强调 CFin、CFid、CFst 的激活条件不同。诊断时只知道“有耦合”还不够，还需要地址关系、攻击动作和受害值才能区分具体故障类型。 -->

---

# 动态故障把恢复时间、刷新时间和读出历史带入模型

<div class="compare">
  <div class="compare-panel">
    <h3>恢复类故障</h3>
    <ul>
      <li>读出放大器在长时间读/写同一值后饱和，短时间访问另一值失败。</li>
      <li>写恢复故障使地址译码恢复过慢，后一操作仍落在前一地址。</li>
      <li>故障条件依赖连续操作和操作间隔。</li>
    </ul>
  </div>
  <div class="compare-panel highlight">
    <h3>保持与平衡类故障</h3>
    <ul>
      <li>DRAM 单元在刷新周期内不能保持电荷，常影响整行或整列。</li>
      <li>刷新控制线固定故障破坏刷新机制。</li>
      <li>SRAM 过大的漏电也可能改变保持状态。</li>
      <li>位线电压不平衡会造成读出错误。</li>
    </ul>
  </div>
</div>

<div class="callout warning">动态故障不能仅由无等待的 March 序列证明已覆盖；操作顺序、暂停、刷新和访问时序必须进入故障激活条件。</div>

<span class="source">[1] 第 8 章，8.2.2 节，印刷页 465-466</span>

<!-- 讲师备注：说明静态算法与动态时序测试的边界。若测试不插入保持或恢复条件，算法可能覆盖静态模型但对动态故障没有证据。 -->

---

# 算法复杂度决定大规模阵列上哪些遍历仍可承受

| 算法族 | 典型复杂度 | 主要目标与边界 |
|---|---:|---|
| MSCAN / Zero-One | O(4N) | 全 0、全 1 背景，覆盖固定型，但不覆盖全部变迁和译码故障 |
| Checkerboard | O(4N) | 棋盘背景激活邻接泄漏、短路、保持问题 |
| GALPAT | O(4N²) | 基元单元与所有其他单元交替读取，覆盖强但适合小阵列特性分析 |
| Butterfly | O(5N logN) | 从 GALPAT 简化，主要面向地址故障和固定型故障 |
| MOVI | O(12N logN) | 既可作功能测试，也可观察最佳/最差访问时间 |
| March 族 | 线性 O(cN) | 通过升降序、读写组合覆盖固定型、变迁和部分耦合故障 |

<p>运行时间还受每次读写的固定时间、页模式、刷新和并行端口影响；复杂度阶数只决定随 N 增长的长期趋势。</p>

<span class="source">[1] 第 8 章，8.2.3 节，表 8.1，印刷页 466-468</span>

<!-- 讲师备注：不要按页背诵历史秒数。重点是线性与二次算法的规模差异，以及“某个算法覆盖什么故障”必须由模型分析或故障仿真证明。 -->

---

# 同一组读写次数可以形成完全不同的激活背景

<div class="grid-3">
  <div class="concept">
    <h3>MSCAN</h3>
    <p>写全 0、读全 0、写全 1、读全 1。</p>
    <p>复杂度 4N，可覆盖固定型；不能覆盖所有下降变迁和耦合故障。</p>
  </div>
  <div class="concept">
    <h3>Checkerboard</h3>
    <p>行列交错写入 0/1，停顿后读全阵列，再用互补背景重复。</p>
    <p>应按照实际版图建立物理棋盘，而不是只依据逻辑地址。</p>
  </div>
  <div class="concept">
    <h3>GALPAT</h3>
    <p>先写全 0；逐一把基元单元求补，并与其他每个单元交替读取。</p>
    <p>复杂度 O(4N²)，覆盖 AF、TF、CF、SAF 并可定位，但阵列大时难以生产测试。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">为什么物理棋盘重要</span>
  逻辑上相邻的地址可能不映射到版图上相邻的单元
</div>

<span class="source">[1] 第 8 章，8.2.3 节，图 8.1-8.3，印刷页 467-469</span>

<!-- 讲师备注：三种算法都进行全阵列读写，但数据背景和基元单元遍历不同。Checkerboard 的邻接语义依赖物理版图；GALPAT 的高覆盖以二次复杂度换取。 -->

---

# March 元素把地址方向与单元内连续操作组合成可复核序列

<div class="compare">
  <div class="compare-panel">
    <h3>元素语义</h3>
    <p>↑ 表示升序，↓ 表示降序，&amp; 表示方向无关。</p>
    <p>r0、r1 为期望读值，w0、w1 为写值。</p>
    <p>一个元素先对每个单元连续执行全部操作，再移动到下一地址。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>March C- 示例</h3>
    <p>&amp;w0；↑r0w1；↑r1w0；↓r0w1；↓r1w0；&amp;r0。</p>
    <p>每个单元共 10 次读/写操作，所以称为 10N 测试。</p>
    <p>[1] 说明其完整覆盖 SAF、非链接 AF/TF 和 CFin/CFid/CFst。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">操作计数</span>
  1 + 2 + 2 + 2 + 2 + 1 = 10，故复杂度为 O(10N)
</div>

<span class="source">[1] 第 8 章，8.2.4 节，表 8.2，印刷页 469-471</span>

<!-- 讲师备注：现场只展开 March C- 一条序列。强调顺序、期望值和立即写回三者不能拆散，否则变迁和耦合条件会改变。 -->

---

# 字导向存储器把同一操作用于整字，并增加字内耦合维度

<div class="compare">
  <div class="compare-panel">
    <h3>字内与字间耦合</h3>
    <p>同一字内两个位之间的耦合称为 intra-word coupling；不同字之间的耦合称为 inter-word coupling。</p>
    <p>若写操作总能覆盖字内耦合效果，该故障可视为冗余；若耦合更强，则必须测试。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>数据背景</h3>
    <p>4 位字的常见背景包括 0000、0101、0011，并可扩展到 0110、0001 等。</p>
    <p>多背景成倍增加测试时间，但只对额外字内故障提供有限增益。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">Cocktail-March 长度示例</span>
  [12 + 5 log<sub>2</sub>B]N
</div>

<p>B 为字长，N 为地址数。公式对应的目标故障集合与工艺/设计条件必须同时说明，不能脱离前提直接套用。</p>

<span class="source">[1] 第 8 章，8.2.5-8.2.6 节，图 8.5，表 8.10，印刷页 471-475、485-488</span>

<!-- 讲师备注：字导向测试不能把位导向的 N 简单换成字数就结束，因为字内耦合与数据背景仍可能未覆盖。多背景的收益和测试时间必须定量权衡。 -->

---

# 多端口 RAM 重复单端口算法不足以覆盖端口间短路

<div class="compare">
  <div class="compare-panel">
    <h3>端口间字线短路 WSF</h3>
    <p>一个端口访问单元时，另一端口可能同时访问同列或相邻列单元。</p>
    <p>读出结果可能表现为两个单元值的 AND 或 OR，取决于存储设计。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>端口间位线短路 BSF</h3>
    <p>不同端口地址可能同时选中同一列的一组单元。</p>
    <p>一个地址可能返回多个单元的组合值，形成多地址访问。</p>
  </div>
</div>

<div class="grid-2">
  <div class="concept">
    <h3>无版图信息</h3>
    <p>WSF 的功能故障规模可到 O(N³)，BSF 可到 O(N²)，因为需要枚举多个端口访问组合。</p>
  </div>
  <div class="concept">
    <h3>有地址扰乱与版图</h3>
    <p>规模可降到字线/位线数量级，约为 N<sup>1/2</sup> 到 N，取决于阵列长宽比。</p>
  </div>
</div>

<span class="source">[1] 第 8 章，8.2.7 节，图 8.6-8.8，印刷页 473-475</span>

<!-- 讲师备注：端口间故障不是两个端口各自固定型故障的并集。测试必须安排两个端口的并发或相邻访问，并考虑端口仲裁与 AND/OR 读出语义。 -->

---

<!-- _class: divider -->

# 第二节 · 45 分钟

## 故障仿真评价算法，TAGS 生成算法，MBIST 在片内执行算法

<p>本节把“算法是否正确”推进到“如何评价、如何生成、如何实现”三个连续问题。</p>

<!-- 讲师备注：先讲顺序仿真的复杂度，再说明 RAMSES 如何用描述符消除冗余，最后把 TAGS 生成的算法映射到 MBIST 架构和时序。 -->

---

# 顺序 RAM 故障仿真的复杂度来自故障数乘测试长度

<div class="flow">
  <div class="flow-step">注入一个故障</div>
  <div class="flow-step">施加测试序列</div>
  <div class="flow-step">比较响应</div>
  <div class="flow-step">记录已检测</div>
  <div class="flow-step">下一故障</div>
</div>

<div class="formula">
  <span class="formula-label">顺序仿真时间</span>
  T = k × s
</div>

<p>k 为故障数，s 为测试序列长度。对单元故障 k=O(N)；若考虑两单元耦合故障，k=O(N²)。March 测试 s=O(N)，所以顺序仿真可达到 O(N³)。</p>

<div class="compare">
  <div class="compare-panel">
    <h3>空间复杂度</h3>
    <p>主要由故障集合占据，两单元耦合故障下为 O(N²)。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>规则阵列的简化</h3>
    <p>小容量 RAM 的覆盖结果可按特定比例映射到更大 RAM，但迁移时必须控制覆盖率误差。</p>
  </div>
</div>

<span class="source">[1] 第 8 章，8.3.1 节，图 8.9，印刷页 476-477</span>

<!-- 讲师备注：顺序仿真直观但昂贵。规则结构允许通过小阵列仿真降低规模，但必须说明缩放条件和误差来源。 -->

---

# RAMSES 用故障描述符把故障模型与仿真引擎解耦

<div class="grid-2">
  <div class="concept">
    <h3>四个核心属性</h3>
    <p><strong>AGR：</strong>激活故障的操作或条件。</p>
    <p><strong>VTM：</strong>可观察故障效果的受害操作。</p>
    <p><strong>SPT：</strong>攻击者与受害者的可能位置关系。</p>
    <p><strong>RCV：</strong>清除或掩盖故障效果的恢复操作。</p>
  </div>
  <div class="concept">
    <h3>仿真引擎</h3>
    <p>按每个存储操作更新 W0、W1、UTR、DTR、LRV、LWV 等标志。</p>
    <p>若当前操作满足 AGR，则设置受害者标志并记录攻击地址。</p>
    <p>若满足 RCV，则清除故障效果；若满足 VTM，则标记已检测。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">输入与输出</span>
  存储器规格 + 测试算法 + 故障描述符 → 各模型故障覆盖率
</div>

<p>新增故障模型通常只需新增描述符，而无需重写通用仿真循环。</p>

<span class="source">[1] 第 8 章，8.3.2 节，图 8.10，表 8.6，印刷页 477-480</span>

<!-- 讲师备注：RAMSES 的核心是状态标志和描述符匹配，而不是实际把单元值改成故障值。这样能快速统计每个故障模型是否被激活和检测。 -->

---

# 完整推演：CFin 的上升跳变如何由标志状态标记为已检测

<div class="compare">
  <div class="compare-panel">
    <h3>初始条件</h3>
    <p>四个单元 0 至 3 初始全 0。</p>
    <p>故障描述符为 CFin(↑)：任意其他单元上升跳变会反相受害者。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>操作与状态</h3>
    <p>对单元 0 执行 R0 后再 W1：单元 0 成为攻击者，其他单元设置受害者标志并记录攻击地址 0。</p>
    <p>随后 R0 单元 1：检测到“单元 0 到单元 1”的耦合条件。</p>
    <p>对单元 1 执行 R0 后 W1：单元 1 也成为攻击者，并更新其他受害者记录。</p>
    <p>随后 R0 单元 2：可同时识别攻击者 0 和 1 到单元 2 的耦合。</p>
  </div>
</div>

<div class="callout">这是按[1] 故障描述符构造的说明性推演，不代表某个实际存储器的仿真数据。</div>

<span class="source">[1] 第 8 章，8.3.2 节，图 8.12，印刷页 479-480</span>

<!-- 讲师备注：沿“读-写-读”操作序列解释攻击者与受害者角色交换。故障是否检测由标志条件决定，不需要真的写坏单元值。 -->

---

# TAGS 扩展 March 模板，RAMSES 淘汰弱候选

<div class="flow">
  <div class="flow-step">模板 w</div>
  <div class="flow-step">增加 1N 操作</div>
  <div class="flow-step">赋地址与背景</div>
  <div class="flow-step">RAMSES 评价</div>
  <div class="flow-step">过滤后迭代</div>
</div>

<ol>
  <li>测试长度从 1N 开始，模板集合从单独的写操作开始。</li>
  <li>把长度增加 1N，在已有模板中有限位置插入读或写操作，得到新模板。</li>
  <li>为模板分配地址顺序和数据背景，形成具体 March 测试。</li>
  <li>用 RAMSES 计算目标故障覆盖率，删除无增益或被其他测试支配的候选。</li>
  <li>重复直到目标故障全部覆盖或达到长度上限。</li>
</ol>

<div class="callout warning">完整模板空间可呈指数增长。TAGS 的有效性依赖生成选项与过滤条件，不能把“遍历所有可能”当成实际生成策略。</div>

<span class="source">[1] 第 8 章，8.3.3 节，印刷页 480-482</span>

<!-- 讲师备注：TAGS 是一个迭代搜索框架，不是某一条固定算法。每一步都要把模板变成可仿真的具体测试，再用覆盖率与冗余性决定是否保留。 -->

---

# TAGS 示例显示测试增长往往以关键元素出现为条件

<div class="compare">
  <div class="compare-panel">
    <h3>长度与覆盖</h3>
    <p>[1] 给出的目标集合为 SAF、TF、AF、SOF、CFin、CFst、CFid、RDF。</p>
    <p>在该说明性示例中，随长度从 1N 增加到 12N，候选逐步获得覆盖；首次完整覆盖出现在 12N。</p>
    <p>某个故障可能长时间保持低覆盖，直到能检测 SOF 的特定读写元素出现。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>结果解释</h3>
    <p>更长测试不保证每个故障都按同一斜率改善。</p>
    <p>同一长度可能存在多个覆盖结构不同的算法，需要按目标故障优先级选择。</p>
    <p>长度达到目标集合的 100% 后仍可停止搜索。</p>
  </div>
</div>

<div class="callout question">若 8N 和 12N 算法都能满足当前产品的主要故障集合，为什么仍可能选择较短者？</div>

<span class="source">[1] 第 8 章，8.3.3 节，表 8.9，图 8.13-8.14，印刷页 482-486</span>

<!-- 讲师备注：说明覆盖曲线存在阈值效应。生产测试要综合测试时间、目标故障优先级和算法可执行性，不应机械追求最长序列。 -->

---

# MBIST 规格同时约束存储器接口、目标故障与片内资源

<div class="grid-2">
  <div class="concept">
    <h3>必须描述的对象</h3>
    <ul>
      <li>地址空间、字长、端口数、存储体与访问模式。</li>
      <li>时钟、建立/保持、访问延迟、刷新等时序参数。</li>
      <li>目标故障模型、测试算法和期望覆盖率。</li>
      <li>是否需要诊断、修复、老化或保持测试模式。</li>
    </ul>
  </div>
  <div class="concept">
    <h3>典型功能块</h3>
    <ul>
      <li>控制器：组织整体测试流程和模式。</li>
      <li>序列器：产生算法级访问命令和地址顺序。</li>
      <li>测试图形生成器：把命令转成物理时序、地址与数据。</li>
      <li>比较器与错误处理：检查输出并记录失败信息。</li>
    </ul>
  </div>
</div>

<div class="flow">
  <div class="flow-step">控制器</div>
  <div class="flow-step">序列器</div>
  <div class="flow-step">TPG</div>
  <div class="flow-step">RAM</div>
  <div class="flow-step">比较与签名</div>
</div>

<span class="source">[1] 第 8 章，8.4 节，印刷页 488-495；8.4.4 节，印刷页 501-503</span>

<!-- 讲师备注：MBIST 不是一条孤立算法，而是适配特定 RAM 接口的控制和数据通路。规格不清时，生成的时序可能满足逻辑功能却违反存储核心约束。 -->

---

# MBIST 将 March 命令翻译为物理访问波形

<div class="compare">
  <div class="compare-panel">
    <h3>一个 March 元素的组成</h3>
    <p>读/写命令 + 地址升序或降序 + 访问模式 + 数据背景。</p>
    <p>常用命令包括 ra、wa、rawa、rawa ra。</p>
    <p>访问模式可包括行扫描、列扫描、页模式列扫描和刷新。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>物理约束</h3>
    <p>同步 BIST 必须满足异步或同步 RAM 的地址、数据、使能与恢复时间。</p>
    <p>序列器输出在测试模式下应无毛刺；正常模式下应进入高阻，避免驱动冲突。</p>
    <p>时钟周期与每项操作占用的周期数共同决定实际测试时间。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">从算法到时间</span>
  T<sub>test</sub> ≈ 操作数 × 每次操作周期数 × 时钟周期 + 等待与刷新开销
</div>

<span class="source">[1] 第 8 章，8.4.1-8.4.3 节，印刷页 489-499</span>

<!-- 讲师备注：强调算法复杂度 N 只是操作数量级，真实测试时间还包含访问延迟、页模式、刷新和等待。正常模式下高阻是避免存储器与功能逻辑冲突的必要条件。 -->

---

# 多模式 MBIST 与共享结构把面积开销转为可配置性

<div class="grid-2">
  <div class="concept">
    <h3>典型模式</h3>
    <ul>
      <li>扫描测试：验证 BIST 控制逻辑。</li>
      <li>存储器 BIST：执行 March、保持和刷新测试。</li>
      <li>老化：持续激励阵列，筛选早期失效。</li>
      <li>时序测试：选择合适 BIST 时钟检查关键时序故障。</li>
    </ul>
  </div>
  <div class="concept">
    <h3>面积与共享</h3>
    <p>地址计数器只需随地址位宽线性增长，因此大容量存储器的 BIST 面积占比通常下降。</p>
    <p>多个 RAM 可共享控制器或序列器，但每个存储器仍需适配的数据通路和错误处理。</p>
  </div>
</div>

<p>[1] 历史示例：四个 8K×16 SRAM 的独立 BIST 合计 5616 门；共享控制器和序列器、保留四个 TPG 后为 3356 门，按门数计算约减少 40.2%。该数值只对应所列 0.35 μm 标准单元条件。</p>

<span class="source">[1] 第 8 章，8.4.3-8.4.4 节，表 8.16，印刷页 493-500、507-508</span>

<!-- 讲师备注：共享结构不是把四个 RAM 当成一个 RAM。控制器和序列器可以共用，但地址、数据、时序和错误路径仍要分别适配。历史门数不可直接外推到新工艺。 -->

---

<!-- _class: divider -->

# 第三节 · 45 分钟

## 诊断给出故障位置和类型，冗余分析决定能否修复

<p>本节从 FSI 与 March syndrome 出发，进入 ESP、BIRA/BISR、修复率和成品率模型。</p>

<!-- 讲师备注：首先区分可修复率和成品率。修复率高不代表最终成品率高，因为备用资源和 BISR 逻辑本身也占面积并可能有缺陷。 -->

---

# 诊断型 BIST 在检测之外记录故障位置、操作与响应

<div class="flow">
  <div class="flow-step">BIST 控制器</div>
  <div class="flow-step">TPG 产生 March</div>
  <div class="flow-step">FSI 捕获错误</div>
  <div class="flow-step">EOP 串行输出</div>
  <div class="flow-step">离线诊断</div>
</div>

<div class="compare">
  <div class="compare-panel">
    <h3>故障位置指示器 FSI</h3>
    <p>检测到错误后暂停测试，记录地址、操作序号与错误 syndrome，再通过扫描路径送出。</p>
    <p>传输后可继续测试，以收集同一芯片的更多错误信息。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>精确诊断模型</h3>
    <p>除 SAF、TF、SOF、CF 等类型，还记录攻击者地址 A 与受害者地址 V 的大小关系。</p>
    <p>这可以把同一耦合行为拆成 A&lt;V 与 A&gt;V 等更细类型。</p>
  </div>
</div>

<span class="source">[1] 第 9 章，9.1-9.3 节，印刷页 517-525</span>

<!-- 讲师备注：检测型 BIST 可以在首个错误处停止；诊断型 BIST 必须继续收集信息。FSI 的价值在于把片内压缩后的失败证据变成可离线分析的地址与 syndrome。 -->

---

# March syndrome 编码每次读操作的错误状态

<div class="compare">
  <div class="compare-panel">
    <h3>EOP 记录</h3>
    <p>地址位宽为 log<sub>2</sub>N；操作序号用有限位编码；syndrome 记录本次读出的错误数据。</p>
    <p>写操作通常只激活故障，读操作负责观察；写通结构可能在写路径上暴露额外错误。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>签名示例</h3>
    <p>将一次 March 测试的各读操作记为 E0 至 E8，正确为 0，错误为 1。</p>
    <p>若 CFin3 只由 E3 和 E5 检出，则 March signature 为 000101000。</p>
    <p>故障字典可只保存故障类型到签名行的映射，不必为每个单元建立独立大表。</p>
  </div>
</div>

<div class="callout">同一 syndrome 在不同测试算法下可能对应不同故障类型，因此签名必须连同测试序列一起解释。</div>

<span class="source">[1] 第 9 章，9.4 节，表 9.2，印刷页 524-528</span>

<!-- 讲师备注：March signature 是操作维度的错误向量，不是最终芯片序列号。说明读写操作的角色不同，以及字典为何能利用存储器规则结构压缩。 -->

---

# 可诊断率衡量故障类型能否被测试算法区分

<div class="formula">
  <span class="formula-label">可诊断率 DR</span>
  DR = 可区分故障类型数 / 可检测故障类型总数
</div>

<div class="compare">
  <div class="compare-panel">
    <h3>IFA9N 的说明性例子</h3>
    <p>[1] 给出的可区分类型数为 10，可检测故障类型总数为 27，因此 DR = 10/27 ≈ 37%。</p>
    <p>多个故障类型共享同一 signature，只能归入等价类。</p>
    <p>更长的诊断算法可以拆开更多等价类，但增加测试时间。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>MECA 式分析链</h3>
    <p>RAMSES 生成目标故障的覆盖率与字典。</p>
    <p>TAGS 选择满足覆盖率、可诊断率和长度要求的 March 序列。</p>
    <p>分析引擎把错误位图与签名字典比较，输出包含位置和类型的 fault bitmap。</p>
  </div>
</div>

<span class="source">[1] 第 9 章，9.4 节，图 9.10，印刷页 526-528</span>

<!-- 讲师备注：DR 高表示类型分得细，不表示每个实例位置都能唯一确定。等价类可能共享 signature；诊断质量取决于算法、故障集合和位置信息共同约束。 -->

---

# 冗余分析先用上界条件排除不可修复位图

<div class="grid-2">
  <div class="concept">
    <h3>基本记号</h3>
    <p>阵列含 M 行、N 列；有 r 个备用行、c 个备用列。</p>
    <p>F 为故障单元总数，F<sub>⊥</sub> 为不与其他故障共享行和列的正交故障数。</p>
    <p>分析过程中剩余可用备用行、列数为 r<sub>a</sub>、c<sub>a</sub>。</p>
  </div>
  <div class="concept">
    <h3>四个提前终止条件</h3>
    <p>F &gt; 2r<sub>a</sub>c<sub>a</sub>。</p>
    <p>F<sub>⊥</sub> &gt; r<sub>a</sub> + c<sub>a</sub>。</p>
    <p>当 c<sub>a</sub>=0 时，未覆盖故障行数 n<sub>r</sub>&gt;r<sub>a</sub>。</p>
    <p>当 r<sub>a</sub>=0 时，未覆盖故障列数 n<sub>c</sub>&gt;c<sub>a</sub>。</p>
  </div>
</div>

<div class="callout">
传统流程分为 must-repair 与 final-repair。完整搜索可求最优分配，但最优冗余分析问题具有 NP 完全性；大规模时常采用启发式或分支限界。
</div>

<span class="source">[1] 第 9 章，9.5.1 节，定义 9.1-9.3，印刷页 529-531</span>

<!-- 讲师备注：四个条件是保守上界和提前失败判据，不是所有可修复实例的充要分类。说明 must-repair 处理必须使用备用线的故障，final-repair 再处理剩余位图。 -->

---

# ESP 用行/列枢轴和阈值识别关键故障并延后正交单元

<div class="flow">
  <div class="flow-step">收集故障地址</div>
  <div class="flow-step">匹配枢轴</div>
  <div class="flow-step">标记 essential</div>
  <div class="flow-step">分配备用线</div>
  <div class="flow-step">处理正交故障</div>
</div>

<div class="compare">
  <div class="compare-panel">
    <h3>算法思想</h3>
    <p>维护 r+c 个行、列枢轴寄存器。新故障与已有行地址或列地址匹配时，把对应枢轴标记为 essential。</p>
    <p>示例采用阈值 E<sub>th</sub>=2，即第二个共享同一行或列的故障触发必要修复。</p>
    <p>正交故障可以行修复或列修复，因此放在最后，避免过早消耗更灵活的备用资源。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>完整说明性例子</h3>
    <p>故障地址依次为 (1,0)、(1,6)、(2,4)、(3,4)、(5,1)、(5,2)、(5,4)、(5,6)、(5,7)、(7,3)。</p>
    <p>行 1、行 5 和列 4 成为 essential；随后分配备用行 1、行 5 与备用列 4。</p>
    <p>剩余正交故障 (7,3) 再用一个备用列修复。</p>
  </div>
</div>

<span class="source">[1] 第 9 章，9.5.2 节，例 9.1，图 9.12-9.14，印刷页 531-534</span>

<!-- 讲师备注：逐步检查每个故障与已有枢轴的行/列匹配，展示为何正交故障最后处理。结果依赖给定备用资源数量；本例是[1] 的说明性位图。 -->

---

# 备用行列的组织方式决定修复率、访问延迟与 BIRA 面积

<div class="compare">
  <div class="compare-panel">
    <h3>行列与列组</h3>
    <p>备用行可按整行替换；备用列可划分为 spare column groups。</p>
    <p>每组列还可按行地址高位分成多个 segment，用较小粒度替换局部故障。</p>
    <p>分段越多，列资源利用率通常越高，但需要更多地址存储和控制逻辑。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>BIRA 与 BISR 流程</h3>
    <p>上电后先测试备用存储器，再测试主存储器。</p>
    <p>BIST 报错后 BIRA 执行冗余分配；完成后继续测试。</p>
    <p>正常模式下地址比较器把故障地址映射到备用资源。</p>
    <p>无可用备用行时可导出屏蔽地址，系统以降级容量继续工作。</p>
  </div>
</div>

<div class="formula">
  <span class="formula-label">软修复</span>
  每次上电重新执行 BIST、BIRA 与地址重映射
</div>

<span class="source">[1] 第 9 章，9.6.1-9.6.2 节，图 9.17-9.19，印刷页 537-541</span>

<!-- 讲师备注：修复结构不是无限资源。列组和分段改变可修复故障形状；软修复每次上电重建映射，省去一次性激光修复但增加启动流程。 -->

---

# 修复率不等于成品率：还要扣除 BISR 面积成本

<div class="formula">
  <span class="formula-label">基础泊松成品率</span>
  Y<sub>m</sub> = exp(-A<sub>m</sub>D<sub>m</sub>)
</div>

<div class="compare">
  <div class="compare-panel">
    <h3>修复率与修复后存储成品率</h3>
    <p>RR = 成功修复的坏存储块数 / 全部坏存储块数。</p>
    <div class="formula">Y'<sub>m</sub> = Y<sub>m</sub> + (1-Y<sub>m</sub>)RR</div>
    <p>Y'<sub>m</sub> 只描述存储阵列在修复后的成品率。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>加入 BISR 逻辑后的成品率</h3>
    <p>BISR 逻辑自身成品率可写为 Y<sub>bisr</sub> = exp(-A<sub>l</sub>D<sub>l</sub>)。</p>
    <div class="formula">Y<sub>mbisr</sub> = [Y<sub>m</sub> + (1-Y<sub>m</sub>)RR] · Y<sub>bisr</sub></div>
    <p>简单模块独立模型下，芯片成品率是存储部分与 BISR 部分成品率之积。</p>
  </div>
</div>

<span class="source">[1] 第 9 章，9.6.6 节，印刷页 548-551</span>

<!-- 讲师备注：强调 RR 的分母是坏存储块，不是全部芯片。修复提高存储部分成品率，但 BISR 面积和备用资源也可能降低基础成品率，最终收益必须用乘积模型评估。 -->

---

# 完整推导：4.6% 面积开销下的修复收益教学算例

<div class="compare">
  <div class="compare-panel">
    <h3>[1] 示例条件</h3>
    <p>设 BISR 面积 A<sub>l</sub>=0.046A<sub>m</sub>，且存储缺陷密度 D<sub>m</sub>=2D<sub>l</sub>。</p>
    <p>则 Y<sub>bisr</sub>=exp(-0.023A<sub>m</sub>D<sub>m</sub>)=Y<sub>m</sub><sup>0.023</sup>。</p>
    <p>[1] 未给出固定 RR；下面数值只用于展示公式行为。</p>
  </div>
  <div class="compare-panel highlight">
    <h3>教学数值：取 Y<sub>m</sub>=0.7</h3>
    <p>Y<sub>bisr</sub>≈0.9918。</p>
    <p>RR=0 时，Y<sub>mbisr</sub>=0.7×0.9918≈0.694。</p>
    <p>RR=0.8 时，修复后存储部分为 0.94；Y<sub>mbisr</sub>≈0.932。</p>
    <p>RR=1 时，Y<sub>mbisr</sub>=Y<sub>bisr</sub>≈0.992。</p>
  </div>
</div>

<p>这组计算说明：只有修复带来的成品率增益超过 BISR 面积代价，修复才在简单模型下产生正收益。真实分析还需缺陷聚类、备用资源缺陷和多模块成品率模型。</p>

<span class="source">[1] 第 9 章，9.6.6 节，印刷页 550-551；本页 Y<sub>m</sub>=0.7 数值为教学计算</span>

<!-- 讲师备注：明确指出 Y_m=0.7 是教学假设，不是[1] 或实际产品结果。展示从公式到成品率的乘法链，避免把修复率直接误称为成品率。 -->

---

# 小结：存储器测试的优势来自规则性，难点来自故障条件与修复代价

<ol class="takeaways">
  <li>RAM 故障由单元状态、跳变、地址关系、邻接图形和访问时间共同定义，固定型只是其中一类。</li>
  <li>March 提供线性复杂度的结构化遍历，字导向与多端口又引入数据背景和端口并发条件。</li>
  <li>RAMSES 用描述符评价算法，TAGS 用仿真驱动模板搜索，MBIST 把算法变成可执行的片内控制与时序。</li>
  <li>FSI 与 March syndrome 把检测推进到故障位置和类型；ESP 等 BIRA 方法把错误位图变成备用资源分配。</li>
  <li>BISR 的最终价值要用“修复后存储成品率 × BISR 自身成品率”评价，不能只看修复率。</li>
</ol>

<p class="small">理论依据：[1] 第 8 章，8.1-8.5 节，印刷页 461-509；第 9 章，9.1-9.7 节，印刷页 517-551。课件只做概念、公式和说明性例题整理，不复制[1] 图表或长段正文。</p>

<span class="source">[1] 第 8、9 章；印刷页 461-556</span>

<!-- 讲师备注：最后回收五条主线。下一条课程主线将把存储器看作核或 IP，讨论边界扫描、核级测试存取和模拟混合信号测试如何扩展这些证据链。 -->

---

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

<p class="small">文中 [1] 的章、节和印刷页码均指上述文献。</p>
