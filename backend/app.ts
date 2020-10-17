import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import config from '../config.json';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

server.get("/ping", opts, (_request, reply) => {
  //console.log(reply.raw);
  reply.code(200).send({ pong: "it worked!" });
});

server.listen(config.backend.port, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }

  server.log.info(`server listening on ${config.backend.port}`)
})