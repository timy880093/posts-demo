import {PostStatus} from './post-status.enum';

export class UpdatePostDto {
  readonly id: number;
  readonly status: PostStatus;
  readonly imgurUrl: string = null;

  constructor(id: number, status: PostStatus, imgurUrl: string) {
    this.id = id;
    this.status = status;
    this.imgurUrl = imgurUrl;
  }

  static create(id: number, status: PostStatus): UpdatePostDto {
    return new UpdatePostDto(id, status, null);
  }

}