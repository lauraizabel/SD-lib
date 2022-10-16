import Lib from "../lib/app";

const init = async () => {
  await Lib.start(3000, "localhost");

  await Lib.setDnsConnection(1234, "127.0.0.1");
};

init();
