import {Logger} from '@nestjs/common';
import {Job} from 'bull';
import {Process, Processor} from '@nestjs/bull';
import {ImgurService} from "../imgur/imgur.service";
import {PostsRepository} from "../posts.repository";
import {PostStatus} from "../dto/post-status.enum";


@Processor('image')
export class QueueConsumer {
  private readonly logger = new Logger(QueueConsumer.name);

  constructor(private readonly imgurService: ImgurService, private readonly postsRepository: PostsRepository) {
  }

  @Process('upload-imgur')
  async uploadImgur(job: Job) {
    this.logger.log('uploadImgur: ' + job.data.coverUrl);
    let id = job.data.id;
    try {
      let response = await this.imgurService.authAndUploadImgur(job.data.coverUrl, 30);
      let link = response.data.link;
      await this.postsRepository.updatePost(id, PostStatus.DONE, link)
      return {imgurCoverUrl: link, id: id};
    } catch (e) {
      this.logger.error('uploadImgur error: ', e);
      await this.postsRepository.updatePost(id, PostStatus.DONE)
      throw Error('uploadImgur error: ' + e.message);
    }

  }

}