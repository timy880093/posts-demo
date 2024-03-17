import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PostsModule} from './posts/posts.module';
import {BullModule} from '@nestjs/bull';
import configuration from './config/configuration';

@Module({
  imports: [
    PostsModule,
    BullModule.forRoot({
      redis: {
        host: configuration().redis.host,
        port: Number(configuration().redis.port)
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
