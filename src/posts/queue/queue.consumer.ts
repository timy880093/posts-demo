// import { Injectable, Logger } from '@nestjs/common';
// import { Job, Queue } from 'bull';
// import { InjectQueue, Process, Processor } from '@nestjs/bull';
//
//
// @Processor('image')
// export class ImageConsumer {
//   private readonly logger = new Logger(ImageConsumer.name);
//
//   @Process()
//   async uploadImgur(job: Job) {
//     this.logger.log('uploadImgur');
//     job.data; // Data passed when the job was created
//
//     return await this.uploadToImgur(job.data);
//   }
// }