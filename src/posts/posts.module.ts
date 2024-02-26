import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue/queue.service';
import { join } from 'path';
import { ImgurService } from './imgur/imgur.service';
import { ImgurController } from './imgur/imgur.controller';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379
      }
    }),
    BullModule.registerQueue({
      name: 'image',
      // processors: [join(__dirname, 'processor.js')]
    })
  ],
  controllers: [PostsController, ImgurController],
  providers: [
    PostsService,
    PostsRepository,
    // {
    //   provide: PostsRepository,
    //   useFactory: () => new PostsRepository(process.env.DATABASE_FILE, process.env.DATABASE_NAME)
    // },
    TaskService,
    QueueService,
    ImgurService
  ]
})
export class PostsModule {
}
