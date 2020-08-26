interface Item {
  name: string;
  language: string;
  stargazers_count: number;
}

interface Response {
  incomplete_results: boolean;
  items: Item[];
  total_count: number;
}

export { Item, Response };
