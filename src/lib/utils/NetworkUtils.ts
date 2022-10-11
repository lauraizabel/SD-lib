import os from "os";

const networkInterfaces = os.networkInterfaces();

const keys = Object.keys(networkInterfaces);

export const ipv4Ips = keys.flatMap((key) =>
  networkInterfaces[key]?.filter(
    (net) => net.family === "IPv4" && !net.internal
  )
);
