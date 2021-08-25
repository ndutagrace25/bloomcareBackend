'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scout = sequelize.define('Scout', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    scouting_date: {
      allowNull: false,
      type: DataTypes.DATE
    },
    plant_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    entry_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    point_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    issue_category_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    value: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    tolerance_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    latitude: {
      type: DataTypes.DECIMAL
    },
    longitude: {
      type: DataTypes.DECIMAL
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
  Scout.associate = function (models) {
    // associations can be defined here
    Scout.belongsTo(models.Plant, {
      foreignKey: 'plant_id',
      onDelete: 'CASCADE'
    });

    Scout.belongsTo(models.Station, {
      foreignKey: 'entry_id',
      onDelete: 'CASCADE'
    });

    Scout.belongsTo(models.Point, {
      foreignKey: 'point_id',
      onDelete: 'CASCADE'
    });

    Scout.belongsTo(models.IssueCategory, {
      foreignKey: 'issue_category_id',
      onDelete: 'CASCADE'
    });

    Scout.belongsTo(models.Tolerance, {
      foreignKey: 'tolerance_id',
      onDelete: 'CASCADE'
    });
  };
  return Scout;
};