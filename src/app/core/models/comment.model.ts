export interface IComment {
  id?: number | null;
  authorName: string | null;
  content: string | null;
  created_at: string | null;
}

export class Comment implements IComment {
  id?: number | null = null;
  authorName: string | null = null;
  content: string | null = null;
  created_at: string | null = null;
  constructor(dto?: IComment) {
    if(!dto){
      return
    }
    this.id = dto.id;
    this.authorName = dto.authorName;
    this.content = dto.content;
    this.created_at = dto.created_at;
  }
}
