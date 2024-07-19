module.exports = (sequelize, Sequelize) => {
    const project = sequelize.define('tblProjects', {
        proName: {
            type: Sequelize.STRING
        },
        proDesc: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATEONLY
        },
        deadLine: {
            type: Sequelize.DATEONLY
        },
        deptId: {
            type: Sequelize.INTEGER
        },
        proLead: {
            type: Sequelize.STRING
        }
    })
    return project;
}