import { FastifyInstance, RouteShorthandOptions } from "fastify";

export default async function (server: FastifyInstance, opts: RouteShorthandOptions, next: () => void) {

    server.get("/ping", opts, (_request, reply) => {
        reply.code(200).send({ pong: "it worked!" });
    });

    server.get("/status", opts, (_request, reply) => {
        reply.send({ date: new Date(), works: true });
    });
  
    next();
};