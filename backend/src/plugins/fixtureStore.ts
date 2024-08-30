import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";
import fp from "fastify-plugin";

import * as fs from "fs";
import path from "path";
import { FixtureRecord } from "../interfaces/fixture.interface";

declare module "fastify" {
  export interface FastifyInstance {
    fixtureStore: {
      getFixtures: (logger: FastifyBaseLogger, page: number, size: number) => Promise<FixtureRecord[]>;
    };
  }
}

const pluginOptions: FastifyPluginOptions = {
  name: "fixtureStore",
};

const fixtureStore: FastifyPluginAsync = fp(async function (
  fastify: FastifyInstance,
) {
  let fixtures: FixtureRecord[] | undefined = undefined;

  const getFixtures = async (
    logger: FastifyBaseLogger,
    page: number,
    size: number,
  ): Promise<Array<FixtureRecord>> => {
    // If fixtures is not defined, fetch it from a json file and store it in the fixtures variable
    if (!fixtures) {
      const filePath = path.join(__dirname, "../static/fixtures.json");
      const data = fs.readFileSync(filePath, "utf-8");
      fixtures = JSON.parse(data);
    }

    if (fixtures) {
      const startIndex = (page - 1) * size;
      const endIndex = page * size;
      return fixtures.slice(startIndex, endIndex);
    } else {
      throw new Error("No fixtures found");
    }
  };

  fastify.decorate("fixtureStore", {
    getFixtures,
  });
}, pluginOptions);

export default fixtureStore;
