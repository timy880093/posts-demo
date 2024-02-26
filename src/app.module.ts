import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PostsModule} from './posts/posts.module';
import {QueueProducer} from "./posts/queue/queue.producer";
import {BullModule} from "@nestjs/bull";

@Module({
  imports: [
    PostsModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService, QueueProducer]
})
export class AppModule {
}
