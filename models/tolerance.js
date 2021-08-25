'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tolerance = sequelize.define('Tolerance', {
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
    from: {
      allowNull: false,
      type: DataTypes.DATE
    },
    to: {
      allowNull: false,
      type: DataTypes.DATE
    },
    tolerance_type_id: {
      allowNull: false,
      type: DataTypes.INTEGER
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
  Tolerance.associate = function (models) {
    // associations can be defined here
    Tolerance.hasMany(models.Scout, {
      foreignKey: 'id',
      as: 'scouts'
    })

    Tolerance.belongsTo(models.ToleranceType, {
      foreignKey: 'tolerance_type_id',
      onDelete: 'CASCADE'
    });
  };
  return Tolerance;
};