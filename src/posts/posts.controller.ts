import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @Get()
  async getPosts() {
    try {
      return await this.postsService.getPosts();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createPosts(@Body() createPostDto: CreatePostDto) {
    try {
      await this.postsService.createPost(createPostDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

}
