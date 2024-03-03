import { Body, Controller, Get, HttpException, HttpStatus, Post, Put } from '@nestjs/common';
import {PostsService} from './posts.service';
import {CreatePostDto} from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get()
  async getPosts(): Promise<string>{
    try {
      return await this.postsService.getPosts();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createPosts(@Body() dto: CreatePostDto) {
    try {
      await this.postsService.createPost(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updatePosts(@Body() dto: UpdatePostDto) {
    try {
      await this.postsService.updatePost(dto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

}
