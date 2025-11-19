import { Empresa } from "@prisma/client";

type CompanyWithVagas = Empresa & {
  _count: {
    vagas: number;
  };
};

export const formatCompany = (company: CompanyWithVagas) => {
  const { numero_vagas, _count, ...rest } = company;

  return {
    ...rest,
    numero_vagas: company._count.vagas,
  };
};
