export interface RequestInterface {
  method: string;
  path: string;
  httpVersion: string;
  headers: any;
  body: Object;
}
