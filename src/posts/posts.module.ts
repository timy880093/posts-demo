import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './task/task.service';
import { BullModule } from '@nestjs/bull';
import { ImgurService } from './imgur/imgur.service';
import { ImgurController } from './imgur/imgur.controller';
import configuration from '../config/configuration';
import { QueueConsumer } from './queue/queue.consumer';
import { QueueProducer } from './queue/queue.producer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'image'
    })
  ],
  controllers: [PostsController, ImgurController],
  providers: [
    PostsService,
    PostsRepository,
    TaskService,
    ImgurService,
    QueueConsumer,
    QueueProducer
  ]
})
export class PostsModule {
}
