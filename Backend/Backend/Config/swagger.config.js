// swagger.config.js
export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "YOLO Matrix API",
      version: "1.0.0",
      description: "API for YOLO Matrix luxury service platform",
    },
  },
  apis: ["./Routes/*.js"], // location of your route files for annotations
};
