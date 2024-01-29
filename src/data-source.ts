import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { Order } from "./entity/order";
// import { User } from "./entity/User.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: parseInt(DB_PORT, 10) || 3306,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  // synchronize: NODE_ENV === "dev" ? true : false,
//logging logs sql command on the treminal
  logging: NODE_ENV === "dev" ? true : false,
  entities: [Order],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});