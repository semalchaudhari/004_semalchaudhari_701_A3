import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('student_db', 'root', 'semal', {
  host: '127.0.0.1', // Use explicit IPv4 address instead of 'localhost'
  port: 3306,        // Default MySQL port (verify in Workbench if changed)
  dialect: 'mysql',
  logging: false,
});

export default sequelize;