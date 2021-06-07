import Express from 'express';
import { StatusCodes } from 'http-status-codes';
import db from '../config/database.js';
import Logger from '../config/logger.js';
import ErrorCodes from '../const/ErrorCodes.js';
import  { check, validationResult } from 'express-validator';
const RegisterController = Express.Router();
const LOG = new Logger('RegisterController.js');

const registerHandler = async (req, res) => {
  try{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() })
    }
    var code = ErrorCodes.SUCCESS;
    code = await createTeacher(req.body.teacher);
    code = await createStudent(req.body.students);
    code = await createSubject(req.body.subject);
    code = await createClass(req.body.class);
    code = await createStudentClass(req.body.students,req.body.class);
    code=  await createTeacherClassSubject(req.body.teacher,req.body.class,req.body.subject);

    if(code == ErrorCodes.SUCCESS)
      return res.sendStatus(StatusCodes.NO_CONTENT);
    else{
      var errMsg = '';
      if(code == ErrorCodes.LIMIT_EXCEEDED){
        errMsg = 'A class and subject can only have 2 teacher teaching.';
      }
      return res.status(StatusCodes.BAD_REQUEST).send(errMsg);
    }
  }catch(err){
    LOG.error('Error reading json');
    console.log(err);
    return res.sendStatus(StatusCodes.BAD_REQUEST);
  }

}

const createTeacher = async (json) =>{

  if(!json){
    LOG.error('Teacher is empty');
    return ErrorCodes.RUNTIME_ERROR_CODE
  }
  try{

    const teacherExist = await db.teacher.findOne({where:{email:json.email}});
    if(teacherExist){
      return ErrorCodes.SUCCESS;
    }
    var transaction = await db.sequelize.transaction();
    const teacher ={
      name  : json.name,
      email : json.email
    }

    await db.teacher.create(teacher,{transaction});
    await transaction.commit();
    return ErrorCodes.SUCCESS;

  }catch(err){
    if (transaction) await transaction.rollback();
    LOG.error('Error inserting teacher');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
};

const createStudent = async (json) =>{
  if(!json){
    LOG.error('Student array is empty');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
  var index = 0;
  for(const s of json){
    try{
      var transaction = await db.sequelize.transaction();
      const studentExist = await db.student.findOne({where:{email:s.email}});
      if(!studentExist){
        const student ={
          name : s.name,
          email : s.email
        }
        await db.student.create(student,{transaction});
        await transaction.commit();
      }
      index++;
    }catch(err){
      if (transaction) await transaction.rollback();
      LOG.error(`Error inserting student at index ${index}`);
      LOG.error(err);
      return ErrorCodes.RUNTIME_ERROR_CODE;
    }
  }
  // json.forEach(async (s) => {
  //   try{
  //     var transaction = await db.sequelize.transaction();
  //     const studentExist = await db.student.findOne({where:{email:s.email}});
  //     if(!studentExist){
  //       const student ={
  //         name : s.name,
  //         email : s.email
  //       }
  //       await db.student.create(student,{transaction});
  //       await transaction.commit();
  //     }
  //     index++;
  //   }catch(err){
  //     if (transaction) await transaction.rollback();
  //     LOG.error(`Error inserting student at index ${index}`);
  //     LOG.error(err);
  //     return ErrorCodes.RUNTIME_ERROR_CODE;
  //   }
  // });
  return ErrorCodes.SUCCESS;
};

const createSubject = async (json) =>{

  if(!json){
    LOG.error('Subject is empty');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
  try{

    const subjectExist = await db.subject.findOne({where:{code:json.subjectCode}});
    if(!subjectExist){
      var transaction = await db.sequelize.transaction();
      const subject ={
        name  : json.name,
        code : json.subjectCode
      }

      await db.subject.create(subject,{transaction});
      await transaction.commit();
      return ErrorCodes.SUCCESS;
    }

  }catch(err){
    if (transaction) await transaction.rollback();
    LOG.error('Error inserting subject');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
};

const createClass = async (json) =>{

  if(!json){
    LOG.error('Class is empty');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
  try{

    const classExist = await db.class.findOne({where:{code:json.classCode}});
    if(classExist){
      return ErrorCodes.SUCCESS;
    }
    var transaction = await db.sequelize.transaction();
    const classObj ={
      name  : json.name,
      code : json.classCode
    }

    await db.class.create(classObj,{transaction});
    await transaction.commit();
    return ErrorCodes.SUCCESS;

  }catch(err){
    if (transaction) await transaction.rollback();
    LOG.error('Error inserting class');
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
};

const createStudentClass = async (studentBody,classBody) =>{
  const classObj = await db.class.findOne({where:{code:classBody.classCode}});
  for(const s of studentBody){
    try{
      var transaction = await db.sequelize.transaction();
      const student = await db.student.findOne({where:{email:s.email}});
      // const studentClass = await db.student.findOne({
      //   where:{email:s.email},
      //   include: [{
      //     model:db.class,
      //     as: 'classes',
      //     where: {id:classObj.id}
      //   }]
      // });
      const studentClass = await db.studentClass.findOne({where:{studentId:student.id,classId:classObj.id}});
      if(!studentClass){
        // const student = await db.student.findOne({where:{email:s.email}});
        // var currentDate =new Date().toISOString().slice(0, 19).replace('T', ' ');
        // await db.sequelize.query(`INSERT INTO studentclass (createdAt,updatedAt,classId,studentId)
        // VALUES ('${currentDate}','${currentDate}',${classObj.id},${student.id});`)
        const studentClassObj = {
          studentId : student.id,
          classId : classObj.id
        };
        await db.studentClass.create(studentClassObj);
        await transaction.commit();
        return ErrorCodes.SUCCESS;
      }
    }catch(err){
      LOG.error('Error inserting student class obj');
      if (transaction) await transaction.rollback();
      return ErrorCodes.RUNTIME_ERROR_CODE;
    }
  }
  // studentBody.forEach(async (s) => {
  //   try{
  //     var transaction = await db.sequelize.transaction();
  //     const student = await db.student.findOne({where:{email:s.email}});
  //     // const studentClass = await db.student.findOne({
  //     //   where:{email:s.email},
  //     //   include: [{
  //     //     model:db.class,
  //     //     as: 'classes',
  //     //     where: {id:classObj.id}
  //     //   }]
  //     // });
  //     const studentClass = await db.studentClass.findOne({where:{studentId:student.id,classId:classObj.id}});
  //     if(!studentClass){
  //       // const student = await db.student.findOne({where:{email:s.email}});
  //       // var currentDate =new Date().toISOString().slice(0, 19).replace('T', ' ');
  //       // await db.sequelize.query(`INSERT INTO studentclass (createdAt,updatedAt,classId,studentId)
  //       // VALUES ('${currentDate}','${currentDate}',${classObj.id},${student.id});`)
  //       const studentClassObj = {
  //         studentId : student.id,
  //         classId : classObj.id
  //       };
  //       await db.studentClass.create(studentClassObj);
  //       await transaction.commit();
  //       return ErrorCodes.SUCCESS;
  //     }
  //   }catch(err){
  //     LOG.error('Error inserting student class obj');
  //     if (transaction) await transaction.rollback();
  //     return ErrorCodes.RUNTIME_ERROR_CODE;
  //   }
  // });

  return ErrorCodes.SUCCESS;

};

const createTeacherClassSubject = async (teacherBody,classBody,subjectBody) =>{
  const classObj = await db.class.findOne({where:{code:classBody.classCode}});
  const subject = await db.subject.findOne({where:{code:subjectBody.subjectCode}});
  const teacher = await db.teacher.findOne({where:{email:teacherBody.email}});
  try{
    var transaction = await db.sequelize.transaction();
    const teacherClassSubject = await db.teacherClassSubject.findOne({where:{
      teacherId:teacher.id,
      classId:classObj.id,
      subjectId:subject.id
    }});
    if(!teacherClassSubject){
      const classTeacherCount = await db.teacherClassSubject.findAndCountAll({where:{
        classId:classObj.id,
        subjectId:subject.id
      }});
      if(classTeacherCount.count < 2){
        const teacherClassSubjectObj = {
          teacherId : teacher.id,
          classId : classObj.id,
          subjectId: subject.id
        };
        await db.teacherClassSubject.create(teacherClassSubjectObj);
        await transaction.commit();
      }else{
        return ErrorCodes.LIMIT_EXCEEDED;
      }
    }
    return ErrorCodes.SUCCESS;
  }catch(err){
    LOG.error('Error inserting teacher class subject obj');
    if (transaction) await transaction.rollback();
    return ErrorCodes.RUNTIME_ERROR_CODE;
  }
};


const validateInput = (method) =>{
  switch(method){
  case 'register':
    return [
      check('teacher').exists().withMessage('teacher parameter is required'),
      check('students').isArray({ min: 1 }).withMessage('students must be an array with min length of 1'),
      check('class').exists().withMessage('class parameter is required'),
      check('subject').exists().withMessage('subject parameter is required'),
    ];
  }
}


RegisterController.post('/', validateInput('register'),registerHandler);

export default RegisterController;
