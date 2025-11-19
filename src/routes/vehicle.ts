import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function vehicleRoutes(app: FastifyInstance) {
  app.get("/vehicles", async () => {
    // const vehicles = await prisma.vehicle.findMany();
    const vehicles = [
      {
        id: 1,
        plate: "ABC-1234",
        model: "Fusca",
      },
      {
        id: 2,
        plate: "XYZ-5678",
        model: "Gol",
      },
    ];
    return vehicles;
  });

  app.post("/vehicles", async (request, reply) => {
    const body = request.body as { plate: string; model?: string };

    const created = await prisma.veiculo.create({
      data: {},
    });

    reply.code(201).send(created);
  });
}
