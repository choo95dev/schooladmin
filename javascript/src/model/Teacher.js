export default (sequelize, DataTypes) =>{
  const Teacher = sequelize.define('teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'teacher'
  });

  return Teacher;
};
