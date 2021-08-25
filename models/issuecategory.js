'use strict';
module.exports = (sequelize, DataTypes) => {
  const IssueCategory = sequelize.define('IssueCategory', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    issue_id: {
      allowNull: false,
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
  IssueCategory.associate = function (models) {
    // associations can be defined here
    IssueCategory.hasMany(models.Scout, {
      foreignKey: 'id',
      as: 'scouts'
    })

    IssueCategory.belongsTo(models.Issue, {
      foreignKey: 'issue_id',
      onDelete: 'CASCADE'
    })

  };
  return IssueCategory;
};