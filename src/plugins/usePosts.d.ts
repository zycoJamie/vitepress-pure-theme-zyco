interface IPost {
  title: string;
  class: string;
  date: string;
  year: string;
  brief: string;
  fileName: string;
  url: string;
  [key in string]: string | number;
}

type TPosts = {
  posts: {
    all: IPost[];
    date: Record<string, IPost[]>;
    dateTags: string[];
    class: Record<string, IPost[]>;
    classTags: string[];
  };
};

interface IUsePosts {
  (): TPosts;
}

const usePosts: IUsePosts;
