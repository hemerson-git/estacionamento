import { prisma } from "@/lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";

export const authRoutes = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        body: z.object({
          login: z.string(),
          senhaHash: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { login, senhaHash } = request.body;

      const user = await prisma.usuario.findUnique({
        where: {
          login,
        },
      });

      if (!user) {
        reply.status(404).send({ message: "Credenciais incorretas" });
        return;
      }

      const passCorrect = await bcrypt.compare(senhaHash, user.senhaHash);

      if (!passCorrect) {
        reply.status(404).send({ message: "Credenciais incorretas" });
        return;
      }

      const token = app.jwt.sign(
        {
          id_usuario: user.id_usuario,
          login: user.login,
        },
        {
          expiresIn: "2h",
        }
      );

      return reply.send({
        token,
        user: {
          nome: user.nome,
          login: user.login,
        },
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/cadastro",
    {
      schema: {
        body: z.object({
          nome: z.string(),
          login: z.string(),
          senhaHash: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { nome, login, senhaHash } = request.body;

      const user = await prisma.usuario.findUnique({
        where: {
          login,
        },
      });

      if (user) {
        reply.status(400).send({ message: "Login já existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(senhaHash, 10);

      await prisma.usuario.create({
        data: {
          nome,
          login,
          senhaHash: hashedPassword,
        },
      });

      reply.status(201).send({ message: "Usuário criado com sucesso" });
    }
  );
};
