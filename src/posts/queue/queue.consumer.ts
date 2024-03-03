import {Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Process, Processor} from '@nestjs/bull';
import {ImgurService} from "../imgur/imgur.service";
import {PostsRepository} from "../posts.repository";
import {PostStatus} from "../dto/post-status.enum";
import { UpdatePostDto } from '../dto/update-post.dto';


@Processor('image')
export class QueueConsumer {
  private readonly logger = new Logger(QueueConsumer.name);

  constructor(private readonly imgurService: ImgurService, private readonly postsRepository: PostsRepository) {
  }

  @Process('upload-imgur')
  async uploadImgur(job: Job) {
    this.logger.log('uploadImgur: ' + job.data.coverUrl);
    const id = job.data.id;
    try {
      const response = await this.imgurService.authAndUploadImgur(job.data.coverUrl, 30);
      const link = response.data.link;
      const dto = new UpdatePostDto(id, PostStatus.DONE, link);
      await this.postsRepository.updatePost(dto)
      return {imgurCoverUrl: link, id: id};
    } catch (e) {
      this.logger.error('uploadImgur error: ', e);
      const dto = UpdatePostDto.create(id, PostStatus.ERROR);
      await this.postsRepository.updatePost(dto)
      throw Error('uploadImgur error: ' + e.message);
    }

  }

}