import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { ImgurService } from './imgur.service';

@Controller('imgur')
export class ImgurController {
  private readonly logger = new Logger(ImgurController.name);
  1;

  constructor(private readonly imgurService: ImgurService) {
  }

  @Post('token')
  async getAccessToken() {
    this.logger.log('getAccessToken');
    try {
      return await this.imgurService.getAccessToken();
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Post('image')
  async uploadToImgur(@Body() data: any) {
    this.logger.log('uploadToImgur');
    try {
      return await this.imgurService.uploadToImgur(data.coverUrl);
    } catch (e) {
      if (e.message.includes('403')) {
        const accesToken = await this.imgurService.getAccessToken();
        this.imgurService.refreshAccessToken(accesToken);
        try {
          return this.imgurService.uploadToImgur(data.coverUrl);
        } catch (e) {
          this.logger.log('uploadToImgur error: new token: ' + e.message)
          throw new HttpException(e.message, 403);
        }
      } else {
        this.logger.log('uploadToImgur error: new token: ' + e.message)
        throw new HttpException(e.message, 400);
      }
    }
  }

}
