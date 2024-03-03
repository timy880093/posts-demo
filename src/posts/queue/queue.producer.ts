import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';

@Injectable()
export class QueueProducer {
  constructor(@InjectQueue('image') private imgurQueue: Queue) {
  }

  async addImgurJob(name: string, data: any) {
    try {
      await this.imgurQueue.add(name, data);
    } catch (e) {
      throw Error('addImgurJob error: ' + e.message);
    }
  }

  async getJobs() {
    return this.imgurQueue.getJobCounts();
  }

}
