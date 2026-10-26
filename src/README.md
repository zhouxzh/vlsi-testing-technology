---
title: 超大规模集成电路测试基础
description: 超大规模集成电路测试基础课程主页
containerClass: course-home
sidebar: false
pageInfo: false
toc: false
---

# 超大规模集成电路测试基础

<section class="course-hero">
  <img class="course-hero__image" :src="$withBase('/images/eflash-tapeout.png')" alt="授课教师流片的 55 nm eFlash 存算一体 AI 芯片">
  <div class="course-hero__inner">
    <p class="course-kicker">VLSI Testing · 8 Theoretical Lectures</p>
    <h1>超大规模集成电路<br><span>测试基础</span></h1>
    <p class="course-hero__lead">从制造缺陷、故障模型和测试判据出发，系统学习故障仿真、ATPG、扫描设计、逻辑 BIST、测试压缩、诊断、存储器修复以及 SoC 与混合信号测试。课程按纯理论课堂组织，强调公式、算法、证据和适用边界。</p>
    <div class="course-facts">
      <span>24 学时</span>
      <span>8 次理论课</span>
      <span>每次 3 × 45 分钟</span>
      <span>8 套重构课件</span>
    </div>
    <div class="course-actions">
      <a class="primary" href="#course-chapters">查看八章内容</a>
      <a class="secondary" href="./plan/">查看教学计划</a>
    </div>
  </div>
  <span class="course-hero__source">图像：[2]，授课教师未公开流片资料</span>
</section>

<div class="course-band">
  <div class="course-band__inner">
    <div class="course-stat">
      <strong>8 × 3</strong>
      <span>八个理论专题，每次三个 45 分钟节次</span>
    </div>
    <div class="course-stat">
      <strong>24</strong>
      <span>纯理论课堂学时，不安排实验与上机</span>
    </div>
    <div class="course-stat">
      <strong>12 → 8</strong>
      <span>参考教材十二章重构为八条理论主线</span>
    </div>
  </div>
</div>

<section id="course-path" class="course-section">
  <p class="course-eyebrow">Course Path</p>
  <h2>从“制造缺陷为什么难以观察”走到“如何测试、诊断并限定结论”</h2>
  <p class="course-section__intro">课程沿着四个理论问题推进：怎样把物理缺陷表示为故障；怎样生成和评价测试；怎样通过 DFT 获得状态控制与观察能力；怎样把测试结果转化为诊断、修复和可靠性判断。</p>

  <div class="course-path">
<article>
      <b>01 · MODEL</b>
      <h3>缺陷与故障</h3>
      <p>固定型、晶体管、开路与短路、桥接、延迟、串扰、图形敏感和模拟故障。</p>
</article>
<article>
      <b>02 · GENERATE</b>
      <h3>仿真与 ATPG</h3>
      <p>多值仿真、故障模拟、布尔差分、路径敏化、D 算法、PODEM、FAN 与时序扩展。</p>
</article>
<article>
      <b>03 · DESIGN</b>
      <h3>DFT 与 BIST</h3>
      <p>可测性度量、扫描架构、测试压缩、响应分析、at-speed BIST 和核级访问。</p>
</article>
<article>
      <b>04 · DIAGNOSE</b>
      <h3>诊断与可靠性</h3>
      <p>故障字典、逻辑诊断、扫描链诊断、存储器修复、软错误与系统级测试边界。</p>
</article>
  </div>
</section>

<section id="chapter-01" class="course-chapter">
  <div class="course-chapter__inner">
    <div>
      <p class="course-eyebrow">Chapter 01 · Personal Tapeout Cases</p>
      <h2>从两张个人流片版图，进入真实的测试问题</h2>
      <p>55 nm eFlash 存算一体 AI 芯片把数字逻辑、存储阵列、混合信号读出和量产筛选放在同一颗芯片上；1200 V/50 A IGBT 与定制栅极驱动芯片则把连续参数、开关损耗、热工况和长期可靠性带入测试判据。</p>
      <ul class="course-chapter__list">
        <li>eFlash 案例：版图、流片、功能/参数测试、量产、良率与失效分析</li>
        <li>IGBT 案例：耐压、通态压降、阈值、开关时间/能量、电容与热可靠性</li>
        <li>把“版图存在”与“芯片已通过某组测试”严格区分</li>
        <li>用“已验证、材料声称、待核验”记录每一个案例结论</li>
      </ul>
      <div class="course-actions">
        <a class="primary" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/01-testing-fault-models-and-economics.html">播放第 1 章</a>
      </div>
    </div>
    <div class="course-case-pair">
      <figure>
        <img :src="$withBase('/images/eflash-tapeout.png')" alt="55 nm eFlash 存算一体 AI 芯片流片照片">
        <figcaption>个人流片：[2] 55 nm eFlash AI 芯片</figcaption>
      </figure>
      <figure>
        <img :src="$withBase('/images/igbt-device.png')" alt="教师流片的 IGBT 芯片版图与封装器件">
        <figcaption>个人流片：[3] IGBT 与功率器件</figcaption>
      </figure>
    </div>
  </div>
</section>

<section id="course-chapters" class="course-roadmap">
  <div class="course-section course-roadmap__inner">
    <p class="course-eyebrow">Eight Lectures</p>
    <h2>八章纯理论教学路线</h2>
    <p class="course-section__intro">每章对应一次 3 × 45 分钟课堂。以下列出章节简介、三个理论节次和直接播放入口。</p>

<article id="chapter-02" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 02</p>
        <div>
          <h3>可测性设计与扫描架构</h3>
          <p>从 SCOAP、概率和 RTL 可测性出发，说明测试点与扫描结构如何把内部状态变成可控制、可观察的访问路径。</p>
          <ul>
            <li>组合与时序可测性度量</li>
            <li>MUX-D、Clocked-scan 与 LSSD</li>
            <li>全扫描、部分扫描、扫描规则与成本</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/02-design-for-testability-and-scan.html">播放第 2 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>可测性度量与测试点</span></li>
          <li><span>扫描单元与扫描架构</span></li>
          <li><span>扫描规则、综合、验证与成本</span></li>
        </ol>
      </div>
</article>

<article id="chapter-03" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 03</p>
        <div>
          <h3>逻辑与故障仿真、测试生成</h3>
          <p>建立从逻辑求值、故障注入到测试向量生成的计算链，比较多类仿真和 ATPG 算法在适用条件与计算代价上的差别。</p>
          <ul>
            <li>多值逻辑、事件驱动与延迟模型</li>
            <li>并行、演绎、并发与差分故障仿真</li>
            <li>D 算法、PODEM、FAN 与时序/延迟 ATPG</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/03-simulation-and-atpg.html">播放第 3 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>逻辑模型与无故障仿真</span></li>
          <li><span>故障仿真与覆盖率评价</span></li>
          <li><span>确定性 ATPG 与测试集压缩</span></li>
        </ol>
      </div>
</article>

<article id="chapter-04" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 04</p>
        <div>
          <h3>逻辑内建自测试与测试压缩</h3>
          <p>讨论如何把测试图形生成、响应分析和判定移入芯片，并通过测试压缩降低外部数据量与测试时间。</p>
          <ul>
            <li>LFSR、加权/伪穷举图形与测试点</li>
            <li>MISR、签名混叠与 BILBO/STUMPS</li>
            <li>单/双捕获、X 处理与刺激/响应压缩</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/04-logic-bist-and-test-compression.html">播放第 4 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>BIST 生成器与响应分析器</span></li>
          <li><span>BIST 架构、捕获时序与覆盖增强</span></li>
          <li><span>测试刺激与响应压缩</span></li>
        </ol>
      </div>
</article>

<article id="chapter-05" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 05</p>
        <div>
          <h3>逻辑诊断</h3>
          <p>在测试只给出“通过/失败”之后，进一步利用响应差异、结构信息和测试条件缩小候选故障位置与机理。</p>
          <ul>
            <li>故障字典、因果分析和效应-原因分析</li>
            <li>结构裁剪、反向追踪与诊断 ATPG</li>
            <li>扫描链诊断与 BIST 区间/掩码诊断</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/05-logic-diagnosis.html">播放第 5 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>诊断指标与故障字典</span></li>
          <li><span>因果反演、结构分析和扫描链诊断</span></li>
          <li><span>BIST 诊断与芯片级定位</span></li>
        </ol>
      </div>
</article>

<article id="chapter-06" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 06</p>
        <div>
          <h3>存储器测试、诊断与内建自修复</h3>
          <p>针对规则存储阵列建立地址、状态、邻接和访问顺序相关的故障模型，并连接 MBIST、冗余分析与 BISR。</p>
          <ul>
            <li>RAM 固定型、跳变、耦合和图形敏感故障</li>
            <li>March、Checkerboard、GALPAT 与 RAMSES</li>
            <li>MBIST、诊断支持、冗余分析与修复率</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/06-memory-test-diagnosis-and-repair.html">播放第 6 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>存储器故障模型与 March 算法</span></li>
          <li><span>故障仿真、MBIST 与测试架构</span></li>
          <li><span>诊断、冗余分析与内建自修复</span></li>
        </ol>
      </div>
</article>

<article id="chapter-07" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 07</p>
        <div>
          <h3>边界扫描、核级与模拟/混合信号测试</h3>
          <p>把测试访问从芯片内部扩展到板级互连、可复用核和模拟边界，并建立数字协议与连续信号指标之间的联系。</p>
          <ul>
            <li>IEEE 1149.1、1149.6、BSDL 与板级互连</li>
            <li>IEEE 1500、TAM、CTL 与核级访问</li>
            <li>模拟故障、ADC/DAC、IEEE 1057 与 1149.4</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/07-boundary-scan-core-and-mixed-signal-testing.html">播放第 7 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>边界扫描与板级互连测试</span></li>
          <li><span>测试壳、核级访问与控制</span></li>
          <li><span>模拟与混合信号测试</span></li>
        </ol>
      </div>
</article>

<article id="chapter-08" class="chapter-entry">
      <div class="chapter-entry__main">
        <p class="chapter-entry__number">Chapter 08</p>
        <div>
          <h3>纳米测试议题与现代补充</h3>
          <p>把固定型测试扩展到延迟、完整性、工艺变异、软错误和高速接口，同时区分教材历史结论与现代标准状态。</p>
          <ul>
            <li>缺陷驱动测试、N 次检测与统计延迟</li>
            <li>FPGA、MEMS、高速 I/O 与 RF 测试</li>
            <li>IEEE 1838、1687、低功耗/在役测试与 AI 辅助测试</li>
          </ul>
          <a class="chapter-entry__action" href="https://zhouxzh.github.io/vlsi-testing-technology/presentation/08-nanometer-test-trends-and-high-speed-io.html">播放第 8 章</a>
        </div>
      </div>
      <div class="chapter-entry__outline">
        <h4>三个 45 分钟</h4>
        <ol>
          <li><span>纳米风险、延迟与可靠性</span></li>
          <li><span>FPGA、MEMS、高速 I/O 与 RF</span></li>
          <li><span>现代标准与全课程综合</span></li>
        </ol>
      </div>
</article>
  </div>
</section>

<section id="assessment" class="course-section course-assessment">
  <div class="course-assessment__grid">
    <div>
      <p class="course-eyebrow">Assessment</p>
      <h2>考核关注理论模型、推导和证据边界</h2>
      <p class="course-section__intro">课程不安排闭卷笔试。平时任务围绕故障建模、可测性计算、ATPG 推导、BIST/压缩分析和案例条件审查展开；期末专题要求独立组织一条完整的理论论证。</p>
    </div>
    <ol class="assessment-list">
      <li>
        <strong>40%</strong>
        <div>
          <h3>平时理论任务</h3>
          <p>课堂推导与章节任务，要求公式、假设、计算过程和结论边界一致。</p>
        </div>
      </li>
      <li>
        <strong>60%</strong>
        <div>
          <h3>期末专题与报告</h3>
          <p>选择一个数字、存储器、模拟或 SoC 测试问题，完成 10–12 分钟讲解和可复核书面报告。</p>
        </div>
      </li>
    </ol>
  </div>
</section>

<section id="resources" class="course-section course-resources">
  <p class="course-eyebrow">Resources</p>
  <h2>课程资料</h2>
  <div class="course-resource-list">
    <a href="./plan/">
      <strong>教学计划</strong>
      <span>八章、24 个纯理论节次、公式例题和章节证据</span>
      <i>查看计划</i>
    </a>
    <a href="#course-chapters">
      <strong>八章入口</strong>
      <span>章节目录、三节内容概览和逐章直接播放入口</span>
      <i>选择章节</i>
    </a>
    <a href="./references/">
      <strong>参考资料</strong>
      <span>经典教材、近年专著、开放课程、GitHub 工具和标准状态</span>
      <i>查看资料</i>
    </a>
  </div>
  <div class="course-reference">
    <strong>主要参考文献</strong>
    <p>[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., <i>VLSI Test Principles and Architectures: Design for Testability</i>. San Francisco, CA, USA: Morgan Kaufmann, 2006.<br>
    [2] 周贤中. <i>55 nm eFlash 存算一体 AI 芯片流片与测试技术报告</i>[R]. 广州: 广东工业大学, 2023. 未公开.<br>
    [3] 周贤中. <i>1200 V/50 A IGBT 与 0.5 μm 700 V BCD 栅极驱动芯片流片技术报告</i>[R]. 广州: 广东工业大学, 2024. 未公开.</p>
    <p>现代标准、开放课程和近年专著统一列于[参考资料](./references/)。</p>
  </div>
</section>
