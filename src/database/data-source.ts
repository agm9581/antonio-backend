import { DataSource } from "typeorm";
import * as dotenv from 'dotenv'

export default new DataSource({
  type: "postgres",
  url: process.env.DATASOURCE_URL,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/database/migrations/*.js"],
});

//Command to generate a migrations

//npm build && npm typeorm migration:generate -d dist/database/data-source -p src/database/migrations/create-user
