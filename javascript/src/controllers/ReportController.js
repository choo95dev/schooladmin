import Express from 'express';
import { StatusCodes } from 'http-status-codes';
import db from '../config/database.js';
import Logger from '../config/logger.js';

const ReportController = Express.Router();
const LOG = new Logger('ReportController.js');

const reportHandler = async (req, res) => {
  var results = {};
  try{
    const teachers = await db.teacher.findAll();
    for(const t of teachers) {
      // const teacherSubjectClassObjs = await db.teacher.findAndCountAll({
      //   where : {id:t.id},
      //   include: [{
      //     model:db.class,
      //     as: 'classes',
      //   },{
      //     model:db.subject,
      //     as:'subjects'
      //   }]
      // });

      var key = t.name;
      results[key] = {};
      //Get all the subject id and class id of the teacher
      const teacherSubjectClassObjs = await db.teacherClassSubject.findAll({
        attributes: ['subjectId', [db.sequelize.fn('COUNT', db.sequelize.col('classId')), 'classCount']],
        where:{teacherId:t.id},
        group: ['subjectId'],
      });
      //if a teacher and not assigned to any class or subject yet
      if(teacherSubjectClassObjs.length == 0){
        continue;
      }
      var subjectArray = await getSubjectArray(teacherSubjectClassObjs);
      results[key] =subjectArray;
    }
    return res.status(StatusCodes.OK).send(results);
  }catch(err){
    LOG.error('Something went wrong when generating workload report');
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

const getSubjectArray = async (teacherSubjectClassObjs) =>{
  var subjectArray = [];
  for(const obj of teacherSubjectClassObjs){
    const subject = await db.subject.findOne({where:{id: obj.subjectId}});
    var data = {
      subjectCode:subject.code,
      subjectName:subject.name,
      numberOfClasses:obj.dataValues.classCount
    };
    subjectArray.push(data);
  }
  // teacherSubjectClassObjs.forEach(async (obj)=>{
  //   const subject = await db.subject.findOne({where:{id: obj.subjectId}});
  //   var data = {
  //     subjectCode:subject.code,
  //     subjectName:subject.name,
  //     numberOfClasses:obj.dataValues.classCount
  //   };
  //   subjectArray.push(data);
  // });
  return subjectArray;
};

ReportController.get('/workload', reportHandler);

export default ReportController;
