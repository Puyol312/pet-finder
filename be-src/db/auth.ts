import { sequelize } from "./sequelize";
import { DataTypes, Model } from "sequelize";

class Auth extends Model { }
Auth.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "auth"
  }
);

export { Auth };