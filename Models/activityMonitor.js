module.exports = (sequelize, Sequelize) => {
    const activity = sequelize.define('tblActivity', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        activity_name: {
            type: Sequelize.STRING
        },
        app_name: {
            type: Sequelize.STRING
        },
        no_of_times_app_opened: {
            type: Sequelize.INTEGER
        },
        ip_address: {
            type: Sequelize.STRING
        },
        time_entry_id: {
            type: Sequelize.BIGINT
        },
        employee_id: {
            type: Sequelize.BIGINT
        }

    })
    return activity;
}