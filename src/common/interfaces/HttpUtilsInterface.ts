import { RequestOptions } from "https";

export interface HttpUtilsInterface {
  reciveData(options: string | URL | RequestOptions): void;
  sendData(options: string | URL | RequestOptions, postData: Object): void;
}
