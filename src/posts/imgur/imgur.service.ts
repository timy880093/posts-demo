import {HttpException, Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FormData = require('form-data');


@Injectable()
export class ImgurService {
  private readonly logger = new Logger(ImgurService.name);
  private readonly tokenUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;
  private readonly albumId: string;
  private accessToken: string = '';

  // private client: ImgurClient;

  constructor(private readonly configService: ConfigService) {
    this.tokenUrl = this.configService.get('imgur.tokenUrl');
    this.clientId = this.configService.get('imgur.clientId');
    this.clientSecret = this.configService.get('imgur.clientSecret');
    this.refreshToken = this.configService.get('imgur.refreshToken');
    this.albumId = this.configService.get('imgur.albumId');
    // this.client = new ImgurClient({
    //   clientId: this.clientId,
    //   clientSecret: this.clientSecret,
    //   refreshToken: this.refreshToken
    // });
  }

  refreshAccessToken(newAccessToken: string) {
    this.accessToken = newAccessToken;
    this.logger.log('refreshAccessToken: ' + this.accessToken);
  }


  async getAccessToken() {
    const data = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token'
    };
    const config = {
      headers: {'Content-Type': 'application/json'}
    };
    return axios.post(this.tokenUrl, data, config)
      .then(response => {
        this.logger.debug('getToken ok: ', response.data);
        return response.data.access_token;
      }).catch(error => {
        this.logger.debug('getToken error: ', error);
        throw Error('Failed to get token: ' + error.message);
      });

  }

  // async uploadToImgur2(url: string) {
  //   const response = await this.client.upload({
  //     // image: fs.createReadStream('test.jpg'),
  //     // type: 'stream',
  //     // album: 'ilBSdia',
  //
  //     album: this.albumId,
  //     image: url,
  //     title: 'Meme',
  //     description: url
  //   });
  //   console.log(response);
  //   return response;
  // }

  async authAndUploadImgur(url: string, delay: number = 0) {
    try {
      return this.uploadImgur(url, delay);
    } catch (e) {
      if (e.message.includes('403')) {
        const accesToken = await this.getAccessToken();
        this.refreshAccessToken(accesToken);
        try {
          return this.uploadImgur(url, delay);
        } catch (e) {
          this.logger.log('uploadToImgur error: new token: ' + e.message)
          throw new HttpException(e.message, 403);
        }
      } else if (e.message.includes('429')) {
        this.logger.log('uploadToImgur warn: Too Many Requests' + e.message)
        throw new HttpException(e.message, 429);
      } else {
        this.logger.log('uploadToImgur error: new token: ' + e.message)
        throw new HttpException(e.message, 400);
      }
    }
  }

  async uploadImgur(url: string, delay: number = 0) {
    await this.wait(delay);

    const data = new FormData();
    data.append('album', this.albumId);
    data.append('image', url);
    data.append('type', 'url');
    data.append('description', url);

    const config = {
      headers: {
        // 'Authorization': `Client-ID ${this.clientId}`,
        'Authorization': `Bearer ${this.accessToken}`,
        ...data.getHeaders()
      }
    };

    return axios.post('https://api.imgur.com/3/image', data, config)
      .then(response => {
        this.logger.log('uploadToImgur success: ', response.data);
        return response.data;
      })
      .catch(error => {
        this.logger.error('uploadToImgur error: ' + error.message);
        throw Error('uploadToImgur error: ' + error.message);
      });

  }

  async wait(second: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('')
      }, second * 1000)
    });
  }

}
