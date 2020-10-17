import fastify from "fastify";
import config from '../config.json';
import apiRoutes from "./api";

const server = fastify({ logger: config.log });

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