import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import markdownItAttrs from "markdown-it-attrs";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/vlsi-testing-technology/",
  lang: "zh-CN",
  title: "超大规模集成电路测试基础",
  description: "超大规模集成电路测试基础课程主页与教学资料",
  pagePatterns: [
    "**/*.md",
    "!presentation/[0-9][0-9]-*.md",
    "!.vuepress",
    "!node_modules",
  ],
  bundler: viteBundler({
    viteOptions: {
      server: {
        watch: {
          ignored: ["**/.*.tmpdir/**", "**/*.tmp", "**/.vuepress/dist/**"],
        },
      },
    },
  }),
  theme,
  extendsMarkdown: (md) => {
    md.use(markdownItAttrs);
  },
});
