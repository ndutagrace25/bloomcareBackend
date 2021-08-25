'use strict';
module.exports = (sequelize, DataTypes) => {
  const IssueType = sequelize.define('IssueType', {
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
    timestamps: true,
    operatorsAliases: false
  });
  IssueType.associate = function (models) {
    // associations can be defined here
    IssueType.hasMany(models.Issue, {
      foreignKey: 'id',
      as: 'issues'
    })
  };
  return IssueType;
};