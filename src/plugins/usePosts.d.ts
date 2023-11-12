type IPostsTool = {
  posts: any;
};

interface IUsePosts {
  (): IPostsTool;
}

const usePosts: IUsePosts;
