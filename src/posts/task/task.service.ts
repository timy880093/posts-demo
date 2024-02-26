import {Injectable, Logger} from '@nestjs/common';
import {PostsRepository} from '../posts.repository';
import {PostStatus} from '../dto/post-status.enum';
import {QueueProducer} from '../queue/queue.producer';
import {Cron} from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly postsRepository: PostsRepository, private readonly queueService: QueueProducer) {
  }


  @Cron('0 * * * * *')
  // @Interval(5000)
  async processIdlePosts() {
    this.logger.debug('execute getIdlePosts, waitng count: ' + await this.queueService.getJobs().then(r => r.waiting));
    const posts = await this.postsRepository.getPostsByStatus(PostStatus.IDLE);

    for (const p of posts) {
      await this.queueService.addImgurJob('upload-imgur', {coverUrl: p.coverUrl, id: p.id});
      await this.postsRepository.updatePost(p.id, PostStatus.UPLOADING);
      this.logger.debug(`addImgurJob: id(${p.id}), coverUrl(${p.coverUrl})`);
    }

  }
}