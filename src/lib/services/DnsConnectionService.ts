import net from "net";

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
    try {
      const { address, method, port, serviceName } = config;


      // precisa alterar a formatacao desse json no dns
      const configServer = {
        address,
        method, 
        port, 
        serviceName
      };

      await net
        .connect(dnsPort, dnsAddress, () => {
          console.info("Middleware connected DNS");
        })
        .on("data", (_) => {})
        .on("error", (err) => console.log(err))
        .write(JSON.stringify(configServer));

      return;
    } catch (error) {
      console.log(error);
    }
  }
}
