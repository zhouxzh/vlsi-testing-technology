import { sidebar } from "vuepress-theme-hope";

export default sidebar({
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
