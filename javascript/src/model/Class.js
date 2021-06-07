export default (sequelize, DataTypes) =>{
  const Class = sequelize.define('class', {
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
    tableName: 'class'
  });
  return Class;
}
