import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import fastifyEnvPlugin from "./plugins/fastifyEnv";
import fastifyStatic from "@fastify/static";
import * as path from "path";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // load environment variables first
  await fastify.register(fastifyEnvPlugin);

  // serve all files from static folder
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "static"),
    prefix: "/static/",
    // Provide a max-age in milliseconds for http caching
    maxAge: 86400000, // 1 day
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    ignorePattern: /fastifyEnv.*/,
    options: opts,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });
};

export default app;
export { app };
