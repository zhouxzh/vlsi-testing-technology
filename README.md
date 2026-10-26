# 超大规模集成电路测试基础

**超大规模集成电路测试基础**课程主页与纯理论教学资料仓库。课程按 8 个专题组织，每个专题 3 个 45 分钟节次，共 24 学时；不安排实验、上机、EDA 操作或仪器测量。

## 课程信息

| 项目 | 内容 |
| --- | --- |
| 课程名称 | 超大规模集成电路测试基础 |
| 课堂安排 | 8 次课堂，每次 3 × 45 分钟 |
| 总学时 | 24 学时 |
| 教学形式 | 纯理论讲解、公式推导、算法分析、纸面例题 |
| 平时成绩 | 40%，课堂推导与章节理论任务 |
| 期末考核 | 60%，专题讲解与配套报告，不安排闭卷笔试 |

课程以 *VLSI Test Principles and Architectures: Design for Testability*（Wang、Wu、Wen，2006）的 12 章理论结构为主要参考，重构为 8 章。该书是完整经典教材，但并非最新教材；现代标准、开放课程、专著章节和开源工具另列于参考资料页面。

## 内容导航

- [课程主页](src/README.md)
- [教学计划](src/plan/README.md)
- [教学演示](src/presentation/README.md)
- [参考资料与开放资源](src/references/README.md)

## 八章结构

| 章 | 主题 | 理论依据 |
| --- | --- | --- |
| 第 1 章 | 测试导论、缺陷与故障建模 | 文献 [1] 第 1 章；个人流片案例 |
| 第 2 章 | 可测性设计与扫描架构 | 文献 [1] 第 2 章 |
| 第 3 章 | 逻辑与故障仿真、测试生成 | 文献 [1] 第 3–4 章 |
| 第 4 章 | 逻辑内建自测试与测试压缩 | 文献 [1] 第 5–6 章 |
| 第 5 章 | 逻辑诊断 | 文献 [1] 第 7 章 |
| 第 6 章 | 存储器测试、诊断与内建自修复 | 文献 [1] 第 8–9 章 |
| 第 7 章 | 边界扫描、核级与模拟/混合信号测试 | 文献 [1] 第 10–11 章；IEEE 标准 |
| 第 8 章 | 纳米测试议题与现代补充 | 文献 [1] 第 12 章；近年正式出版物与标准 |

## 本地开发

环境要求：Node.js 20+、pnpm 10+。

```bash
pnpm install
pnpm docs:dev
```

构建静态站点和全部 Marp 课件：

```bash
pnpm docs:build
```

Marp 源文件位于 `src/presentation/`，生成后的 HTML 位于 `src/.vuepress/public/presentation/`，生成物不提交版本库。

## 私有材料与发布边界

`reference/` 是 Git 忽略的教师本地目录，用于保存未公开原始材料及其转换结果，不属于网站内容，也不会进入 GitHub Pages 构建。公开页面不链接该目录中的文件。

公开引用统一采用文末编号参考文献。完整书目、DOI、出版社页面、开放课程和标准状态集中在[参考资料与开放资源](src/references/README.md)。

## 参考文献

[1] L.-T. Wang, C.-W. Wu, and X. Wen, Eds., *VLSI Test Principles and Architectures: Design for Testability*. San Francisco, CA, USA: Morgan Kaufmann, 2006.

## 质量检查

构建后执行：

```bash
python scripts/check_site_links.py
node scripts/check_deck_layout.mjs
```

本地预览服务器运行时，还可执行响应式页面检查：

```bash
PREVIEW_URL=http://127.0.0.1:8081/vlsi-testing-technology/ node scripts/check_pages.mjs
```

## GitHub Pages

`.github/workflows/deploy-pages.yml` 在 `main` 分支 push 或手动触发时构建 VuePress 与 Marp 内容，并通过 GitHub Actions 发布 Pages。

仓库按 `zhouxzh/vlsi-testing-technology` 配置，预期站点地址为：

<https://zhouxzh.github.io/vlsi-testing-technology/>

首次启用时，在 GitHub 仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

## 版权与使用边界

课程原创文字与图表用于本课程教学。教材、论文和标准的版权归各自作者与出版者所有。公开材料只包含正式书目、必要短引用、自绘结构和个人流片案例；未公开原始资料不随课程主页发布。
