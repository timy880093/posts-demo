import { Injectable, Logger } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { PostsEntity } from './dto/posts.entity';
import { PostStatus } from './dto/post-status.enum';
import { ConfigService } from '@nestjs/config';

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
    this.db = new JsonDB(new Config(dbFile, true, false, '/'));
    this.dataPath = `/${dbName}/data`;
    this.maxIdPath = `/${dbName}/maxId`;
    this.initData(dbName).then(() => this.logger.debug('check database ok'));
  }

  async initData(dbName: string) {
    const exists = await this.db.exists(`/${dbName}`);
    if (!exists) {
      // const defaultData = `{ "${dbName}": [], "${dbName}_max_id": 0 }`.replace('/', '');
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
    this.logger.debug('execute getPosts');
    // await this.db.reload();
    return await this.db.getData(this.dataPath).then(data => JSON.stringify(data || [], null, 4));
  }

  async getPostsByStatus(status: PostStatus) {
    this.logger.debug('execute getPosts by status');
    const obj = JSON.parse(await this.getPosts());
    return obj.filter(p => p.status === status);
    // return await this.db.filter(`${this.dataPath}[]/status`)
  }

  async createPost(dto: PostsEntity) {
    this.logger.debug('execute createPost: ', dto);
    try {
      // await this.db.reload();
      const id = await this.db.getIndex(this.dataPath, dto.id.toString());
      if (id <= 0) {
        await this.insertPost(dto);
        await this.updateMaxId(dto.id);
      } else {
        throw Error('save error: id is exists');
      }
    } catch (e) {
      throw Error('createPost error: ' + e.message);
    }

  }

  async getMaxId() {
    this.logger.debug('execute getMaxId');
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
