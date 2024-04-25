const express =require('express');
const cors = require('cors');

const multer = require('multer') //http://expressjs.com/en/resources/middleware/multer.html npm install --save multer
const app = express();

app.use("/assets",express.static("assets"));
const db = require('./app/config/database');
app.use(cors());
const PORT = process.env.PORT || 9000;
const bodyParser = require('body-parser');
const UsersRoutes = require('./app/routes/user');
const RolesRoutes = require('./app/routes/roleRoutes');
const PublicationRoutes = require('./app/routes/publicationRoutes');
const DocumentRoutes = require('./app/routes/DocumentsRoutes');
const departmentRoutes = require('./app/routes/departmentRountes');
const testAPIRouter = require('./app/routes/testAPI');
const attachementRoutes = require('./app/routes/attachmentsRoutes');
const projectRoutes = require('./app/routes/ProjectRoutes');


app.use("/assets",express.static("assets"));


app.use(bodyParser.json());
app.use('/api', UsersRoutes);
//role Routes
app.use('/api', RolesRoutes);

//publicationRoutes
app.use('/api', PublicationRoutes);
//docuRoutes
app.use('/api', DocumentRoutes);
app.use('/api', projectRoutes);
app.use("/testAPI",testAPIRouter);
app.use("/api",departmentRoutes);
app.use("/api",attachementRoutes);




const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      return cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  const upload = multer({storage})
   
  app.post('/upload', upload.single('file'), (req, res) => {
   console.log(req.body)
   console.log(req.file)
   return res.json({Status: "Success"});
  })
   
  app.post('/create',upload.single('file'), (req, res) => {
      const sql = "INSERT INTO publication (`title`,`authors`,`abstract`,`publication_type`,`citation`,`docs`,`id`) VALUES (?)"; 
      const values = [
          req.body.title,
          req.body.authors,
          req.body.abstract,
          req.body.publication_type,
          req.body.citation,
          req.file.filename,
          req.id
      ]
      db.query(sql, [values], (err, result) => {
          if(err) return res.json({Error: "Error singup query"});
          return res.json({Status: "Success"});
      })
  })
 

app.get('/', (req, res) => {

    //res.json({ message: 'Restfull API Backend Using ExpresJS' });
    res.sendFile(__dirname + "/page.html");
    
    });
    

app.listen(PORT, () => {
    console.log(`Server is Running on http://localhost:${PORT}`);
});