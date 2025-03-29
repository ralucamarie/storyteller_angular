export interface IUser {
  id?: string | null;
  email: string | null;
  password: string | null;
  authorName: string | null;
}

export class User implements IUser {
  id?: string | null = null;
  email: string | null = null;
  password: string | null = null;
  authorName: string | null = null;

  constructor(userDto?: IUser) {
    if (!userDto) {
      return;
    }
    this.id = userDto.id;
    this.email = userDto.email;
    this.password = userDto.password;
    this.authorName = userDto.authorName;

  }

  static toDto(user: IUser){
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      author_name: user.authorName,
    }
  }
}
