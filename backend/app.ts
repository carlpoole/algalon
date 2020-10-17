import fastify from "fastify";
import config from '../config.json';
import apiRoutes from "./api";
import middleware from './middleware/cache'

export const server = fastify({ logger: config.log });
server.decorateReply('cache', middleware)

// Register API routes
server.register(apiRoutes, { prefix: '/api' });

// Health Check Route
server.get("/ping", async (_req: any, res: any) => {
  res.code(200).send({ pong: true });
});

// Start the server
server.listen(config.backend.port, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }

  server.log.info(`Algalon Back End is Online`)
});