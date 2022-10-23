import { ClientInterface } from "./ClientInterface";

export interface ConfigAppInterface {
    port: number;
    serviceName: string;
    mode: "client" | "server";
    clientConfig?: ClientInterface;
}