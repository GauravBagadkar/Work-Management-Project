module.exports = (sequelize, Sequelize) => {
    const timeEntry = sequelize.define('tblTimeEntry', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        first_start_time: {
            type: Sequelize.DATE
        },
        start_time: {
            type: Sequelize.DATE
        },
        end_time: {
            type: Sequelize.DATE
        },
        last_end_time: {
            type: Sequelize.DATE
        },
        minutes: {
            type: Sequelize.FLOAT
        }
    })
    return timeEntry;
}