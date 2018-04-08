var express = require('express');
var router = express.Router();

/* GET petlist. */
router.get('/petlist', function(req, res) {
  var db = req.db;
  var collection = db.get('petlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

/* POST to addPet. */
router.post('/addPet', function(req, res) {
  var db = req.db;
  var collection = db.get('petlist');
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/* DELETE to deletepet. */
router.delete('/deletepet/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('petlist');
  var petToDelete = req.params.id;
  collection.remove({ '_id' : petToDelete }, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;