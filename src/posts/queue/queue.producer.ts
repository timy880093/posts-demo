import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';
import {InjectQueue} from '@nestjs/bull';
import {ExceptionHandler} from "../exception/exception.handler";

@Injectable()
export class QueueProducer {
  constructor(@InjectQueue('image') private imgurQueue: Queue,private readonly exceptionHandler: ExceptionHandler) {
  }

  async addImgurJob(name: string, data: any) {
    try {
      await this.imgurQueue.add(name, data);
    } catch (e) {
      throw Error('addImgurJob error: ' + this.exceptionHandler.message(e));
    }
  }

  async getJobs() {
    return this.imgurQueue.getJobCounts();
  }

}
