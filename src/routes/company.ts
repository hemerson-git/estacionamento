import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { companyExists } from "@/utils/company-exists";
import { formatCompany } from "@/utils/format-company";

const companySchema = {
  body: z.object({
    cnpj: z.string(),
    nome: z.string(),
    endereco: z.string().max(100),
    telefone: z.string(),
    numero_vagas: z.number().int(),
    valor_hora: z.number().optional(),
  }),
};

export async function companyRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: app.authenticate,
    },
    async () => {
      const companies = await prisma.empresa.findMany({
        include: {
          _count: {
            select: {
              vagas: true,
            },
          },
        },
      });

      return companies.map(formatCompany);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: companySchema,
    },
    async (request, reply) => {
      const data = request.body;

      const company = await prisma.empresa.create({
        data,
        include: {
          _count: {
            select: {
              vagas: true,
            },
          },
        },
      });

      return formatCompany(company);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().put(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: companySchema.body,
      },
    },
    async (request, reply) => {
      const data = request.body;
      const id = request.params.id;

      const company = await companyExists(data.cnpj);

      if (!company) {
        return reply.status(400).send({ error: "CNPJ não está cadastrado" });
      }

      const updatedCompany = await prisma.empresa.update({
        where: {
          id_empresa: Number(id),
        },
        data,
        include: {
          _count: {
            select: {
              vagas: true,
            },
          },
        },
      });

      return formatCompany(updatedCompany);
    }
  );

  app.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const id = request.params.id;

      const company = await companyExists(id);

      if (!company) {
        return reply.status(400).send({ error: "Empresa não está cadastrada" });
      }

      await prisma.empresa.delete({
        where: {
          id_empresa: Number(id),
        },
      });

      return reply.status(204).send();
    }
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const id = request.params.id;

      const company = await prisma.empresa.findFirst({
        where: {
          id_empresa: Number(id),
        },
        include: {
          _count: {
            select: {
              vagas: true,
            },
          },
        },
      });

      if (!company) {
        return reply.status(400).send({ error: "Empresa não está cadastrada" });
      }

      return formatCompany(company);
    }
  );
}
