import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import config from '../config.json';
import apiRoutes from "./api";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({ logger: true });

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

// Register API routes
server.register(apiRoutes, { prefix: '/api' });

// Start the server
server.listen(config.backend.port, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }

  server.log.info(`Algalon Back End is Online`)
});