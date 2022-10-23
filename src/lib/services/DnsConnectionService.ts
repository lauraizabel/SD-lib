import net from "net";
import { IpPortInterface } from "../interfaces/IpPortInterface";

export interface DnsConfig {
  config: {
    method: "SET" | "GET";
    serviceName: string;
    address: string;
    port: number;
  };
  dnsAddress: string;
  dnsPort: number;
}

export default class DnsConnectionService {
  async setServerOn({ config, dnsAddress, dnsPort }: DnsConfig): Promise<any> {
    const { address, method, port, serviceName } = config;

    const configServer = {
      address,
      method,
      port,
      serviceName,
    };

    await net
      .connect(dnsPort, dnsAddress, () => {
        console.info("Middleware connected DNS");
      })
      .on("data", (_) => {})
      .on("error", (err) => console.log(err))
      .write(JSON.stringify(configServer));

    return;
  }

  async getIpAndPort(serviceName: string, dnsAddress: string, dnsPort: number) :Promise<IpPortInterface> {
    return await new Promise((resolve, reject) => {
      net
        .connect(dnsPort, dnsAddress)
        .on("data", (data) => {
          console.log("DATA",data.toString(), "END")
          try {
            const {path, port} = JSON.parse(data.toString())
            resolve({path, port});
          } catch (error) {
            const [path, port] = data.toString().split(":")
            resolve({path, port: parseInt(port)});
          }
        })
        .on("error", (err) => reject(err))
        .write(JSON.stringify({ serviceName }));
    });
  }
}
