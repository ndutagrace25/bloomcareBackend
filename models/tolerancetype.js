'use strict';
module.exports = (sequelize, DataTypes) => {
  const ToleranceType = sequelize.define('ToleranceType', {
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
      type: DataTypes.DATE
    },
    modified_by: {
      type: DataTypes.DATE
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
  ToleranceType.associate = function (models) {
    // associations can be defined here
    ToleranceType.hasMany(models.Issue, {
      foreignKey: 'id',
      as: 'issues'
    })

    ToleranceType.hasMany(models.Tolerance, {
      foreignKey: 'id',
      as: 'tolerances'
    })
  };
  return ToleranceType;
};