import { TypeOrmModuleOptions } from "./../../../node_modules/@nestjs/typeorm/dist/interfaces/typeorm-options.interface.d";
import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
  const config = {
    type: "postgres",
    url: process.env.DATASOURCE_URL,
    autoLoadEntities: true,
  } as const satisfies TypeOrmModuleOptions;
  return config;
});
