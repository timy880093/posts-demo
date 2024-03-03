import { Injectable, Logger } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { PostsEntity } from './dto/posts.entity';
import { PostStatus } from './dto/post-status.enum';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment/moment';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsRepository {
  private readonly logger = new Logger(PostsRepository.name);

  private db: JsonDB;
  private readonly dataPath: string;
  private readonly maxIdPath: string;

  // constructor(private readonly dbFile: string, private readonly dbName: string) {
  constructor(private readonly configService: ConfigService) {
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
    return await this.db.getData(this.dataPath).then(data => JSON.stringify(data || [], null, 4));
  }

  async getPostsByStatus(status: PostStatus) {
    // this.logger.debug('execute getPosts by status');
    const obj = JSON.parse(await this.getPosts());
    return obj.filter(p => p.status === status);
  }

  async createPost(entity: PostsEntity) {
    try {
      const id = await this.parseId(entity.id);
      const index = await this.getIndex(id);

      if (index > 0) {
        throw Error(`id:${id} is exists, please try again with another id.`);
      }
      // index not exists
      await this.insertPost(entity);
      await this.updateMaxId(id);
      this.logger.debug('createPost ok: ', entity);
    } catch (e) {
      throw Error('createPost error: ' + e.message);
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
      this.logger.debug('updatePost ok: ', entity);
      return entity;
    } catch (e) {
      throw Error('updatePost error: ' + e.message);
    }

  }

  async getMaxId() {
    return await this.db.getObjectDefault(this.maxIdPath, 0);
  }

  async updateMaxId(id: number) {
    this.logger.debug('execute updateMaxId: ', id);
    await this.db.push(this.maxIdPath, id);
  }

  async insertPost(dto: PostsEntity) {
    this.logger.debug('execute insertPost: ', dto);
    await this.db.push(`${this.dataPath}[]`, dto);
  }

}
