export default (sequelize, DataTypes) =>{
  const Subject = sequelize.define('subject', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
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
    tableName: 'subject'
  });
  return Subject;
}
