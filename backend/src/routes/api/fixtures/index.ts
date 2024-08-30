import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync } from "fastify";
import { FixtureSchema } from "./fixtures.schema";

const fixtures: FastifyPluginAsync = async (fastify): Promise<void> => {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
  const { fixtureStore } = fastify;
  const tags = ["data"];

  server.get(
    "/",
    {
      schema: {
        tags,
        querystring: Type.Object({
          page: Type.Number(),
          size: Type.Number(),
        }),
        response: {
          200: Type.Array(FixtureSchema),
        },
      },
    },
    async function (req, res) {
      const re = await fixtureStore.getFixtures(req.log, req.query.page, req.query.size);
      res.send(re)
    },
  );
};

export default fixtures;
