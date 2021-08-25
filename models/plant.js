'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plant = sequelize.define('Plant', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    expected_pick_date: {
      type: DataTypes.DATE
    },
    plant_date: {
      type: DataTypes.DATE
    },
    bed_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.TINYINT
    },
    variety_id: {
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
  Plant.associate = function (models) {
    // associations can be defined here
    Plant.hasMany(models.Scout, {
      foreignKey: 'id',
      as: 'scouts'
    })

    Plant.belongsTo(models.Bed, {
      foreignKey: 'bed_id',
      onDelete: 'CASCADE'
    });

    Plant.belongsTo(models.Variety, {
      foreignKey: 'variety_id',
      onDelete: 'CASCADE'
    });
  };
  return Plant;
};