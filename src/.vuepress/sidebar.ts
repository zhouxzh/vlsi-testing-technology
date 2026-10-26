import { sidebar } from "vuepress-theme-hope";

const chapters = [
  ["第1章：测试导论、缺陷与故障建模", "01-testing-fault-models-and-economics"],
  ["第2章：可测性设计与扫描架构", "02-design-for-testability-and-scan"],
  ["第3章：逻辑与故障仿真、测试生成", "03-simulation-and-atpg"],
  ["第4章：逻辑内建自测试与测试压缩", "04-logic-bist-and-test-compression"],
  ["第5章：逻辑诊断", "05-logic-diagnosis"],
  ["第6章：存储器测试、诊断与内建自修复", "06-memory-test-diagnosis-and-repair"],
  ["第7章：边界扫描、核级与模拟/混合信号测试", "07-boundary-scan-core-and-mixed-signal-testing"],
  ["第8章：纳米测试议题与现代补充", "08-nanometer-test-trends-and-high-speed-io"],
] as const;

export default sidebar({
  "/presentation/": [
    {
      text: "播放课件",
      icon: "presentation",
      collapsible: false,
      children: [
        {
          text: "课件目录",
          link: "/presentation/",
        },
        ...chapters.map(([text, slug]) => ({
          text,
          link: `/presentation/${slug}.html`,
        })),
      ],
    },
  ],
  "/references/": [
    {
      text: "参考资料",
      icon: "link",
      collapsible: false,
      children: [
        {
          text: "教材、开放资源与标准",
          link: "/references/",
        },
      ],
    },
  ],
});
