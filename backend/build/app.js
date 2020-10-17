"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var fs_1 = __importDefault(require("fs"));
var config = JSON.parse(fs_1.default.readFileSync('../config.json', 'utf8'));
var server = fastify_1.default({});
var opts = {
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
server.get("/ping", opts, function (_request, reply) {
    console.log(reply.raw);
    reply.code(200).send({ pong: "it worked!" });
});
server.listen(8080, function (err) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info("server listening on 8080");
});
