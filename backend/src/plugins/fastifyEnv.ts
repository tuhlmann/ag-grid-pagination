import fp from "fastify-plugin";
import { fastifyEnv, FastifyEnvOptions } from "@fastify/env";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";

export const envSchema = Type.Object({
  NODE_ENV: Type.String({ default: "development" }),

  FASTIFY_ADDRESS: Type.String({ default: "0.0.0.0" }),
  FASTIFY_PORT: Type.String({ default: "3080" }),
});

type Schema = Static<typeof envSchema>;

// Use TypeScript module augmentation to declare the type of fastify.config to be type Schema
declare module "fastify" {
  interface FastifyInstance {
    config: Schema;
  }
}

// https://dev.to/olen_d/how-to-access-dotenv-variables-using-fastify-env-plugin-2i34
const options = {
  confKey: "config", // optional, default: 'config'
  schema: envSchema,
  dotenv: true,
  data: process.env,
};

/**
 * This plugins adds configuration
 *
 * @see https://github.com/fastify/fastify-env
 */
const fastifyEnvPlugin = fp<FastifyEnvOptions>(
  async (fastify: FastifyInstance) => {
    fastify.register(fastifyEnv, options);
  }
);

export default fastifyEnvPlugin;
