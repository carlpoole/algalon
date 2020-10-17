"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var config_json_1 = __importDefault(require("../config.json"));
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
    //console.log(reply.raw);
    reply.code(200).send({ pong: "it worked!" });
});
server.listen(config_json_1.default.backend.port, function (err) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    server.log.info("server listening on " + config_json_1.default.backend.port);
});
