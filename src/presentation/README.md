# 播放课件

本目录包含“超大规模集成电路测试基础”的 8 套 Marp 纯理论课件。每套对应一次 3 × 45 分钟课堂，按三个连续理论节次组织；课堂不安排实验、上机、EDA 操作或仪器测量。课件中的公式、算法、例题和理论边界以 *VLSI Test Principles and Architectures: Design for Testability* 为主要依据，现代标准与近年的研究资料按[参考资料](../references/README.md)核对。

| 章 | 课件 | 学时 | 页数 | 播放 |
| ---: | --- | ---: | ---: | --- |
| 1 | 测试导论、缺陷与故障建模 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/01-testing-fault-models-and-economics.html) |
| 2 | 可测性设计与扫描架构 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/02-design-for-testability-and-scan.html) |
| 3 | 逻辑与故障仿真、测试生成 | 3 | 32 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/03-simulation-and-atpg.html) |
| 4 | 逻辑内建自测试与测试压缩 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/04-logic-bist-and-test-compression.html) |
| 5 | 逻辑诊断 | 3 | 32 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/05-logic-diagnosis.html) |
| 6 | 存储器测试、诊断与内建自修复 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/06-memory-test-diagnosis-and-repair.html) |
| 7 | 边界扫描、核级与模拟/混合信号测试 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/07-boundary-scan-core-and-mixed-signal-testing.html) |
| 8 | 纳米测试议题与现代补充 | 3 | 33 | [播放](https://zhouxzh.github.io/vlsi-testing-technology/presentation/08-nanometer-test-trends-and-high-speed-io.html) |
| 合计 | 8 套理论课件 | 24 | 262 | |

## 第一章案例

第一章将两条个人流片经历作为贯穿案例，而不是增加实验学时：

- **55 nm eFlash 存算一体 AI 芯片**：从内部版图、流片照片和技术模块关系引出功能测试、参数测试、量产筛选、良率与失效分析。
- **2024-2 IGBT 与功率器件**：从器件版图、封装和栅极驱动芯片引出 `V(BR)CES`、`VCE(on)`、`VGEth`、开关时间与损耗、电容、热和可靠性等测试对象。

案例材料没有提供的向量、样本数、通过率、良率或失效记录不会被补造；证据边界在第一章课件中逐页说明。

## 课件约定

```yaml
---
marp: true
theme: vlsi-testing
paginate: true
size: 16:9
---
```

每套课件的三个分节均按 45 分钟理论容量设计。标题、分节页、理论推导、算法、例题和章末总结共同构成课堂内容；旧版 PPT 只作为局部结构图和术语的历史补充。

## 构建方式

```bash
pnpm install
pnpm run docs:slides
```

构建全部课件与 VuePress 站点：

```bash
pnpm run docs:build
```

Marp 源文件在本目录，生成后的 HTML 位于 `src/.vuepress/public/presentation/`，不提交版本库。
