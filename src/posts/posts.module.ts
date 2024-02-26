import {Module} from '@nestjs/common';
import {PostsController} from './posts.controller';
import {PostsService} from './posts.service';
import {PostsRepository} from './posts.repository';
import {ConfigModule} from '@nestjs/config';
import {ScheduleModule} from '@nestjs/schedule';
import {TaskService} from './task/task.service';
import {BullModule} from '@nestjs/bull';
import {QueueProducer} from './queue/queue.producer';
import {ImgurService} from './imgur/imgur.service';
import {ImgurController} from './imgur/imgur.controller';
import configuration from '../config/configuration';
import {QueueConsumer} from "./queue/queue.consumer";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'image',
      // processors: [join(__dirname, 'processor.js')]
    })
  ],
  controllers: [PostsController, ImgurController],
  providers: [
    QueueConsumer,
    PostsService,
    PostsRepository,
    // {
    //   provide: PostsRepository,
    //   useFactory: () => new PostsRepository(process.env.DATABASE_FILE, process.env.DATABASE_NAME)
    // },
    TaskService,
    QueueProducer,
    ImgurService
  ]
})
export class PostsModule {
}
