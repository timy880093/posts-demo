import {Body, Controller, Get, HttpException, HttpStatus, Post, Put} from '@nestjs/common';
import {PostsService} from './posts.service';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {ExceptionHandler} from "./exception/exception.handler";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService, private readonly exceptionHandler: ExceptionHandler) {
  }

  @Get()
  async getPosts(): Promise<string> {
    try {
      return this.postsService.getPosts();
    } catch (e) {
      throw new HttpException(this.exceptionHandler.message(e), HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createPosts(@Body() dto: CreatePostDto) {
    try {
      await this.postsService.createPost(dto);
    } catch (e) {
      throw new HttpException(this.exceptionHandler.message(e), HttpStatus.BAD_REQUEST);
    }
  }

  @Put()
  async updatePosts(@Body() dto: UpdatePostDto) {
    try {
      await this.postsService.updatePost(dto);
    } catch (e) {
      throw new HttpException(this.exceptionHandler.message(e), HttpStatus.BAD_REQUEST);
    }
  }

}
