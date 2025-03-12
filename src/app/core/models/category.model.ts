export interface ICategory {
  id: number | null;
  name: string | null;
  numberOfStories:number | null;
}

export class Category implements ICategory {
  id: number | null = null;
  name: string | null = null;
  numberOfStories:number | null = null;
}
