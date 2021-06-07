import Sequelize from 'sequelize';
import Logger from './logger.js';
import Teacher from '../model/Teacher.js';
import Class from '../model/Class.js';
import Subject from '../model/Subject.js';
import Student from '../model/Student.js';
import StudentClass from '../model/StudentClass.js';
import TeacherClassSubject from '../model/TeacherClassSubject.js';

const LOG = new Logger('database.js');
const {
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_SCHEMA = 'school_administration_system',
  DB_USER = 'root',
  DB_PW = 'password',
  DB_POOL_ACQUIRE = '30000',
  DB_POOL_IDLE = '10000',
  DB_POOL_MAX_CONN = '10',
  DB_POOL_MIN_CONN = '1',
  DB_LOG_LEVEL = 'info',
} = process.env

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PW, {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  pool: {
    acquire: parseInt(DB_POOL_ACQUIRE),
    idle: parseInt(DB_POOL_IDLE),
    max: parseInt(DB_POOL_MAX_CONN),
    min: parseInt(DB_POOL_MIN_CONN)
  },
  timezone: '+08:00',
  logging: (msg) => {
    LOG[DB_LOG_LEVEL](msg);
  }
});

const db = {};
db.sequelize = sequelize;

db.teacher = Teacher(sequelize, Sequelize);
db.student = Student(sequelize, Sequelize);
db.subject = Subject(sequelize, Sequelize);
db.class = Class(sequelize,Sequelize);
db.studentClass = StudentClass(sequelize,Sequelize);
db.teacherClassSubject = TeacherClassSubject(sequelize,Sequelize);
// db.student.belongsToMany(db.class,{
//   through: 'studentclass',
//   as: 'classes',
//   foreignKey: 'classId',
// });
// db.class.belongsToMany(db.student,{
//   through: 'studentclass',
//   as: 'students',
//   foreignKey: 'studentId',
// });
db.teacher.belongsToMany(db.class,{
  through: 'teacherclasssubject',
  as: 'classes',
  foreignKey: 'classId',
});
db.class.belongsToMany(db.teacher,{
  through: 'teacherclasssubject',
  as: 'teachers',
  foreignKey: 'teacherId',
});
db.subject.belongsToMany(db.teacher,{
  through: 'teacherclasssubject',
  as: 'teachers',
  foreignKey: 'teacherId',
});
db.teacher.belongsToMany(db.subject,{
  through: 'teacherclasssubject',
  as: 'subjects',
  foreignKey: 'subjectId',
});



export default db;

