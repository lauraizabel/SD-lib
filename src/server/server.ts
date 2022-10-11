import Lib from "../lib/app";
import "../lib/utils/NetworkUtils";
import { RequestInterface } from "../lib/interfaces/RequestInterface";
import { ResponseInterface } from "../lib/interfaces/ResponseInterface";

const postRequestTest = (
  request: RequestInterface,
  response: ResponseInterface
) => {
  const body = request.body;

  body.name = "laura";

  return {
    status: 200,
    json: body,
  };
};

const getRequestTest = (
  request: RequestInterface,
  response: ResponseInterface
) => {
  return {
    status: 200,
    json: {
      message: "algo tá dando bom aqui",
    },
  };
};

const deleteRequestTest = (
  request: RequestInterface,
  response: ResponseInterface
) => {
  return {
    status: 200,
    json: "deletado com sucesso",
  };
};

const putRequestTest = (
  request: RequestInterface,
  response: ResponseInterface
) => {
  const body = request.body;

  body.name = "holla";

  return {
    status: 200,
    json: body,
  };
};

Lib.route({
  path: "get",
  method: "GET",
  controller: getRequestTest,
});

Lib.route({
  path: "post",
  method: "POST",
  controller: postRequestTest,
});

Lib.route({
  path: "put",
  method: "PUT",
  controller: putRequestTest,
});

Lib.route({
  path: "delete",
  method: "DELETE",
  controller: deleteRequestTest,
});

Lib.start(3000);
