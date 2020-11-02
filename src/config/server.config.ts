const SERVER_ENV: { [key: string]: { SERVER_PORT: number } } = {
  production: {
    SERVER_PORT: Number(process.env.IWIP_SERVER_PORT) || 4800,
  },
  preproduction: {
    SERVER_PORT: 4800,
  },
  development: {
    SERVER_PORT: 4000,
  },
};

const serverConfig = SERVER_ENV[process.env.NODE_ENV || "development"];

export { serverConfig };
