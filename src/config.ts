export interface PureThemeConfig {
  /**
   * 头像绝对路径（e. /avatar.png），将图片放置于文档项目根目录的public文件夹下（如果文档根目录是./doc，则是./doc/public文件夹下）
   * 或者使用网络图片的url
   */
  avatar: string;
  name: string; // 用户名
  brief: string; // 简介
  /**
   * 默认 /posts, 博客文章存放的文件夹，基于vitepress文档根目录的绝对路径
   * e. 如果文档根目录是doc，则博客存放在doc下的posts文件夹，路径为 /posts
   */
  postDir?: string;
  footer?: Partial<{
    text: string; // 配置主页footer文案
    route: "articles" | "about"; // 该区域默认点击跳转Articles页面
  }>;
  about: {
    brief: string;
    /**
     * icon使用绝对路径（e. /github.svg），将图片放置于文档项目根目录的public文件夹下（如果文档根目录是./doc，则是./doc/public文件夹下）
     * 或者使用网络图片的url
     */
    links?: { icon: string; url?: string; description: string }[];
  };
}
