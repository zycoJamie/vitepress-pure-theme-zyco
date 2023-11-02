export interface PureThemeConfig {
  /**
   * 头像绝对路径（e. /avatar.png），将图片放置于文档项目根目录的public文件夹下（如果文档根目录是./doc，则是./doc/public文件夹下）
   * 或者使用网络图片的url
   */
  avatar: string;
  name: string; // 用户名
  brief: string; // 简介
  postDir?: string; // 默认 /posts, 博客文章存放的文件夹，基于文档项目根目录的绝对路径（e. /posts）
}
