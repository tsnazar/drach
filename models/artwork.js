'use strict';
const {
  Model
} = require('sequelize');
const { default: slugify } = require('slugify');
module.exports = (sequelize, DataTypes) => {
  class Artwork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Artwork.init({
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: ['film', "poetry"]
    },
    poetryContent: DataTypes.TEXT,
    filmURL: DataTypes.STRING,
    filmGenre: DataTypes.STRING,
    filmDescription: DataTypes.TEXT,
  }, {
    hooks: {
      beforeCreate: function(artwork, options){
        artwork.slug = slugify(artwork.title, {lower:true});
      }
    },
    sequelize,
    modelName: 'Artwork',
  });

  

  return Artwork;
};