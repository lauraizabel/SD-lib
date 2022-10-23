import { IpPortInterface } from "./IpPortInterface";

export interface ConfigAppInterface {
    port: number;
    serviceName: string;
    mode: "client" | "server";
    clientConfig?: IpPortInterface;
    dnsConfig?: IpPortInterface;
}