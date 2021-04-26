const e = require('express');
var express = require('express');
var router = express.Router();
var db = require('../models');
const artwork = require('../models/artwork');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Головна' });
});

router.get('/biography', function(req, res, next){
  res.render('biography', {title: 'Життєпис'});
});

router.get('/art', function(req, res, next){
  res.render('art', {title: 'Творчість'});
});

router.get('/artworks/:slug', function(req, res, next){
  db.Artwork.findOne({
    where:{
      slug: req.params.slug,
    },
    include: ['critics']
  }).then(function(result){
    if(result.type=='film'){
      res.render('film', {title: result.title, slug:result.slug, film:result.get({plain:true})});
    } else {
      var page = req.query.p || 1;
      var paragraphs = result.poetryContent.split('\r\n\r\n');
      var pages = [];
      
      paragraphs.forEach(function(part, index){
        this[index] = this[index].replace(/\r\n/g, '<br>');
      }, paragraphs)

      while(paragraphs.length) {
          pages.push(paragraphs.splice(0,34).join('<br><br>'));
      }

      res.render("poetry", {title:result.title, slug:result.slug, pagination:{page:page,pageCount:pages.length}, pages:pages});
    }
  }).catch((err)=>{console.log(err)});
});

router.get('/artworks', function(req, res, next){
  db.Artwork.findAll().then(function(result){
    if(result==undefined){
      res.send('Undefined');
    }
    else{
      var poetrys = [] , artworks={}, films = [];
      for(let i = 0; i<result.length; i++){
        result[i] = result[i].get({plain:true});
        if(result[i].type == 'film'){
          films.push(result[i]);
        } else {
          poetrys.push(result[i]);
        }
      }
      
      var iter = Math.ceil(poetrys.length/20);
      for(let i = 0; i<iter; i++){
        artworks['poetry_'+i] = poetrys.splice(0,20);
      }

      var photos = ['drach_promova-min.png', 'drach_zbir-min.png', 'drach_stoyit.png', 'drach_nezalezhnist.png'];
      res.render('artworks', {title:'Твори', artworks:artworks, photos:photos, films: films});
    }
  }).catch((err)=>{console.log(err)});
});

module.exports = router;
