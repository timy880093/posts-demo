import {Injectable, Logger} from '@nestjs/common';
import {PostsRepository} from './posts.repository';
import {PostsEntity} from './dto/posts.entity';
import {CreatePostDto} from './dto/create-post.dto';
import {PostStatus} from './dto/post-status.enum';
import moment from 'moment';
import {UpdatePostDto} from './dto/update-post.dto';
import {ExceptionHandler} from "./exception/exception.handler";


@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(private readonly postsRepository: PostsRepository, private readonly exceptionHandler: ExceptionHandler) {
  }

  async getPosts() {
    try {
      const json = await this.postsRepository.getPosts();
      this.logger.log('getPosts ok: ', json);
      return json;
    } catch (e) {
      throw Error('getPosts error: ' + this.exceptionHandler.message(e));
    }
  }

  async createPost(dto: CreatePostDto) {
    this.logger.debug('createPost: ', JSON.stringify(dto));
    try {
      this.validate(dto);
      const entity = PostsEntity.create(dto.id, dto.coverUrl, PostStatus.IDLE, moment().format('YYYY-MM-DD HH:mm:ss'));
      await this.postsRepository.createPost(entity);
      this.logger.log('createPost ok: ', JSON.stringify(entity));
    } catch (e) {
      throw Error('createPost error: ' + this.exceptionHandler.message(e));
    }
  }

  async updatePost(dto: UpdatePostDto) {
    this.logger.debug('updatePost: ', JSON.stringify(dto));
    try {
      const entity = await this.postsRepository.updatePost(dto);
      this.logger.log('updatePost ok: ', JSON.stringify(entity));
    } catch (e) {
      throw Error('updatePost error: ' + this.exceptionHandler.message(e));
    }
  }

  private validate(dto: CreatePostDto) {
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

  async getPostsByStatus(status: PostStatus) {
    try {
      return this.postsRepository.getPostsByStatus(status);
    } catch (e) {
      throw Error('getPostsByStatus error: ' + this.exceptionHandler.message(e));
    }
  }

}
