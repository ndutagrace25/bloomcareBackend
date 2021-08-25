'use strict';
module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
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
    parent: {
      type: DataTypes.INTEGER
    },
    number: {
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
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
    updated_at: {
      type: DataTypes.DATE,
    }
  }, {
    timestamps: false,
    operatorsAliases: false
  });

  Block.associate = function (models) {
    // associations can be defined here
    Block.hasMany(models.Bed, {
      foreignKey: 'bed_id',
      onDelete: 'CASCADE'
    });

  };
  return Block;
};

