const allowedOrigins = require("./allowedOrigins");
const corsOptions = {
  origin: (origin, callback) => {
    // allow origin as undefined in development environment
    if (
      allowedOrigins.includes(origin) ||
      (process.env.ENV === "DEV" && !origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("origin blocked, not allowed by CORS"));
    }
    console.log("origin", origin);
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
