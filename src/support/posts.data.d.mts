export interface IPosts {
  frontmatter: IMetaPosts;
  url: string;
}
export interface IMetaPost {
  date: string; // blog日期
  title: string; // blog标题
  class: string; // blog分类
  brief: string; // blog摘要
}
declare const data: IPosts[];
export { data };
