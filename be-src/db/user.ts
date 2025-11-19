import { sequelize } from "./sequelize";
import { DataTypes, Model } from "sequelize";

class User extends Model { }
User.init(
  {
    email: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: "user"
  }
);
export { User };