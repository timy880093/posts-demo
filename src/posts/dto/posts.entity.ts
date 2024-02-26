import { PostStatus } from './post-status.enum';

export class PostsEntity {
  readonly id: number;
  readonly coverUrl: string;
  readonly imgurCoverUrl: string;
  readonly status: PostStatus;
  readonly createAt: string;
  readonly updateAt: string;


  constructor(id: number, coverUrl: string, imgurCoverUrl: string, status: PostStatus, date: string) {
    this.id = id;
    this.coverUrl = coverUrl;
    this.imgurCoverUrl = imgurCoverUrl;
    this.status = status;
    this.createAt = date;
    this.updateAt = date;
  }
}