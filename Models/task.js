module.exports = (sequelize, Sequelize) => {
    const task = sequelize.define('tblTasks', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        taskName: {
            type: Sequelize.STRING
        },
        taskDesc: {
            type: Sequelize.STRING
        },
        startDate: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        endDate: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        startTaskTime: {
            type: Sequelize.TIME,
            // defaultValue: Sequelize.NOW
        },
        endTaskTime: {
            type: Sequelize.TIME,
            // defaultValue: Sequelize.NOW
        },
        totalTaskTime: {//
            type: Sequelize.TIME
        },
        isPause: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        startPauseTime: {
            type: Sequelize.TIME,
            // defaultValue: Sequelize.NOW
        },
        endPauseTime: {
            type: Sequelize.TIME,
            // defaultValue: Sequelize.NOW
        },
        totalPauseTime: {//
            type: Sequelize.TIME
        },
        taskProductivityHrs: {//
            type: Sequelize.TIME
        },
        proId: {
            type: Sequelize.INTEGER
        },
        priorityId: {
            type: Sequelize.INTEGER
        },
        statusId: {
            type: Sequelize.INTEGER
        },
        categoryId: {
            type: Sequelize.INTEGER
        },

    })
    return task;
}