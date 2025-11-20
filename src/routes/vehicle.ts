import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const prisma = new PrismaClient();

export async function vehicleRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const vehicles = await prisma.veiculo.findMany();

    return vehicles;
  });

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: z.object({
          placa: z
            .string()
            .max(7, "Placa inválida. Deve ter no máximo 7 caracteres.")
            .min(7, "Placa inválida. Deve ter no mínimo 7 caracteres."),
          modelo: z.string(),
          cor: z.string(),
          nome_cliente: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const data = request.body;

      const created = await prisma.veiculo.create({
        data,
      });

      reply.code(201).send(created);
    }
  );
}
