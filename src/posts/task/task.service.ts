import { Injectable, Logger } from '@nestjs/common';
import { PostsRepository } from '../posts.repository';
import { PostStatus } from '../dto/post-status.enum';
import { QueueService } from '../queue/queue.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly postsRepository: PostsRepository, private readonly queueService: QueueService) {
  }


  @Cron('* * * * * *')
  // @Interval(5000)
  async processIdlePosts() {
    this.logger.debug('execute getIdlePosts', await this.queueService.getJobs());
    const posts = await this.postsRepository.getPostsByStatus(PostStatus.IDLE);
    this.logger.debug('posts: ', posts);
    for (const p of posts) {
      await this.queueService.addImgurJob({ coverUrl: p.coverUrl});
      this.logger.debug('addImgurJob: '+ p.coverUrl);
    }

    this.logger.debug('end getIdlePosts: ', await this.queueService.getWaitingJobs());

  }
}