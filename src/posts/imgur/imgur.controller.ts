import {Body, Controller, HttpException, Logger, Post} from '@nestjs/common';
import {ImgurService} from './imgur.service';
import {ExceptionHandler} from "../exception/exception.handler";

@Controller('imgur')
export class ImgurController {
  private readonly logger = new Logger(ImgurController.name);
  1;

  constructor(private readonly imgurService: ImgurService, private readonly exceptionHandler: ExceptionHandler) {
  }

  @Post('token')
  async getAccessToken() {
    this.logger.log('getAccessToken');
    try {
      return this.imgurService.getAccessToken();
    } catch (e) {
      throw new HttpException('getAccessToken error: ' + this.exceptionHandler.message(e), 400);
    }
  }

  @Post('image')
  async uploadToImgur(@Body() data: any) {
    this.logger.log('uploadToImgur');
    return this.imgurService.authAndUploadImgur(data.coverUrl)
  }

}
