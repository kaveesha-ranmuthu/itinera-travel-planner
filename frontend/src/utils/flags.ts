export const isProductionEnvironment = () =>
  import.meta.env.VITE_ENVIRONMENT === "prod";
