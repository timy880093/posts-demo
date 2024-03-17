import {Injectable} from "@nestjs/common";

@Injectable()
export class ExceptionHandler {
  message(e: unknown): string {
    return e instanceof Error ? e.message : e.toString();
  }
}