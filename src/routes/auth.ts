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
          login: z.string("Login não pode ser vazio"),
          senha: z
            .string("A senha não pode ser vazia")
            .min(4, "A senha deve ter pelo menos 4 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      const { login, senha } = request.body;

      const user = await prisma.usuario.findUnique({
        where: {
          login,
        },
      });

      if (!user) {
        reply.status(404).send({ message: "Credenciais incorretas" });
        return;
      }

      const passCorrect = await bcrypt.compare(senha, user.senhaHash);

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
          nome: z.string("O nome não pode ser vazio"),
          login: z.string("O login não pode ser vazio"),
          senha: z
            .string("A senha não pode ser vazia")
            .min(4, "A senha deve ter pelo menos 4 caracteres"),
        }),
      },
    },
    async (request, reply) => {
      const { nome, login, senha } = request.body;

      const user = await prisma.usuario.findUnique({
        where: {
          login,
        },
      });

      if (user) {
        reply.status(400).send({ message: "Login já existe" });
        return;
      }

      const hashedPassword = await bcrypt.hash(senha, 10);

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
