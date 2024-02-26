import {IsNotEmpty, IsString} from 'class-validator';

export class CreatePostDto {
  readonly id: number = null;
  readonly coverUrl: string;
}