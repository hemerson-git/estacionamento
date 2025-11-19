import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { StatusVaga, TipoVaga } from "@prisma/client";

export async function spotRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        params: z.object({
          empresaId: z.string().transform(Number),
        }),
      },
    },
    async (request) => {
      const spots = await prisma.vaga.findMany({
        where: {
          empresa: {
            id_empresa: Number(request.params.empresaId),
          },
        },
      });
      return spots;
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: z.object({
          numero: z.number(),
          type: z
            .string()
            .refine((value) => value === "CARRO" || value === "MOTO", {
              message: "Tipo inválido. Deve ser 'CARRO' ou 'MOTO'.",
            }),
          status: z
            .string()
            .nullable()
            .refine(
              (value) =>
                value === undefined || value === "LIVRE" || value === "OCUPADA",
              {
                message: "Status inválido. Deve ser 'LIVRE' ou 'OCUPADA'.",
              }
            ),
        }),
        params: z.object({
          empresaId: z.string().transform(Number),
        }),
      },
    },
    async (request, reply) => {
      const data = request.body;

      const existingSpot = await prisma.vaga.findFirst({
        where: {
          empresaId: Number(request.params.empresaId),
          numero: data.numero,
        },
      });

      if (existingSpot) {
        return reply.status(400).send({
          message: "Número de vaga já existe para essa empresa.",
        });
      }

      const spot = await prisma.vaga.create({
        data: {
          empresaId: Number(request.params.empresaId),
          numero: data.numero,
          tipo: data.type as TipoVaga,
          status: data.status as StatusVaga | undefined,
        },
        select: {
          id_vaga: true,
          numero: true,
          status: true,
          tipo: true,
        },
      });

      return reply.status(201).send(spot);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:spotId",
    {
      schema: {
        body: z.object({
          numero: z.number(),
          type: z
            .string()
            .refine((value) => value === "CARRO" || value === "MOTO", {
              message: "Tipo inválido. Deve ser 'CARRO' ou 'MOTO'.",
            }),
          status: z
            .string()
            .nullable()
            .refine(
              (value) =>
                value === undefined || value === "LIVRE" || value === "OCUPADA",
              {
                message: "Status inválido. Deve ser 'LIVRE' ou 'OCUPADA'.",
              }
            ),
        }),
        params: z.object({
          spotId: z.string().transform(Number),
        }),
      },
    },
    async (request, reply) => {
      const data = request.body;
      const spotId = Number(request.params.spotId);

      const existingSpot = await prisma.vaga.findFirst({
        where: {
          id_vaga: spotId,
        },
      });

      if (!existingSpot) {
        return reply.status(404).send({
          message: "Vaga não encontrada.",
        });
      }

      const updatedSpot = await prisma.vaga.update({
        where: {
          id_vaga: spotId,
        },
        data: {
          numero: data.numero,
          tipo: data.type as TipoVaga,
          status: data.status as StatusVaga | undefined,
        },
        select: {
          id_vaga: true,
          numero: true,
          status: true,
          tipo: true,
        },
      });

      return reply.status(200).send(updatedSpot);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:spotId",
    {
      schema: {
        params: z.object({
          spotId: z.string().transform(Number),
        }),
      },
    },
    async (request, reply) => {
      const spotId = Number(request.params.spotId);

      const existingSpot = await prisma.vaga.findFirst({
        where: {
          id_vaga: spotId,
        },
      });

      if (!existingSpot) {
        return reply.status(404).send({
          message: "Vaga não encontrada.",
        });
      }

      await prisma.vaga.delete({
        where: {
          id_vaga: spotId,
        },
      });

      return reply.status(204).send();
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:spotId/ocupar",
    {
      schema: {
        params: z.object({
          spotId: z.string().transform(Number),
        }),
        body: z.object({
          placa: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const spotId = Number(request.params.spotId);
      const data = request.body;

      const existingSpot = await prisma.vaga.findFirst({
        where: {
          id_vaga: spotId,
        },
      });

      if (!existingSpot) {
        return reply.status(404).send({
          message: "Vaga não encontrada.",
        });
      }

      if (existingSpot.status === "OCUPADA") {
        return reply.status(400).send({
          message: "Vaga já está ocupada.",
        });
      }

      const existingVehicle = await prisma.veiculo.findFirst({
        where: {
          placa: data.placa,
        },
      });

      if (!existingVehicle) {
        return reply.status(404).send({
          message: "Veículo não encontrado.",
        });
      }

      const horaEntrada = new Date();

      await prisma.$transaction([
        prisma.vaga.update({
          where: {
            id_vaga: spotId,
          },
          data: {
            status: "OCUPADA",
          },
        }),
        prisma.veiculo_vaga.create({
          data: {
            id_vaga: existingSpot.id_vaga,
            id_veiculo: existingVehicle.id,
            hora_entrada: horaEntrada,
          },
        }),
      ]);

      return reply.status(204).send({
        message: "Vaga ocupada com sucesso.",
        entrada: horaEntrada.toISOString(),
      });
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:spotId/desocupar",
    {
      schema: {
        params: z.object({
          spotId: z.string().transform(Number),
        }),
      },
    },
    async (request, reply) => {
      const spotId = Number(request.params.spotId);

      const existingSpot = await prisma.vaga.findFirst({
        where: {
          id_vaga: spotId,
        },
      });

      if (!existingSpot) {
        return reply.status(404).send({
          message: "Vaga não encontrada.",
        });
      }

      if (existingSpot.status === "LIVRE") {
        return reply.status(400).send({
          message: "Vaga já está livre.",
        });
      }
    }
  );
}
