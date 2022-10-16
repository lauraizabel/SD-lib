import net from "net";
import { scoped, registry, Lifecycle } from "tsyringe";

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: "DnsConnectionService", useClass: DnsConnectionService }])
export default class DnsConnectionService {
  constructor() {}

  async startConnection(
    path: string,
    port: number,
    keepAlive: boolean = false
  ): Promise<any> {
    try {
      await net
        .connect(port, path, () => {
          console.info("Middleware connected DNS");
        })
        .on("data", (data) => {
          console.log(data);
        })
        .on("error", (err) => console.log(err))
        .write(
          JSON.stringify({
            method: "SET",
            hostname: "setapproval",
            ip: "127.0.0.1",
            port: 8888,
          })
        );

      return;
    } catch (error) {
      console.log(error);
    }
  }
}
