import { Injectable, Logger } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostsEntity } from './dto/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostStatus } from './dto/post-status.enum';
import * as moment from 'moment';


@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly postsRepository: PostsRepository) {
  }

  async getPosts() {
    try {
      const json = await this.postsRepository.getPosts();
      this.logger.log('getPosts ok: ', json);
      return json;
    } catch (e) {
      this.logger.log('getPosts error: ', e.message);
      throw Error('getPosts error: ' + e.message);
    }
  }

  async createPost(dto: CreatePostDto) {
    try {
      this.validate(dto);
      const maxId = await this.postsRepository.getMaxId();
      const postsEntity = this.convert(maxId + 1, dto.coverUrl);
      await this.postsRepository.createPost(postsEntity);
      this.logger.log('createPost ok');
    } catch (e) {
      this.logger.log('createPost error: ', e.message);
      throw Error('createPost error: ' + e.message);
    }
  }

  validate(dto: CreatePostDto) {
    if (!dto.coverUrl || !this.isUrl(dto.coverUrl)) {
      throw Error('coverUrl is invalid');
    }
  }

  private isUrl(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  convert(maxId: number, coverUrl: string): PostsEntity {
    this.logger.debug('execute convert');
    return new PostsEntity(maxId, coverUrl, null, PostStatus.IDLE, moment().format('YYYY-MM-DD HH:mm:ss'));
  }

  // async promissHandler<T>(promise: Promise<T>):Promise<[Error, T]>
  //   return await promise.then(result => [null, result]).catch(error => [error, null]);
  // }
}
