import { Static, Type } from "@sinclair/typebox";

export const FixtureSchema = Type.Object(
  {
    autoincrement: Type.Number(),
    guid: Type.String({ format: "uuid" }),
    region: Type.String(),
    country: Type.String(),
    numberrange: Type.Number(),
    alphanumeric: Type.String(),
    phone: Type.String(),
  },
  { $id: "Fixture" },
);

export type Fixture = Static<typeof FixtureSchema>;


