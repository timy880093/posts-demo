import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PostsModule } from './posts/posts.module';
import configuration from './config/configuration';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  const options = new DocumentBuilder()
    // 标题
    .setTitle('posts-demo-guide')
    // 描述
    .setDescription('NestJs-posts-demo')
    // 版本号
    .setVersion('1.0')
    // 标签，此处暂时不需要
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  // 因为api我们已经留给接口前缀了，这里修改为api-docs
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configuration().port);
}

bootstrap();
