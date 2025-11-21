import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export const jwtPlugin = fp(async (app) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  app.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET,
  });

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );
});
