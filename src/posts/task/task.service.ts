import { Injectable, Logger } from '@nestjs/common';
import { PostsRepository } from '../posts.repository';
import { PostStatus } from '../dto/post-status.enum';
import { Cron } from '@nestjs/schedule';
import { QueueProducer } from '../queue/queue.producer';
import { PostsService } from '../posts.service';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly postsService: PostsService, private readonly queueProducer: QueueProducer) {
  }


  @Cron('0 * * * * *')
  // @Interval(5000)
  async processIdlePosts() {
    this.logger.debug('execute getIdlePosts, waitng count: ' + await this.queueProducer.getJobs().then(r => r.waiting));
    const posts = await this.postsService.getPostsByStatus(PostStatus.IDLE);

    for (const p of posts) {
      await this.queueProducer.addImgurJob('upload-imgur', { coverUrl: p.coverUrl, id: p.id });
      const dto = UpdatePostDto.create(p.id, PostStatus.UPLOADING);
      await this.postsService.updatePost(dto);
      this.logger.debug(`addImgurJob: id(${p.id}), coverUrl(${p.coverUrl})`);
    }

  }
}