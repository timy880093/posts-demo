import { Injectable, Logger } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostsEntity } from './dto/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostStatus } from './dto/post-status.enum';
import * as moment from 'moment';
import { UpdatePostDto } from './dto/update-post.dto';


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
      this.logger.error('getPosts error: ', e.message);
      throw Error('getPosts error: ' + e.message);
    }
  }

  async createPost(dto: CreatePostDto) {
    this.logger.debug('createPost: ', dto);
    try {
      this.validate(dto);
      const entity = PostsEntity.create(dto.id, dto.coverUrl, PostStatus.IDLE, moment().format('YYYY-MM-DD HH:mm:ss'));
      await this.postsRepository.createPost(entity);
      this.logger.log('createPost ok: ', entity);
    } catch (e) {
      this.logger.error('createPost error: ', e.message);
      throw Error('createPost error: ' + e.message);
    }
  }

  async updatePost(dto: UpdatePostDto) {
    this.logger.debug('updatePost: ', dto);
    try {
      const entity = await this.postsRepository.updatePost(dto);
      this.logger.log('updatePost ok: ', entity);
    } catch (e) {
      this.logger.error('updatePost error: ', e.message);
      throw Error('updatePost error: ' + e.message);
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
      throw Error('getPostsByStatus error: ' + e.message);
    }
  }

}
