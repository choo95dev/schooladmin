export default (sequelize, DataTypes) =>{
  const StudentClass = sequelize.define('studentclass', {
    studentId: {
      type: DataTypes.UUID,
      primaryKey:true
    },
    classId: {
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
    tableName: 'studentclass'
  });
  return StudentClass;
}
