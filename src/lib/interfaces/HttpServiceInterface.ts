import net from 'net';
import { RequestInterface } from './RequestInterface';
import { ResponseInterface } from './ResponseInterface';

export interface HttpServiceInterface {
  start: (port: number, host: string) => void;
  createServer: (socket: net.Socket) => void;
  transformDataBufferInRequestObject: (buffer: Buffer) => RequestInterface;
  buildStatusCode: (response: ResponseInterface | void) => { code: number, message: string };
  buildJsonResponse: (response: ResponseInterface | void) => string;
  receiveCallback(dataBuffer: Buffer, socket: net.Socket): Promise<void>
}