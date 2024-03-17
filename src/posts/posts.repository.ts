import {Injectable, Logger} from '@nestjs/common';
import {Config, JsonDB} from 'node-json-db';
import {PostsEntity} from './dto/posts.entity';
import {PostStatus} from './dto/post-status.enum';
import {ConfigService} from '@nestjs/config';
import moment from "moment";
import {UpdatePostDto} from './dto/update-post.dto';
import {ExceptionHandler} from "./exception/exception.handler";

@Injectable()
export class PostsRepository {
  private readonly logger = new Logger(PostsRepository.name);

  private db: JsonDB;
  private readonly dataPath: string;
  private readonly maxIdPath: string;

  // constructor(private readonly dbFile: string, private readonly dbName: string) {
  constructor(private readonly configService: ConfigService, private readonly exceptionHandler: ExceptionHandler) {
    const dbName = configService.get('database.name');
    const dbFile = configService.get('database.file');
    this.db = new JsonDB(new Config(dbFile, true, true, '/'));
    this.dataPath = `/${dbName}/data`;
    this.maxIdPath = `/${dbName}/maxId`;
    this.initData(dbName).then(() => this.logger.debug('check database ok'));
  }

  async initData(dbName: string) {
    const exists = await this.db.exists(`/${dbName}`);
    if (!exists) {
      const defaultData = `
      {
        "${dbName}": {
          "maxId": 0,
          "data": []
        }
      }
      `;
      await this.db.push('/', JSON.parse(defaultData));
    }
  }

  async getPosts() {
    return this.db.getData(this.dataPath).then(data => JSON.stringify(data || [], null, 4));
  }

  async getPostsByStatus(status: PostStatus) {
    // this.logger.debug('execute getPosts by status');
    const obj = JSON.parse(await this.getPosts());
    return obj.filter(p => p.status === status);
  }

  async createPost(entity: PostsEntity) {
    try {
      const id = await this.parseId(entity.id);
      await this.checkIdExists(id)
      await this.insertPost(entity);
      await this.updateMaxId(id);
      this.logger.debug('createPost ok: ', JSON.stringify(entity));
    } catch (e) {
      throw Error('createPost error: ' + this.exceptionHandler.message(e));
    }

  }

  private async checkIdExists(id: number) {
    const index = await this.getIndex(id);
    this.logger.log('test1: ',id, index);
    if (index >= 0) {
      throw Error(`id:${id} is exists, please try again with another id.`);
    }
  }

  private async parseId(id: number) {
    return id ? id : (await this.getMaxId() + 1);
  }

  private getIndex(id: number) {
    return this.db.getIndex(this.dataPath, id, 'id');
  }

  private getData(index: number) {
    return this.db.getObjectDefault(`${this.dataPath}[${index}]`, {});
  }

  async updatePost(dto: UpdatePostDto) {
    try {
      const index = await this.getIndex(dto.id);
      const data = await this.getData(index);

      const entity = PostsEntity.convert(data);
      entity.imgurCoverUrl = dto.imgurUrl;
      entity.status = dto.status;
      entity.updateAt = moment().format('YYYY-MM-DD HH:mm:ss');

      await this.db.push(`${this.dataPath}[${index}]`, entity, true);
      this.logger.debug('updatePost ok: ', JSON.stringify(entity));
      return entity;
    } catch (e) {
      throw Error('updatePost error: ' + this.exceptionHandler.message(e));
    }

  }

  async getMaxId() {
    return this.db.getObjectDefault(this.maxIdPath, 0);
  }

  async updateMaxId(id: number) {
    this.logger.debug('execute updateMaxId: ', id);
    await this.db.push(this.maxIdPath, id);
  }

  async insertPost(dto: PostsEntity) {
    this.logger.debug('execute insertPost: ', JSON.stringify(dto));
    await this.db.push(`${this.dataPath}[]`, dto);
  }

}
