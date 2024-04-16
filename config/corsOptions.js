const whitelist = [
  "https://www.google.com",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow origin as undefined in development environment
    if (whitelist.includes(origin) || (process.env.ENV === "dev" && !origin)) {
      callback(null, true);
    } else {
      callback(new Error("origin blocked, not allowed by CORS"));
    }
    console.log("origin", origin);
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
