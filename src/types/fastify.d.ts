import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    jwt: {
      sign: (payload: any, options?: any) => string;
      verify: (token: string, options?: any) => any;
    };
    authenticate: any;
  }

  interface FastifyRequest {
    jwtVerify: () => Promise<any>;
    user: any;
  }
}
