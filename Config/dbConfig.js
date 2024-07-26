require('dotenv').config();
import pg from 'pg';
const Sequelize = require('sequelize').Sequelize;


// const sequelize = new Sequelize('workManagement', 'postgres', 'HsmOnline', {
//     host: 'localhost',
//     dialect: 'postgres',
//     port: '5432',
//     logging: false
// });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// requiring models
db.user = require('../Models/user')(sequelize, Sequelize);
db.orgs = require('../Models/organisation')(sequelize, Sequelize);
db.dept = require('../Models/dept')(sequelize, Sequelize);
db.role = require('../Models/role')(sequelize, Sequelize);
db.project = require('../Models/project')(sequelize, Sequelize);
db.task = require('../Models/task')(sequelize, Sequelize);
db.priority = require('../Models/tskPriority')(sequelize, Sequelize);
db.status = require('../Models/tskStatus')(sequelize, Sequelize);
db.notes = require('../Models/notes')(sequelize, Sequelize);

// connecting models
db.user.belongsTo(db.dept, { foreignKey: 'deptId' });
db.user.belongsTo(db.role, { foreignKey: 'roleId' });
// db.role.hasMany(db.user,{foreignKey:'roleName'})
db.user.belongsTo(db.orgs, { foreignKey: 'orgId' });
db.task.belongsTo(db.priority, { foreignKey: 'priorityId' });
db.task.belongsTo(db.status, { foreignKey: 'statusId' });
//db.dept.belongsTo(db.orgs, { foreignKey: 'orgId' });
//db.role.belongsTo(db.orgs, { foreignKey: 'orgId' });
db.notes.belongsTo(db.user, { foreignKey: 'userId' });

module.exports = db;