import { Sequelize } from "sequelize";

const sequelize = new Sequelize("auth_Jwt", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

export default sequelize;
