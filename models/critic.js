'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Critic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Critic.init({
    filmCritic: DataTypes.TEXT,
    filmCriticAuthor: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'Critic',
  });


  return Critic;
};