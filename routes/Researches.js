const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');
const multer = require('multer') //http://expressjs.com/en/resources/middleware/multer.html npm install --save multer
const router = express.Router();
const storage = multer.diskStorage({
  
    destination: function(req, file, cb) {
      return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  const upload = multer({storage})
   
  router.post('/upload', upload.single('file'), (req, res) => {
   console.log(req.body)
   console.log(req.file)
   return res.json({Status: "Success"});
  })
   
  router.post('/create',upload.single('file'), (req, res) => {
      const sql = "INSERT INTO publication (`title`,`author`,`publish_date`abstract`,`filename`,`department_id`) VALUES (?,?,?,?,?,?)"; 
      const values = [
          req.body.title,
          req.body.author,
          req.body.publish_date,
          req.body.abstract,
          req.file.filename,
          req.department_id
      ]
      db.query(sql, [values], (err, result) => {
          if(err) return res.json({Error: "Error signup query"});
          return res.json({Status: "Success"});
      })
  })
 

  module.exports = router;