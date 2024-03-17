import {PostStatus} from './post-status.enum';

export class PostsEntity {
  readonly id: number;
  readonly coverUrl: string;
  imgurCoverUrl: string;
  status: PostStatus;
  readonly createAt: string;
  updateAt: string;


  constructor(id: number, coverUrl: string, imgurCoverUrl: string, status: PostStatus, createAt: string, updateAt: string) {
    this.id = id;
    this.coverUrl = coverUrl;
    this.imgurCoverUrl = imgurCoverUrl;
    this.status = status;
    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  static create(id: number, coverUrl: string, status: PostStatus, date: string): PostsEntity {
    return new PostsEntity(id, coverUrl, null, status, date, date);
  }

  static convert(obj: any): PostsEntity {
    return new PostsEntity(obj.id, obj.coverUrl, obj.imgurCoverUrl, obj.status, obj.createAt, obj.updateAt);
  }

  toString(): string {
    return `id: ${this.id}, coverUrl: ${this.coverUrl}, imgurCoverUrl: ${this.imgurCoverUrl}, status: ${this.status}, createAt: ${this.createAt}, updateAt: ${this.updateAt}`;
  }

}