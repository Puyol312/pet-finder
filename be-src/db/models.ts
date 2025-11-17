import { User } from "./user";
import { Auth } from "./auth";
import { Report } from "./report";

User.hasOne(Auth, { foreignKey: "user_id" });
Auth.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Report, { foreignKey:"user_id" })
Report.belongsTo(User, { foreignKey:"user_id" })

export { User, Auth, Report }