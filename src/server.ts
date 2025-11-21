// module: Fastify server bootstrap
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { jwtPlugin } from "./plugins/jwt";

import { fastifySwagger } from "@fastify/swagger";
import { fastifyCors } from "@fastify/cors";

import ScalarApiReference from "@scalar/fastify-api-reference";
import { vehicleRoutes } from "./routes/vehicle";
import { companyRoutes } from "./routes/company";
import { spotRoutes } from "./routes/spots";

const app = fastify().withTypeProvider<ZodTypeProvider>();
const PORT = Number(process.env.INITIAL_PORT || 3333);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Parking IFBA",
      version: "1.0.0",
      description: "parking API",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
  routePrefix: "/docs",
  configuration: {
    title: "Parking IFBA API Docs",
  },
});

app.register(jwtPlugin);

app.register(vehicleRoutes, { prefix: "/veiculos" });
app.register(companyRoutes, { prefix: "/empresas" });
app.register(spotRoutes, { prefix: "/:empresaId/vagas" });

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`🏃 HTTP server running on http://localhost:${PORT}`);
    console.log(`📗 Docs available on http://localhost:${PORT}/docs`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
