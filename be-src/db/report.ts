import { sequelize } from "./sequelize";
import { DataTypes, Model } from "sequelize";

class Report extends Model { }
Report.init(
  {
    name: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    img: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
    }
  },
  {
    sequelize,
    modelName: "report"
  }
);
export { Report };