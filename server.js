const fastify = require("fastify")({ logger: true });
const path = require("path");
require("dotenv").config();

// register cors

fastify.register(require('@fastify/cors'))

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
