'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bed = sequelize.define('Bed', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    from: { //range of the first bed from - used to be called number
      allowNull: true,
      type: DataTypes.INTEGER
    },
    to: { //range of the last bed tio - used to be called bed_number
      allowNull: true,
      type: DataTypes.INTEGER
    },
    bed_name: {
      type: DataTypes.STRING
    },
    block_id: {
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
  Bed.associate = function (models) {
    // associations can be defined here
    Bed.belongsTo(models.Block, {
      foreignKey: 'block_id',
      onDelete: 'CASCADE'
    });

    Bed.hasMany(models.Plant, {
      foreignKey: 'id',
      as: 'plants'
    })
  };
  return Bed;
};