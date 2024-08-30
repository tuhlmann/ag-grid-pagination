import { PinoLoggerOptions } from "fastify/types/logger";

const loggerConfig: PinoLoggerOptions = {
  level: "info",
  formatters: {
    level: (label) => {
      // Return log level as a string instead of number
      return { level: label.toLowerCase() };
    },
  },
};

// export default does not work
module.exports = loggerConfig;
