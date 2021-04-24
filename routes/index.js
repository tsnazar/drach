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

router.get('/artworks/add', function(req, res, next){
  res.render('artworks_add');
});

// delete after fiishing
router.post('/artworks/add', function(req, res, next){
  let tempCritic = [], critic = [], artwork = {};
  
  if(req.body.type=='---' || req.body.title.length < 1){
    return res.render('artworks_add', {message: 'type must be specified'})
  }

  Object.keys(req.body).forEach(function(key){
    if(key.includes('Critic') && req.body[key] != ''){
      let obj = {};
      obj[key] = req.body[key];
      tempCritic.push(obj);
    } else if(req.body[key] != '') {
      let obj = {};
      obj[key] = req.body[key];
      Object.assign(artwork, obj);
    }
  });

  while(tempCritic.length){
    critic.push(Object.assign({}, ...tempCritic.splice(0,2).map(function(element){
      Object.keys(element).forEach(function(key){
        element[key.replace(/\d+/g,'')] = element[key];
        delete element[key];
      })
      return element;
    })));
  }

  db.Artwork.findOrCreate({
    where: {
      title: req.body.title,
    },
    defaults: artwork
  }).then(function(result){
    var artwork = result[0], created = result[1];
    if(!created){
      return res.render('artworks_add', {
          message: 'Something is wrong',
          messageClass: 'alert-danger',
      });
    } else if(artwork.type == 'film' && critic.length > 0){
      critic.forEach(function(element){
        element.ArtworkId = artwork.id;
      });
      db.Critic.bulkCreate(critic).then(()=>{
        return db.Critic.findAll();
      }).then(critics =>{
        if(critics){
          console.log("Critic added.");
        }
      }).catch((err)=>{console.log(err)});
      return res.redirect('/artworks');
    }
    else {
      return res.redirect('/artworks');
    }
  }).catch((err)=>{console.log(err)});
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
      var poetry_1 = [] , poetry_2 = [], films = [];
      for(let i = 0; i<result.length; i++){
        result[i] = result[i].get({plain:true});
        if(result[i].type == 'film'){
          films.push(result[i]);
        } else {
          poetry_1.push(result[i]);
        }
      }
      poetry_2 = poetry_1.slice(poetry_1.length/2, poetry_1.length);
      poetry_1 = poetry_1.slice(0, poetry_1.length/2);
      res.render('artworks', {title:'Твори', poetry_1: poetry_1, poetry_2:poetry_2, films: films});
    }
  }).catch((err)=>{console.log(err)});
});

// delete after fiishing
router.get('/artworks/:slug/delete', function(req, res, next){
  db.Artwork.findOne({
    where:{
      slug: req.params.slug,
    }
  }).then(function(result){
    result.destroy();
    console.log('Deleted');
    res.redirect('/artworks')
  }).catch((err)=>{console.log(err)});
})

// delete after fiishing
router.get('/critic/:id/delete', function(req, res, next){
  db.Critic.findOne({
    where:{
      id: req.params.id,
    }
  }).then(function(result){
    result.destroy();
    console.log('Deleted');
    res.redirect('/artworks')
  }).catch((err)=>{console.log(err)});
})

module.exports = router;
