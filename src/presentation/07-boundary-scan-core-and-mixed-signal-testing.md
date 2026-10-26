---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
header: '超大规模集成电路测试基础'
footer: '第 7 章 · 边界扫描、核级测试与混合信号测试'
---

<!-- _class: lead -->

# 边界扫描、核级测试与混合信号测试

## 从板级互连访问走向核级可见性与连续信号判据

<p class="small">3 × 45 分钟（评审估计）· [1] 第 10、11 章</p>

<!--
本章的主线是“如何到达被测对象并观察响应”：板级用边界扫描，核级用 1500 测试壳与 TAM，模拟/混合信号则必须改用连续波形和参数判据。
-->

---

# 核心问题与学习目标

<div class="grid-3"><div class="concept"><h3>板级</h3><p>封装和多层板使探针难以接触内部网络，如何控制并观察芯片间互连？</p></div><div class="concept"><h3>核级</h3><p>IP 核被深埋且来自不同供应方，如何隔离、接入并复用测试？</p></div><div class="concept"><h3>模拟</h3><p>信号连续、非线性且存在反馈，怎样把“失效”转成可测的规格偏差？</p></div></div>

<p class="small">学习证据：能解释寄存器路径、测试壳模式和转换器指标，并完成一个链路时间与量化误差推导。</p>

<!--
三个问题对应三节，不把边界扫描、1500 和模拟测试仅当术语表。后一节沿用前一节的“控制—观察—代价”框架。
-->

---

# 三个连续节次

<div class="grid-3"><div class="agenda-item"><h3>01 · IEEE 1149.1</h3><p>TAP、控制器、指令寄存器、数据寄存器、BSDL 与板级互连判据</p></div><div class="agenda-item"><h3>02 · 高速互连与核</h3><p>IEEE 1149.6、IEEE 1500 测试壳、TAM、CTL 与层次化接入</p></div><div class="agenda-item"><h3>03 · 模拟与混合信号</h3><p>连续信号故障、DC/AC 参数、ADC/DAC、IEEE 1057 与 IEEE 1149.4</p></div></div>

<p class="small">三节均为纯理论讲授，时间标注为内容容量评审估计，不是课堂实测。</p>

<!--
先说明连续关系：板级协议解决外部可达性，核级标准把同样的思想扩展到片内，模拟测试则改变信号模型和判据。
-->

---

<!-- _class: divider -->

# 第一节

## IEEE 1149.1：把边界 I/O 串成可访问的寄存器

<p>45 分钟（评审估计）· TAP、BSR、指令、BSDL 与板级互连</p>

<!--
本节只围绕一个闭环：如何把测试数据送入边界单元、更新到引脚，再从另一芯片捕获并移出。
-->

---

# 探针可达性在封装后迅速下降

<div class="compare"><div class="compare-panel"><h3>传统在线探针</h3><ul><li>依赖测试点、过孔和物理接触</li><li>多层板与细间距封装使探测困难</li><li>内部网络可能完全不可达</li></ul></div><div class="compare-panel highlight"><h3>边界扫描</h3><ul><li>在每个数字 I/O 边界放置扫描单元</li><li>芯片内形成边界扫描寄存器 BSR</li><li>板上多颗芯片可串成一条链路</li></ul></div></div>

<p class="small">[1] 正文采用 1149.1-2001。现行已核验版本为 IEEE Std 1149.1-2013 [2]，状态为 Inactive-Reserved；P1149.1 为 Active PAR。</p>

<!--
来源：[1] 第 10 章 第 558–562 页；标准状态见 [2]。1149.1-2013 于 2024-03-21 转为 Inactive-Reserved，P1149.1 为 Active PAR。强调这是针对板级互连访问的架构，不等于芯片内部所有逻辑自动可测。
-->

---

# 1149.1 的四类核心硬件

<div class="grid-2"><div class="concept"><h3>TAP 与控制器</h3><p>四根必需测试引脚加可选复位引脚；16 状态控制器解释 TMS 并产生捕获、移位、更新控制。</p></div><div class="concept"><h3>指令寄存器 IR</h3><p>两级结构保存当前指令，译码后选择数据寄存器与测试模式。</p></div><div class="concept"><h3>数据寄存器 DR</h3><p>包括必需 BSR、1 位 bypass，以及可选器件 ID 和设计专用寄存器。</p></div><div class="concept"><h3>边界扫描单元 BSC</h3><p>位于芯片 I/O 边界，使引脚值可捕获、移位与更新。</p></div></div>

<!--
来源：[1] 第 10 章 第 562–565 页。两条并行路径分别是 IR 路径和当前指令选中的 DR 路径，不能混为一个寄存器。
-->

---

# TAP 用四根必需信号建立独立串行协议

<table>
<tr><th>信号</th><th>方向</th><th>作用与采样边沿</th></tr>
<tr><td>TCK</td><td>输入</td><td>同步测试逻辑，独立于系统时钟</td></tr>
<tr><td>TMS</td><td>输入</td><td>在 TCK 上升沿决定控制器下一状态</td></tr>
<tr><td>TDI</td><td>输入</td><td>串行送入指令或数据，在 TCK 上升沿采样</td></tr>
<tr><td>TDO</td><td>输出</td><td>串行送出指令或响应，在 TCK 下降沿变化</td></tr>
<tr><td>TRST*</td><td>可选输入</td><td>异步复位测试逻辑，低有效</td></tr>
</table>

<div class="callout">TMS 与 TDI 通常由总线主控在 TCK 下降沿更新，避免在采样边沿附近改变。</div>

<!--
来源：[1] 第 10 章 第 564–565 页。TCK 独立使边界扫描可在系统时钟频点不一致时仍完成板级数据搬运。
-->

---

# TAP 控制器的 16 个状态分成三条路径

<div class="flow"><div class="flow-step">Test-Logic-Reset / Run-Test-Idle</div><div class="flow-step">DR 路径：Capture → Shift → Update</div><div class="flow-step">IR 路径：Capture → Shift → Update</div></div>

<p><strong>同步复位规则：</strong>任意状态连续五个 TCK 上升沿采样 TMS=1，回到 Test-Logic-Reset。</p>

<p><strong>数据路径：</strong>Capture-DR 并行装载状态；Shift-DR 串行移动；Update-DR 把新值送到并行输出。</p>

<div class="callout question">为什么指令必须在进入数据寄存器操作前完成 Update-IR？</div>

<!--
来源：[1] 第 10 章 第 567–569 页。答案：只有更新后的指令才能稳定选中正确的数据寄存器并产生一致控制信号。
-->

---

# 指令路径与数据路径共享 TAP，但用途不同

<div class="compare"><div class="compare-panel"><h3>IR 路径</h3><ol><li>Shift-IR 送入操作码</li><li>Update-IR 锁存并译码</li><li>选择 BSR、bypass 或其他 DR</li></ol></div><div class="compare-panel highlight"><h3>DR 路径</h3><ol><li>Capture-DR 采样当前状态</li><li>Shift-DR 移出响应并移入新图形</li><li>Update-DR 把图形施加到边界</li></ol></div></div>

<p class="small">标准典型时序中 Update 与另一芯片 Capture 之间可能存在固定 TCK 延迟，板级时序分析必须计入。</p>

<!--
来源：[1] 第 10 章 第 561、569–574 页。板级测试不是只数 BSR 位宽，还要计算控制器状态迁移和同步延迟。
-->

---

# 边界扫描单元用两级存储分离移位与施加

<div class="flow"><div class="flow-step">Capture：并行采样 IN</div><div class="flow-step">Shift：沿 SI→SO 串行移动</div><div class="flow-step">Update：R1→R2 输出</div></div>

<div class="compare"><div class="compare-panel"><h3>正常模式</h3><p>Mode=0，IN 透明传到 OUT，单元不干扰功能。</p></div><div class="compare-panel highlight"><h3>测试模式</h3><p>Mode=1，R2 保存的测试值驱动 OUT。</p></div></div>

<div class="callout">两级结构允许保持当前输出，同时继续移入下一图形；这是连续板级向量测试的关键。</div>

<!--
来源：[1] 第 10 章 第 565–566 页。capture 翻转 R1，update 才影响 R2；由此避免移位过程中直接扰动引脚。
-->

---

# 指令决定“选哪个寄存器”和“是否驱动引脚”

<table>
<tr><th>指令</th><th>主要行为</th><th>边界状态</th></tr>
<tr><td>BYPASS</td><td>芯片只在 TDI-TDO 间保留 1 位</td><td>不干扰功能</td></tr>
<tr><td>SAMPLE</td><td>捕获正常运行的引脚和内部边界值</td><td>透明</td></tr>
<tr><td>PRELOAD</td><td>把图形预装到边界单元并行输出级</td><td>尚未驱动测试模式</td></tr>
<tr><td>EXTEST</td><td>用 BSR 驱动片外网络并捕获接收值</td><td>隔离内部逻辑</td></tr>
</table>

<p class="small">[1] 还介绍 INTEST、RUNBIST、CLAMP、IDCODE、USERCODE 与 HIGHZ 等可选指令。</p>

<!--
来源：[1] 第 10 章 第 569–574 页。BYPASS/SAMPLE/PRELOAD/EXTEST 为本书所载四个必需指令；不要把它们与可选指令混淆。
-->

---

# BSDL 描述设计相关属性，而不是重写整个标准

<div class="compare"><div class="compare-panel"><h3>标准自动提供</h3><ul><li>TAP 的通用行为</li><li>必需指令语义</li><li>bypass 等公共结构</li></ul></div><div class="compare-panel highlight"><h3>BSDL 描述</h3><ul><li>BSR 长度与单元顺序</li><li>引脚映射与指令操作码</li><li>器件特有的寄存器属性</li></ul></div></div>

<p>BSDL 与 VHDL 兼容，使测试生成和系统集成可读取同一器件描述。</p>

<div class="callout warning">描述文件正确不等于板级拓扑正确；还需包络扫描链顺序、旁路状态和互连拓扑。</div>

<!--
来源：[1] 第 10 章 第 574–575 页。BSDL 是机器可读的边界扫描属性描述，不能替代板级网络和链路配置信息。
-->

---

# 完整例题：一条板级互连如何被判为通过

<div class="compare"><div class="compare-panel"><h3>配置</h3><p>Chip1 驱动 <code>NET_A</code>，Chip2 接收。两芯片 BSR 均为 8 位，另有 6 位中间旁路器件。</p></div><div class="compare-panel highlight"><h3>步骤</h3><ol><li>PRELOAD 驱动端安全值</li><li>EXTEST 驱动 1，接收端捕获</li><li>重复驱动 0 并捕获</li><li>捕获值 10 与期望 10 比较</li></ol></div></div>

<div class="formula"><span class="formula-label">链路长度</span>L = 8 + 6 + 8 = 22 bit</div>

<p>若捕获为 00、11 或与驱动稳态不符，分别提示固定、桥接或拓扑错误，但最终定位仍需拓扑与故障表。</p>

<!--
来源：[1] 第 10 章 第 570–573 页。这是教学推导而非实测结果。真实判定需处理同步延迟、双向引脚、外部负载和测试图形序列。
-->

---

<!-- _class: divider -->

# 第二节

## 高速互连与核级访问：从 1149.6 到 IEEE 1500

<p>45 分钟（评审估计）· 差分交流测试、测试壳、TAM、CTL 与层次化核</p>

<!--
从板级数字网络推进到交流耦合差分网络，再把相同边界隔离思想映射到 SOC 内部的核。
-->

---

# 交流耦合和差分容错暴露 1149.1 的边界

<div class="grid-2"><div class="concept"><h3>交流耦合</h3><p>串联电容隔断直流；EXTEST 施加的固定电平会衰减到未定义区域。</p></div><div class="concept"><h3>差分接收</h3><p>单端开路可能被偏置掩盖，普通接收边界单元仍读到“正确”逻辑值。</p></div><div class="concept"><h3>高速负载</h3><p>在两条高速输出上都放边界单元会引入不可接受的负载。</p></div><div class="concept"><h3>标准回应</h3><p>IEEE 1149.6 扩展 1149.1，检测边沿而非等待固定直流电平。</p></div></div>

<p class="small">[1] 写明 1149.6-2003。现行已核验版本为 IEEE Std 1149.6-2015 [3]，状态为 Inactive-Reserved；P1149.6 为 Active PAR。</p>

<!--
来源：[1] 第 10 章 第 579–580 页；标准状态见 [3]。1149.6-2015 于 2026-03-26 转为 Inactive-Reserved；P1149.6 为 Active PAR。不把当时“多 Gbps”表述扩展成对今天所有接口的结论。
-->

---

# 1149.6 用脉冲驱动与边沿接收建立判据

<div class="flow"><div class="flow-step">EXTEST_PULSE 驱动反向脉冲</div><div class="flow-step">模拟测试接收器检测边沿</div><div class="flow-step">迟滞存储记录有效变迁</div><div class="flow-step">Capture 读入结果</div></div>

<div class="compare"><div class="compare-panel"><h3>发送侧</h3><p>沿用 1149.1 移位/更新结构，在 AC 模式产生脉冲；EXTEST_TRAIN 可产生连续波形。</p></div><div class="compare-panel highlight"><h3>接收侧</h3><p>对差分输入分别放置测试接收器，用迟滞和延迟参考抑制噪声，并在下一向量前初始化记忆。</p></div></div>

<div class="callout question">为什么必须在每个测试向量前清空迟滞记忆？</div>

<!--
来源：[1] 第 10 章 第 580–584 页。否则连续两个同方向边沿无法区分是发生两次还是只发生一次。
-->

---

# SoC 核测试的问题从“引脚可达”变成“IP 边界可达”

<div class="grid-3"><div class="concept"><h3>技术混合</h3><p>逻辑、处理器、存储器和模拟核可能需要不同测试方法与仪器。</p></div><div class="concept"><h3>深度嵌入</h3><p>核被多层逻辑包围，必须有 TAM 提供控制与观察通路。</p></div><div class="concept"><h3>来源异构</h3><p>软核、硬核与不同供应方需要标准接口和可复用测试信息。</p></div></div>

<p>此外还要处理层次化核、内部时钟高于芯片引脚、外部 ATE 成本、测试时间与并行测试功耗。</p>

<!--
来源：[1] 第 10 章 第 585–587 页。核测试标准不负责定义核内部测试算法，而负责隔离、访问和模式控制的共同边界。
-->

---

# IEEE 1500 用测试壳包住每个核

<div class="compare"><div class="compare-panel"><h3>必需串行接口</h3><ul><li>WSI/WSO 数据路径</li><li>WRCK、WRSTN</li><li>SelectWIR、CaptureWR、ShiftWR、UpdateWR</li></ul></div><div class="compare-panel highlight"><h3>可选并行接口</h3><ul><li>WPI、WPO 与 WPC</li><li>直接连接多条扫描链或 BIST 接口</li><li>是相对 1149.1 提升核测试吞吐的关键</li></ul></div></div>

<p>壳内还有 WIR、WBY 与 WBR；[1] 中的 1500-2005 版本采用直接控制信号，没有复制一个 TAP 状态机。现行为 IEEE Std 1500-2022 [4]。</p>

<!--
来源：[1] 第 10 章 第 587–592 页；标准状态见 [4]。1500-2022 于 2022-10-12 发布并处于 Active Standard 状态。WSP 必需、WPP 可选；1500 标准的是核的测试接口和隔离协议，不规定核内部 DFT。
-->

---

# 测试壳的四种模式对应不同隔离方向

<table>
<tr><th>模式</th><th>控制对象</th><th>观察对象</th></tr>
<tr><td>Normal</td><td>功能路径透明</td><td>功能输出</td></tr>
<tr><td>Inward</td><td>核功能输入由 WBR 提供</td><td>核功能输出由 WBR 捕获</td></tr>
<tr><td>Outward</td><td>壳外功能输出与 WPO 由 WBR 驱动</td><td>壳外输入与 WPI 被捕获</td></tr>
<tr><td>Safe</td><td>输入与输出置非危害状态</td><td>避免其他核测试时误动作</td></tr>
</table>

<p class="small">WBR 支持 Shift、Capture、Update，另可支持 Transfer 与 Apply 事件。</p>

<!--
来源：[1] 第 10 章 第 592–594 页。模式选择必须保证未测核不被其他核的测试图形驱动到危险状态。
-->

---

# TAM 把传输宽度、测试时间与测试功耗放在同一优化中

<div class="formula"><span class="formula-label">单核理想传输时间</span>T<sub>core</sub> ≈ N<sub>patterns</sub> × (L<sub>in</sub> + L<sub>out</sub> + 1) / W<sub>TAM</sub></div>

<div class="grid-3"><div class="metric"><strong>多路复用</strong><h3>独占</h3><p>同一时刻一个核访问测试线，互连测试较弱。</p></div><div class="metric"><strong>菊花链</strong><h3>串行</h3><p>核顺序使用同一组线，需要并行旁路。</p></div><div class="metric"><strong>直接/本地控制</strong><h3>并行</h3><p>可降低时间但增加走线、控制逻辑与峰值功耗。</p></div></div>

<!--
公式是根据测试图形数量、输入/输出扫描长度和 TAM 位宽构造的理论下界，不含捕获、切换和调度开销，不是工具实测。
-->

---

# CTL 把测试意图与集成协议分开描述

<div class="compare"><div class="compare-panel"><h3>复用内容</h3><ul><li>信号、图形、时序与宏定义</li><li>核内部扫描链和测试模式</li><li>故障模型、图形目的与可实现覆盖信息</li></ul></div><div class="compare-panel highlight"><h3>集成时补充</h3><ul><li>测试壳实例与核端子映射</li><li>外部 UDL、TAM 与芯片连接</li><li>资源约束：链长、运行时间和测试功耗</li></ul></div></div>

<p class="small">[1] 将 CTL 描述为 STIL 的扩展，并用 Environment 与测试模式块组织测试信息。</p>

<!--
来源：[1] 第 10 章 第 601–603 页。CTL 是测试信息交换语言，不是测试生成算法，也不保证不同供应方的核内部实现相同。
-->

---

# 层次化核需要跨层控制，但最终仍回到可观察判据

<div class="flow"><div class="flow-step">顶层测试控制器</div><div class="flow-step">选择子核与测试模式</div><div class="flow-step">分配 TAM 和时钟</div><div class="flow-step">捕获响应并回溯定位</div></div>

<div class="compare"><div class="compare-panel"><h3>扁平化</h3><p>路由可能复杂，但访问路径统一。</p></div><div class="compare-panel highlight"><h3>层次化</h3><p>减少全局布线并提供局部控制，但跨层协议和可插拔性更难。</p></div></div>

<div class="callout">核级访问改善的是可控制性和可观察性；它不替代核内 ATPG、BIST 或故障模型。</div>

<!--
来源：[1] 第 10 章 第 606–611 页。层次化控制器负责配置和搬运，测试质量仍取决于测试图形和响应分析。
-->

---

<!-- _class: divider -->

# 第三节

## 模拟与混合信号测试：连续量没有单固定型故障的等价物

<p>45 分钟（评审估计）· 故障分类、DC/AC 参数、ADC/DAC 与 IEEE 1149.4</p>

<!--
前两节的数字边界值被连续信号取代。测试目标从“0/1 是否翻转”变为“在给定频率、负载和工作范围内，参数是否留在规格带内”。
-->

---

# 连续、非线性和反馈使模拟测试成为参数问题

<div class="grid-2"><div class="concept"><h3>连续信号</h3><p>除高低电平外还要测幅度、斜率、过冲、建立时间、带宽与相位。</p></div><div class="concept"><h3>全局非线性</h3><p>器件大信号模型非线性，只在小信号工作点附近可近似线性。</p></div><div class="concept"><h3>反馈歧义</h3><p>闭环增益偏离可能来自前向增益、反馈网络或负载变化。</p></div><div class="concept"><h3>因果复杂</h3><p>一个器件偏差可影响多个规格，同一规格偏差也可能来自多个器件。</p></div></div>

<div class="callout warning">模拟电路不存在被普遍接受的、像单固定型那样简单通用的故障模型。</div>

<!--
来源：[1] 第 11 章 第 619–623 页。连续信号意味着无限理想分辨率，工程上用失真、噪声和容差把“不可接受偏差”划出来。
-->

---

# 硬故障改变拓扑，软故障改变参数

<div class="compare"><div class="compare-panel"><h3>硬故障</h3><ul><li>开路</li><li>短路</li><li>多余器件</li><li>缺失器件</li></ul><p>通常显著改变电路，效应明显但可能造成灾难性失效。</p></div><div class="compare-panel highlight"><h3>软故障</h3><p><strong>参数故障：</strong>器件参数改变。</p><p><strong>偏差故障：</strong>整体规格改变，如增益、带宽。</p><p>低层偏差可作为上层参数故障继续传播。</p></div></div>

<p class="small">电阻性开路/短路可落在两者之间；[1] 给出的十倍阻值启发式只适用于其建模语境。</p>

<!--
来源：[1] 第 11 章 第 623–626 页。硬/软并非互斥分类，必须记录故障位置、阻值和可观察规格。
-->

---

# DC 参数测试在静态工作点建立可复核的因果链

<div class="grid-2"><div class="concept"><h3>常见对象</h3><p>输出额定电压/电流、输入失调电压/电流、输入输出阻抗、共模范围与电源灵敏度。</p></div><div class="concept"><h3>运算放大器示例</h3><p>开环增益、单位增益带宽、摆率、CMRR 与 PSRR 共同描述大信号和小信号行为。</p></div></div>

<div class="formula"><span class="formula-label">一阶运放关系</span>f<sub>t</sub> = A<sub>o</sub> · f<sub>3dB</sub></div>

<div class="formula"><span class="formula-label">摆率限制下的输入幅度</span>V<sub>i</sub> ≤ SR / (2π f<sub>t</sub>)</div>

<!--
来源：[1] 第 11 章 第 631–635 页。开环增益测量常利用高灵敏度分压；公式是理论关系，测试装置寄生会引入误差。
-->

---

# AC 参数测试关注频域、噪声与波形完整性

<table>
<tr><th>指标</th><th>定义视角</th><th>典型失效来源</th></tr>
<tr><td>SNR</td><td>信号功率 / 噪声功率</td><td>热噪声、电源与衬底噪声</td></tr>
<tr><td>THD</td><td>谐波功率相对基波</td><td>非线性、削顶、缺失码</td></tr>
<tr><td>SNDR</td><td>信号功率 / 噪声与失真功率</td><td>噪声和非线性共同作用</td></tr>
<tr><td>带宽/相位</td><td>频响在规定带内的幅度与相位</td><td>寄生、反馈与负载变化</td></tr>
</table>

<p class="small">时域响应采样点必须与至少一个规格相关联；否则“波形看起来对”不能构成可复核判据。</p>

<!--
来源：[1] 第 11 章 第 635–640 页。举例构造，不引用实测数据。正弦、阶跃、斜坡、三角、chirp 与多音信号分别施加不同频率激励。
-->

---

# 完整例题：10 位 ADC 的量化误差与理论 SNR

<div class="compare"><div class="compare-panel"><h3>已知条件</h3><p>转换范围 <code>V<sub>PP</sub>=1 V</code>，位数 <code>n=10</code>，输入满幅正弦。</p></div><div class="compare-panel highlight"><h3>计算</h3><p><code>LSB=1/(2<sup>10</sup>−1)≈0.977 mV</code></p><p><code>SNR=6.02n+1.76≈61.96 dB</code></p></div></div>

<div class="flow"><div class="flow-step">量化误差 ≤ 0.5 LSB</div><div class="flow-step">每增加 1 bit 约增加 6.02 dB</div><div class="flow-step">实际 SNDR 低于理论 SNR</div><div class="flow-step">由 SNDR 反推 ENOB</div></div>

<div class="formula"><span class="formula-label">有效位数</span>ENOB = (SNDR − 1.76) / 6.02</div>

<!--
来源：[1] 第 11 章 第 642–644、651–652 页。1 LSB 使用转换范围除以 2^n−1；理论 SNR 推导采用满幅正弦与量化噪声模型。这是公式例题，不是芯片实测。
-->

---

# ADC/DAC 规格把传输曲线分成静态与动态证据

<div class="grid-3"><div class="metric"><strong>Offset</strong><h3>偏移</h3><p>首个码对应的输入偏离理想位置。</p></div><div class="metric"><strong>DNL</strong><h3>码宽偏差</h3><p>相邻码转换间隔相对 1 LSB 的最大偏差。</p></div><div class="metric"><strong>INL</strong><h3>累计弯曲</h3><p>实际转换点相对理想直线或端点的最大偏差。</p></div></div>

<p><strong>动态指标：</strong>SNR、SNDR、THD、互调失真与 ENOB；缺失码表现为特定电平上的周期性误差和频域谐波。</p>

<div class="callout">[1] 声明其术语和方法与 IEEE Std 1057-1994 [5] 一致；该版本属于历史参考。</div>

<!--
来源：[1] 第 11 章 第 647–654 页。[1] 示例中 DNL=0.8 LSB、INL=2.0 LSB、14 位 ADC 的 SNDR=70 dB 得 ENOB≈11.34 bit；这些是书内示例。
-->

---

# IEEE 1057 将转换器测试拆成码箱、时域与频域方法

<div class="grid-2"><div class="concept"><h3>时域</h3><p>码箱计数、静态/动态转换电平、增益和偏移、线性误差与正弦曲线拟合。</p></div><div class="concept"><h3>频域</h3><p>对采样响应做变换，提取 SNR、SNDR、THD 与杂散，再计算有效位数。</p></div></div>

<div class="formula"><span class="formula-label">码宽定义</span>W<sub>k</sub> = T<sub>k+1</sub> − T<sub>k</sub></div>

<p>[1] 概括该历史版本覆盖 39 项规格与 17 类测试方法；测试记录长度、噪声与激励纯度共同决定估计不确定度。</p>

<!--
来源：[1] 第 11 章 第 652–658 页。不对“39 项/17 类”做现行标准承诺；它是对[1] 所介绍 IEEE 1057-1994 的概述。
-->

---

# IEEE 1149.4 给模拟引脚增加边界模块与测试总线

<div class="flow"><div class="flow-step">AT1/AT2 外部模拟测试端口</div><div class="flow-step">TBIC 接口切换</div><div class="flow-step">AB1/AB2 内部模拟总线</div><div class="flow-step">ABM 模拟边界模块</div></div>

<div class="compare"><div class="compare-panel"><h3>板级用途</h3><p>模拟互连开路/短路、简单与扩展互连、差分网络，以及片外无源元件测量。</p></div><div class="compare-panel highlight"><h3>核隔离</h3><p>CD 开关把模拟核与引脚隔离；比较器和 VH/VL/VTH 支持基本互连判据。</p></div></div>

<p class="small">[1] 介绍 1149.4-1999；课程以 IEEE Std 1149.4-2010 [6] 为规范入口，其核心是数字测试访问与模拟测试总线相结合。</p>

<!--
来源：[1] 第 11 章 第 658–666 页。模拟测试总线受寄生电容和信号完整性限制，内部测试是可选能力，不应描述成无代价的全面模拟观察。
-->

---

# 本讲结论：访问机制与信号判据必须同时成立

<ul class="takeaways">
<li>1149.1 把边界 I/O 变成可捕获、移位和更新的寄存器路径。</li>
<li>板级结论来自驱动值、接收值、拓扑和故障表的联合解释。</li>
<li>1149.6 用边沿与脉冲解决 AC 耦合差分网络，1500 把隔离扩展到核边界。</li>
<li>TAM/CTL 改善访问与复用，但不替代核内测试生成。</li>
<li>模拟测试用参数容差、波形和频域指标描述有限故障模型。</li>
<li>ADC/DAC 的 LSB、DNL/INL、SNR/SNDR 与 ENOB 必须连同测试条件报告。</li>
</ul>

<p class="small">素材来源：[1] 第 10 章 557–611 页、第 11 章 619–666 页；标准依据 [2]–[6]。</p>

<!--
口头思考题：如果一个 1500 核已能通过 TAM 访问，为什么仍需核供应方提供 CTL 与测试图形？因为访问机制只定义边界和协议，不包含核内部功能模型、故障模型与期望响应。
-->

---

<!-- _class: dense -->

# 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

[2] IEEE, *IEEE Standard for Test Access Port and Boundary-Scan Architecture*, IEEE Std 1149.1-2013, 2013.

[3] IEEE, *IEEE Standard for Boundary-Scan Testing of Advanced Digital Networks*, IEEE Std 1149.6-2015, 2015.

[4] IEEE, *IEEE Standard for Embedded Core Test*, IEEE Std 1500-2022, 2022.

[5] IEEE, *IEEE Standard for Digitizing Waveform Recorders*, IEEE Std 1057-1994, 1994.

[6] IEEE, *IEEE Standard for a Mixed-Signal Test Bus*, IEEE Std 1149.4-2010, 2010.
