import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {PostsModule} from './posts/posts.module';
import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  const options = new DocumentBuilder()
    .setTitle('posts-demo-guide')
    .setDescription('posts-demo-guide')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configuration().port);
}

bootstrap();
