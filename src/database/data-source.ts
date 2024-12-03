import { DataSource } from "typeorm";

export default new DataSource({
  type: "postgres",
  username: "postgres",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "postgres",
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/database/migrations/*.js"],
});


//Command to generate a migrations

  //npm build && npm typeorm migration:generate -d dist/database/data-source -p src/database/migrations/create-user