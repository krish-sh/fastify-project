const fastify = require("fastify")({ logger: true });
const path = require("path");
require("dotenv").config();

// register cors

fastify.register(require("@fastify/cors"));
fastify.register(require("@fastify/env"), {
  dotenv: true,
  schema: {
    type: "object",
    required: ["PORT", "MONGODB_URI", "JWT_TOKEN"],
    properties: {
      PORT: { type: "string", default: 3000 },
      MONGODB_URI: { type: "string" },
      JWT_TOKEN: { type: "string" },
    },
  },
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    fastify.log.info(
      `Server is running at http://localhost:${process.env.PORT}`
    );
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
