import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "首页",
    link: "/",
    icon: "home",
    activeMatch: "^/$",
  },
  {
    text: "教学计划",
    link: "/plan/",
    icon: "calendar",
    activeMatch: "^/plan/",
  },
  {
    text: "播放课件",
    link: "/presentation/",
    icon: "presentation",
    activeMatch: "^/presentation/",
  },
  {
    text: "参考资料",
    link: "/references/",
    icon: "link",
    activeMatch: "^/references/",
  },
]);
