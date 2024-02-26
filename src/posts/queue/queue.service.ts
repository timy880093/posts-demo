import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('image') private imgurQueue: Queue) {
  }

  async addImgurJob(data: any) {
    return await this.imgurQueue.add(data);
  }

  async getJobs() {
    return await this.imgurQueue.getJobCounts();
  }

  async getWaitingJobs() {
    return await this.imgurQueue.getWaitingCount();
  }

  async getWaitingJobsList() {
    return await this.imgurQueue.getWaiting();
  }

  async getActiveJobsList() {
    return await this.imgurQueue.getActive();
  }

  async getCompletedJobsList() {
    return await this.imgurQueue.getCompleted();
  }

  async getFailedJobsList() {
    return await this.imgurQueue.getFailed();
  }


}
