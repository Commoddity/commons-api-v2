const SERVER_ENV: { [key: string]: { SERVER_PORT: number } } = {
  production: {
    SERVER_PORT: Number(process.env.IWIP_SERVER_PORT) || 4800,
  },
  test: {
    SERVER_PORT: 4800,
  },
  dev: {
    SERVER_PORT: 4000,
  },
};

const serverConfig = SERVER_ENV[process.env.NODE_ENV || "dev"];

export { serverConfig };
