import { prisma } from "@/lib/prisma";

export const companyExists = async (cnpj: string) => {
  const existCompany = await prisma.empresa.findFirst({
    where: {
      cnpj,
    },
    include: {
      _count: {
        select: {
          vagas: true,
        },
      },
    },
  });

  return existCompany;
};
