module.exports = (sequelize, Sequelize) => {
    const report = sequelize.define('tblReport', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        report: {
            type: Sequelize.BLOB
        },
        enployee_id: {
            type: Sequelize.INTEGER
        }
    })
    return report;
}