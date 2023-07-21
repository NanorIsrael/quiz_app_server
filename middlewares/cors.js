const cors = require("cors");

const allowedOrigins = process.env.ALLOWED_ORIGINS;
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const isAllowed = allowedOrigins.includes(origin);
    if (!isAllowed) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      console.log(
        "this origin gives error - " + origin + " with message " + msg,
      );
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200,
  exposedHeaders: "x-auth-token",
};

module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptions);
