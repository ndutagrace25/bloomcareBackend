'use strict';
module.exports = (sequelize, DataTypes) => {
  const PersonnelType = sequelize.define('PersonnelType', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_by: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    modified_by: {
      type: DataTypes.INTEGER
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updated_at: {
      type: DataTypes.DATE
    }
  }, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
    // your other configuration here
  });
  PersonnelType.associate = function (models) {
    // associations can be defined here
    PersonnelType.hasMany(models.Personnel, {
      foreignKey: 'id',
      as: 'personnel'
    })
  };
  return PersonnelType;
};