export default (sequelize, DataTypes) =>{
  const TeacherClassSubject = sequelize.define('teacherclasssubject', {
    teacherId: {
      type: DataTypes.UUID,
      primaryKey:true
    },
    classId: {
      type: DataTypes.UUID,
      primaryKey:true
    },
    subjectId: {
      type: DataTypes.UUID,
      primaryKey:true
    },
    createdAt:{
      type: DataTypes.DATE,
      allowNull: false,
      default: Date.now()
    },
    updatedAt:{
      type: DataTypes.DATE,
      allowNull: false,
      default: Date.now()
    }
  },{
    tableName: 'teacherclasssubject'
  });
  return TeacherClassSubject;
}
