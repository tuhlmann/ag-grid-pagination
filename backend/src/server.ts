// production entrypoint to run fastify via: node server.js
// this way, signals are trapped correctly and shutdown is graceful

import Fastify from "fastify";
import closeWithGrace from "close-with-grace";
import app from "./app";
import * as loggerConfig from "./logger";

const fastify = Fastify({
  logger: loggerConfig,
});

// Register the app
fastify.register(app);

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace(
  { delay: 10000 },
  async function ({ signal, err }) {
    if (err) {
      fastify.log.error(err, "Server shutting down with error");
    } else {
      const detailMessage: string = signal
        ? ", received signal: " + signal
        : "";
      fastify.log.warn("Server shutting down" + detailMessage);
    }
    await fastify.close();
  }
);

fastify.addHook("onClose", (instance, done) => {
  closeListeners.uninstall();
  done();
});

// Run the server!
fastify.listen(
  {
    port: process.env.FASTIFY_PORT
      ? parseInt(process.env.FASTIFY_PORT)
      : undefined,
    host: process.env.FASTIFY_ADDRESS,
  },
  (err) => {
    if (err) {
      fastify.log.error(err, "Error starting server");
      process.exit(1);
    }
  }
);
