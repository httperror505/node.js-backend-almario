const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const db = require('./app/config/database');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static('assets'));

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize multer upload
const upload = multer({ storage });

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  return res.json({ Status: 'Success' });
});

// Handle research creation
app.post('/create', upload.single('file'), (req, res) => {
  const sql = "INSERT INTO researches (`title`,`author`,`publish_date`,`abstract`,`category_id`,`file_name`,`department_id`) VALUES (?,?,?,?,?,?,?)";
  const values = [
    req.body.title,
    req.body.author,
    req.body.publish_date,
    req.body.abstract,
    req.body.category_id,
    req.file.filename,
    req.body.department_id // Fixed department_id access
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating research:', err);
      return res.status(500).json({ Error: 'Error creating research' });
    }
    return res.json({ Status: 'Success' });
  });
});

// Import and use routes
const UsersRoutes = require('./app/routes/user');
const RolesRoutes = require('./app/routes/roleRoutes');
const PublicationRoutes = require('./app/routes/publicationRoutes');
const DocumentRoutes = require('./app/routes/DocumentsRoutes');
const departmentRoutes = require('./app/routes/departmentRountes');
const testAPIRouter = require('./app/routes/testAPI');
const attachementRoutes = require('./app/routes/attachmentsRoutes');
const projectRoutes = require('./app/routes/ProjectRoutes');
const researchesRoutes = require('./app/routes/researches');

app.use('/api', UsersRoutes);
app.use('/api', RolesRoutes);
app.use('/api', PublicationRoutes);
app.use('/api', DocumentRoutes);
app.use('/api', projectRoutes);
app.use('/testAPI', testAPIRouter);
app.use('/api', departmentRoutes);
app.use('/api', attachementRoutes);
app.use('/api', researchesRoutes);

// Serve index page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/page.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
