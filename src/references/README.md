---
title: 参考资料与开放资源
description: 面向 8 章、24 学时纯理论课程的最新图书、开放课程、开源工具与标准状态
sidebar: false
toc: true
---

# 参考资料与开放资源

本页服务于“超大规模集成电路测试基础”8 章、24 学时纯理论课程。所有来源均于 **2026-10-26** 通过出版社页面、DOI 元数据 API、IEEE Standards Association 页面、GitHub API 或仓库文档实际访问并核对。页面只提供书目、链接和简评，不复制或镜像教材、论文和标准正文。

## 选材结论

- 2020 年以后出现了若干质量较高的 **DFT、测试可测性预测和机器学习辅助测试专著或专著章节**，但没有检索到一部可替代 Wang、Wu、Wen 2006 年综合教材的同等级新教材。
- Wang、Wu、Wen 的 *VLSI Test Principles and Architectures: Design for Testability* 出版于 2006 年，仍是结构完整、章节覆盖面最接近本课程主线的经典教材，但**不是最新教材**。
- 2026 年确有更新的开放电子书，测试内容覆盖面却较宽泛。它适合用来核对近期术语和主题变化，不宜单独承担 8 章的专业深度。
- 公开可核验的完整课程主要是较早的 Agrawal 课程档案，而不是 2020 年以后的新开课程。它们适合讲义结构、推导顺序和习题参考，不应标为“最新课程”。
- 标准状态必须按日期写明。IEEE SA 的 **Inactive-Reserved**、**Active PAR** 和 **Active Standard** 是行政状态，不能互相替代，也不能把在研 PAR 写成已发布标准。

## 近期教材与专著

### 2026 年开放电子书

**Prabu C、Anithalakshmi V、Vishnu S**，*Fundamentals of VLSI Design: Principles, CMOS Technology, Fabrication Processes, Layout Design and Testing Methodologies*，Zenodo，2026。

- 官方记录：[DOI 10.5281/zenodo.20688122](https://doi.org/10.5281/zenodo.20688122)。
- 获取状态：开放获取，DataCite 记录标明 CC BY 4.0，电子书类型为 Book。
- 适用章节：第 1、2、5、7 章的背景和术语更新线索。
- 核实范围：已核对 DataCite 书目元数据和摘要，并用 OpenAlex 独立交叉索引；未把作者自述当作教学质量评价。
- 简评：这是目前找到的最新开放“电子书”，内容横跨 VLSI 设计、工艺、版图和测试。测试部分不是专门的 ATPG、BIST、存储器测试或 SoC 测试专著，元数据也未提供同行评审信息，因此应作补充读物，而不是主教材。

### 2021 年 DFT、调试与可靠性专著

**Sebastian Huhn、Rolf Drechsler**，*Design for Testability, Debug and Reliability: Next Generation Measures Using Formal Techniques*，Springer，2021。

- 官方记录：[DOI 10.1007/978-3-030-69209-4](https://doi.org/10.1007/978-3-030-69209-4)。
- 获取状态：非开放获取，出版社电子版需购买或通过机构订阅。
- 适用章节：第 5、6、8 章，尤其适合讲扫描访问、测试压缩、SAT 重定向和可靠性。
- 核实范围：Crossref 书目记录列出 9 个章节，包括形式化技术、嵌入压缩的 TAP 控制器、SAT 优化重定向和多通道低引脚测试压缩。
- 简评：篇幅集中、专题性强，适合作为第 5、6、8 章的研究型补充；不覆盖故障建模、组合 ATPG、存储器算法等课程全貌。

### 2022 年机器学习与 EDA 专著

**Haoxing Ren、Jiang Hu 编**，*Machine Learning Applications in Electronic Design Automation*，Springer，2022。

- 官方记录：[图书 DOI 10.1007/978-3-031-13074-8](https://doi.org/10.1007/978-3-031-13074-8)。
- 直接相关章节：Yuzhe Ma，[*Machine Learning for Testability Prediction*](https://doi.org/10.1007/978-3-031-13074-8_6)，第 151–180 页。
- 获取状态：非开放获取；章节摘要和元数据开放，电子版需购买或机构订阅。
- 适用章节：第 2 章的可测性预测，以及第 3、5 章的机器学习扩展讨论。
- 核实范围：Crossref 已核对书名、编者、章节作者、页码、出版年份和章节参考文献。
- 简评：适合把 SCOAP/COP 的规则计算与数据驱动预测联系起来。机器学习部分应明确训练集、泛化边界和可解释性，不能替代第 3 章的 ATPG 可判定逻辑。

### 2023 年机器学习与 VLSI 设计专著

**Abhishek Kumar、Suman Lata Tripathi、K. Srinivasa Rao 编**，*Machine Learning Techniques for VLSI Chip Design*，Wiley，2023。

- 出版社页面：[Wiley 产品页](https://www.wiley.com/en-us/machine-learning-techniques-for-vlsi-chip-design-p-9781119910497)。
- 图书 DOI：[10.1002/9781119910497](https://doi.org/10.1002/9781119910497)。
- 直接相关章节：Jyoti Kandpal，[*Machine Learning–Based VLSI Test and Verification*](https://doi.org/10.1002/9781119910497.ch3)，第 33–50 页。
- 获取状态：非开放获取；有印刷版、O-Book 和机构访问形式。
- 适用章节：第 3、5 章，以及第 8 章的测试数据分析与 AI 辅助测试专题。
- 核实范围：Wiley 页面核对了题名、编者、ISBN、页数和出版月份；Crossref 核对了章节页码及作者。
- 简评：全书面向机器学习与 VLSI 的交叉应用，只有部分章节直接讨论测试。适合选读，不应把书中预测效果当作本课程工具链的实测结论。

### 2020 年机器学习辅助数字测试综述

**Manjari Pradhan、Bhargab B. Bhattacharya**，*A survey of digital circuit testing in the light of machine learning*，*WIREs Data Mining and Knowledge Discovery*，11(1)，2020 年在线发表。

- 官方记录：[DOI 10.1002/widm.1360](https://doi.org/10.1002/widm.1360)。
- 获取状态：非开放获取。
- 适用章节：第 2、3、4 章的扩展阅读。
- 核实范围：Crossref 显示该综述含 71 条参考文献，摘要明确覆盖数字逻辑测试与诊断中的机器学习进展。
- 简评：适合建立机器学习辅助测试的分类框架。综述不是教材，不能替代算法推导、复杂度分析和传统故障覆盖率定义。

### 2006 年经典综合教材

**Laung-Terng Wang、Cheng-Wen Wu、Xiaoqing Wen**，*VLSI Test Principles and Architectures: Design for Testability*，Elsevier，2006。

- 出版社页面：[Elsevier Shop](https://shop.elsevier.com/books/vlsi-test-principles-and-architectures/wang/978-0-12-370597-6)。
- 图书 DOI：[10.1016/B978-0-12-370597-6.X5000-8](https://doi.org/10.1016/B978-0-12-370597-6.X5000-8)。
- 获取状态：非开放获取；出版社将其列为该书的“Latest edition”，但这只表示该书没有后续版本，不表示 2006 年出版时间较新。
- 适用章节：第 1 至第 8 章均可作为主参考。出版社目录列出 DFT、逻辑与故障仿真、测试生成、逻辑 BIST、测试压缩、逻辑诊断、存储器测试与修复、边界扫描和基于核的测试等 12 章。
- 简评：覆盖面和组织方式与现有 8 章最接近，仍是主参考书。使用时应在第 8 章补充 2022 年版 IEEE 1500、2019 年版 IEEE 1838 和近期 SoC/3D 测试材料。

### 授课教师未公开流片资料

**周贤中**，*55 nm eFlash 存算一体 AI 芯片流片与测试技术报告*，广东工业大学，2023。未公开课程资料。

**周贤中**，*1200 V/50 A IGBT 与 0.5 μm 700 V BCD 栅极驱动芯片流片技术报告*，广东工业大学，2024。未公开课程资料。

- 公开范围：课程网站只展示教师允许使用的器件照片和理论化后的案例讨论，不提供原始 PPT、Word、版图源文件、测试向量、原始测量记录或良率数据。
- 证据边界：材料未同时给出的结温、栅压、负载、脉宽、样本数、判定阈值和统计数据，不作为已验证结论。
- 引用用途：仅用于第一章说明从个人流片经历进入功能、参数、量产、可靠性和失效分析问题。

## 开放课程与讲义

### IIT Delhi 短期 VLSI Testing 课程

**Vishwani D. Agrawal**，*EEV834 Special Module in VLSI Testing*，IIT Delhi，2013。

- 官方课程页：[IIT Delhi VLSI Testing course archive](https://www.eng.auburn.edu/~vagrawal/COURSE/IITD_Fall13_Test/course.html)。
- 开放状态：课程页公开提供 17 次课的 PPT、课程大纲和作业；页面未声明统一开放许可证，使用和再分发时应遵守作者及学校条款。
- 适用章节：第 1 至第 8 章；其中故障建模、故障仿真、组合/时序 ATPG、可测性分析、扫描与 BIST 的对应最直接。
- 简评：篇幅紧凑，适合作为 24 学时理论课的讲授节奏模板。课程时间为 2013 年，不属于近期新开课。

### Auburn 完整学期 VLSI Testing 课程

**Vishwani D. Agrawal**，*ELEC7250-001 VLSI Testing*，Auburn University，2006。

- 官方课程页：[Auburn ELEC7250 course archive](https://www.eng.auburn.edu/~vagrawal/COURSE/E7250_06/course.html)。
- 开放状态：课程页公开提供 22 次课讲义和 10 组作业，部分附答案；页面未声明统一开放许可证。
- 适用章节：第 1 至第 8 章，尤其适合故障建模、故障仿真、可测性度量、组合 ATPG、扫描、BIST、存储器测试和系统测试。
- 简评：这是更完整的旧课程档案，与本课程的知识链高度一致，可作为讲义结构参考。其内容和教材版本均较早，不应标为“最新开放课程”。

本轮没有找到一部在 2020 年以后开课、可直接公开访问完整讲义、且能完整覆盖本课程 8 章的大学课程。上述两套课程因此只承担**经典教学结构参考**，近期材料由专著章节、综述、标准页面和开源工具补足。

## 开源工具与仓库

下列“最近推送”由 GitHub API 于 2026-10-26 核对。近期提交只能说明仓库仍有活动，不能证明算法正确、结果可复现或适合签核生产。

### OpenROAD DFT

- 仓库：[The-OpenROAD-Project/OpenROAD](https://github.com/The-OpenROAD-Project/OpenROAD)。
- 模块文档：[DFT: Design for Testing](https://github.com/The-OpenROAD-Project/OpenROAD/blob/master/src/dft/README.md)。
- 许可证与活跃度：BSD-3-Clause；仓库最近推送为 2026-10-26。
- 适用章节：第 2 章。
- 简评：支持触发器替换为扫描单元、扫描链规划与连接，并可设置最大链长、链数及时钟混合方式。模块文档明确标注扫描优化尚未实现、只支持单比特单元且不能指定已有扫描端口，因此适合展示扫描综合流程，不是完整商用 DFT 流程。

### FAN ATPG

- 仓库：[NTU-LaDS-II/FAN_ATPG](https://github.com/NTU-LaDS-II/FAN_ATPG)。
- 许可证与活跃度：MIT；最近推送为 2025-07-02。
- 适用章节：第 2、3 章。
- 简评：面向教学的命令行 ATPG 与故障仿真工具，仓库文档列出故障折叠、并行故障仿真、ATPG、静态/动态测试压缩以及 STIL 和 ASCII 输出。接口清晰，适合对照第 3 章手算 D 算法和 PODEM。仍需自行核对其所支持网表子集和结果口径。

### I99T 基准电路

- 仓库：[cad-polito-it/I99T](https://github.com/cad-polito-it/I99T)。
- 许可证与活跃度：EUPL-1.2；最近推送为 2025-05-14。
- 适用章节：第 2、3、5、7 章的习题与案例数据。
- 简评：提供 ITC'99 的 RTL VHDL、EDIF、BLIF、ISCAS'89 格式网表与故障表，规模从 s27 到大型设计。仓库 README 明确提醒部分 RTL 不保证具备有意义的功能行为，因此它适合规模与格式练习，不应据此推断真实芯片行为。

### jtag-boundary-scanner

- 仓库：[viveris/jtag-boundary-scanner](https://github.com/viveris/jtag-boundary-scanner)。
- 许可证与活跃度：GPL-3.0；最近推送为 2026-09-20。
- 适用章节：第 7 章。
- 简评：C 实现的 JTAG 边界扫描板级调试工具，提供 Windows GUI，支持 BSDL、SAMPLE、EXTEST、设备自动识别及 FTDI/J-Link 等探针。适合演示 TAP、边界扫描寄存器和板级互连测试；它是主机侧测试工具，不等同于芯片内部扫描或 BIST。

### OpenTestability

- 仓库：[ranaumarnadeem/OpenTestability](https://github.com/ranaumarnadeem/OpenTestability)。
- 许可证与活跃度：Apache-2.0；最近推送为 2026-10-02。
- 适用章节：第 2 章。
- 简评：面向 Yosys JSON 网表计算 SCOAP 与 COP、分析重汇聚扇出并执行测试点插入。项目较新、采用规模仍小，适合演示第 2 章的“度量、选点、复核”闭环；使用前应固定提交版本并自行检查测试点代价与覆盖率改善。

### autoMBIST

- 仓库：[ranaumarnadeem/autoMBIST](https://github.com/ranaumarnadeem/autoMBIST)。
- 软件归档：[DOI 10.5281/zenodo.23453213](https://doi.org/10.5281/zenodo.23453213)，版本 v0.4.0。
- 许可证与活跃度：Apache-2.0；最近推送为 2026-10-26。
- 适用章节：第 6 章的 MBIST、BIRA 与 BISR 扩展。
- 简评：为 OpenRAM 存储器生成 MBIST 控制器、BIRA/BISR 修复逻辑，文档列出 March C、March X/Y/B、MATS+ 等算法及 OpenRAM、sky130、LibreLane 流程。项目很新、维护者单一，适合作为研究型演示，不宜直接作为生产签核工具；本页未执行其 RTL-to-GDS 流程。

## 标准状态

IEEE SA 页面在访问日显示的状态如下。这里的“现行”“失效预留”和在研项目不能混写。

| 标准或项目 | 最近已核验出版物与日期 | 2026-10-26 状态 | 对本课程的含义 |
| --- | --- | --- | --- |
| [IEEE 1149.1](https://standards.ieee.org/ieee/1149.1/4484/) | 1149.1-2013，2013-05-13 发布 | **Inactive-Reserved**，2024-03-21 转为该状态；页面显示暂无 Active Standard | 第 7 章仍可讲其 TAP、BSR、BSDL 等架构基础，但必须注明该行政状态 |
| [P1149.1](https://standards.ieee.org/ieee/1149.1/10977/) | 尚未形成新发布版 | **Active PAR**，2022-06-16 批准 | 只能写成在研修订项目，不能写成“最新已发布标准” |
| [IEEE 1149.6](https://standards.ieee.org/ieee/1149.6/4706/) | 1149.6-2015，2016-03-18 发布 | **Inactive-Reserved**，2026-03-26 转为该状态 | 第 7 章讲交流耦合和差分互连扩展时注明状态 |
| [P1149.6](https://standards.ieee.org/ieee/1149.6/11790/) | 尚未形成新发布版 | **Active PAR**，2024-09-26 批准 | 只能作为修订动态引用 |
| [IEEE 1500](https://standards.ieee.org/ieee/1500/7704/) | 1500-2022，2022-10-12 发布 | **Active Standard** | 第 7 章核心测试壳、核测试与 CTL 参考 |
| [IEEE 1687](https://standards.ieee.org/ieee/1687/3931/) | 1687-2014，2014-12-05 发布 | **Inactive-Reserved**，2025-03-27 转为该状态 | 第 8 章可作内嵌仪器访问与 ICL/PDL 的架构参考 |
| [P1687](https://standards.ieee.org/ieee/1687/10896/) | 尚未形成新发布版 | **Active PAR**，2022-03-24 批准 | 只能作为修订项目引用 |
| [P1687.1](https://standards.ieee.org/ieee/1687.1/11961/) | 未找到已发布版本 | **Active PAR**，2025-02-13 批准 | 只能作为 IJTAG 网络接口与控制器扩展的在研项目 |
| [IEEE 1838](https://standards.ieee.org/ieee/1838/5073/) | 1838-2019，2020-03-13 发布 | **Active Standard** | 第 8 章讲 3D 堆叠、裸片级测试访问与层间互连 |
| [P1838a](https://standards.ieee.org/ieee/1838a/11536/) | 尚未形成修订发布版 | **Active PAR**，2024-02-15 批准 | 只能作为 1838 外部互连 BSR 测试修订动态 |
| [IEEE 1450](https://standards.ieee.org/ieee/1450/10488/) | 1450-2023，2024-04-24 发布 | **Active Standard** | 第 4、7 章提到 STIL、扫描图形和 ATE 数据交换时的标准入口 |

IEEE 1149.1 和 1149.6 的旧版仍在课程中承担概念与架构教学作用，但页面必须把“仍在业界被广泛实现或引用”与“IEEE SA 当前行政状态”分开表述。

## 对 8 章的推荐映射

课程为纯理论课，开源工具只用于展示算法流程、文件格式和报告口径，不设置强制安装或板级测试任务。

| 章节 | 核心阅读 | 补充与演示 | 选用理由 |
| --- | --- | --- | --- |
| 第 1 章 测试导论、缺陷与故障建模 | Wang、Wu、Wen 第 1 章；Agrawal IIT Delhi 课程第 1–4 讲 | 2026 年开放电子书的相关测试概述 | 先建立测试生命周期、质量与良率、故障模型和测试经济学 |
| 第 2 章 可测性设计与扫描架构 | Wang、Wu、Wen 第 2 章；Ren、Hu 编著的 *Machine Learning for Testability Prediction* | OpenTestability；OpenROAD DFT | SCOAP/COP、测试点、扫描单元、规则与扫描综合形成同一理论链 |
| 第 3 章 逻辑与故障仿真、测试生成 | Wang、Wu、Wen 第 3–4 章；Agrawal Auburn/IIT Delhi 课程相关讲次 | FAN ATPG；I99T 基准网表 | 逻辑仿真、故障仿真和 ATPG 互为计算与评价工具 |
| 第 4 章 逻辑内建自测试与测试压缩 | Wang、Wu、Wen 第 5–6 章；Huhn、Drechsler 的压缩与重定向章节 | 机器学习测试综述作为覆盖增强扩展 | TPG、ORA、BIST 架构、at-speed 控制和压缩必须连续讲授 |
| 第 5 章 逻辑诊断 | Wang、Wu、Wen 第 7 章；Pradhan、Bhattacharya 的机器学习测试综述 | FAN ATPG 的诊断输出可作格式参考 | 从故障字典、因果反演到扫描链和 BIST 诊断构成独立主线 |
| 第 6 章 存储器测试、诊断与内建自修复 | Wang、Wu、Wen 第 8–9 章 | autoMBIST 的算法与 BIRA/BISR 文档 | March、RAMSES/TAGS、诊断、冗余分析与修复率需要统一量化 |
| 第 7 章 边界扫描、核级与模拟/混合信号测试 | Wang、Wu、Wen 第 10–11 章；IEEE 1149.1/1149.6/1500 官方状态页 | jtag-boundary-scanner | 区分板级访问、核测试壳、层次化控制与 AMS 参数测试 |
| 第 8 章 纳米测试议题与现代补充 | Wang、Wu、Wen 第 12 章；IEEE 1687/1838/1450 官方页；机器学习测试章节 | Huhn、Drechsler；近年综述与开放电子书 | 把延迟/可靠性议题延伸到高速 I/O、RF、3D、IJTAG、低功耗和 AI 辅助测试 |

## 使用边界与缺口

- **综合教材缺口：** 已核验的 2020 年以后图书多为专题专著或编著章节，适合更新 DFT、机器学习辅助测试、访问机制和存储器修复，不足以取代 2006 年综合教材的全部推导与习题体系。
- **课程时效缺口：** 可稳定访问的完整课程档案为 2006 和 2013 年材料。2020 年以后课程未找到同时满足“官方、完整、开放”三项条件的资源，因此不能把旧讲义描述成最新课程。
- **3D 与系统级测试缺口：** IEEE 1838 已提供标准入口，但本轮没有找到 2020 年以后、开放获取且达到教材深度的 3D 测试专著；第 8 章应明确这是需要持续补充的研究前沿。
- **AI 辅助测试边界：** 机器学习章节和综述适合讲预测、诊断和测试成本优化的新方法，但必须与确定性故障覆盖、可解释性和训练数据边界并置。
- **工具证据边界：** 本页只核实仓库元数据、文档、许可证和近期活动，没有执行 OpenROAD DFT、FAN ATPG、OpenTestability 或 autoMBIST 的完整案例。任何覆盖率、修复率或性能数字都必须以后续可复现实验为证据。
- **标准时效边界：** 标准状态可能随 IEEE SA 更新而变化。讲授或发布前应重新打开上述 IEEE SA 页面，确认发布版、失效预留状态和在研 PAR 是否已经变化。
