const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = 5001;
const JWT_SECRET = 'supersecret_pccoe_key';

const app = express();
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json());

// Serve the public folder correctly
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/InternshipNativeDB')
    .then(() => console.log(`Connected to NativeDB`))
    .catch(err => console.error('DB Error:', err));

// Models
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' }
});
const User = mongoose.model('User', UserSchema);

const JobSchema = new mongoose.Schema({
    title: String, company: String, domain: String, location: String,
    salary: String, jobType: String, deadline: Date, description: String,
    department: { type: String, default: 'All' }, 
    createdAt: { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', JobSchema);

const AppSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String, email: String, rollNo: String, cgpa: String, resumeUrl: String,
    status: { type: String, enum: ['Pending', 'Shortlisted', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Application = mongoose.model('Application', AppSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

// Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};

const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin resource. Access denied' });
    next();
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email.endsWith('@pccoepune.org')) return res.status(400).json({ msg: 'Must use @pccoepune.org email' });
        
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const role = (email === 'intershipadmin@pccoepune.org' || email === 'internshipadmin@pccoepune.org') ? 'admin' : 'student';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        
        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// App Routes
app.get('/api/jobs', async (req, res) => {
    try { 
        const query = {};
        if (req.query.department && req.query.department !== 'All') {
            query.department = req.query.department;
        }
        if (req.query.search) {
            const regex = new RegExp(req.query.search, 'i');
            query.$or = [
                { title: regex },
                { company: regex },
                { description: regex }
            ];
        }
        res.json(await Job.find(query).sort({createdAt: -1})); 
    }
    catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin Post Job
app.post('/api/jobs', auth, adminAuth, async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.json({ success: true, job });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Student Apply
app.post('/api/apply', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) throw new Error('A PDF resume file is strictly required');
        
        // Prevent duplicate applications
        const exists = await Application.findOne({ jobId: req.body.jobId, studentId: req.user.id });
        if(exists) return res.status(400).json({ msg: 'Already applied for this internship' });

        const application = new Application({
            ...req.body,
            studentId: req.user.id,
            resumeUrl: '/uploads/' + req.file.filename
        });
        await application.save();
        res.json({ success: true, application });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Student View Own Applications
app.get('/api/student/applications', auth, async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.user.id }).populate('jobId');
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin View All Applications
app.get('/api/admin/applications', auth, adminAuth, async (req, res) => {
    try {
        const apps = await Application.find().populate('jobId').populate('studentId', 'name email').sort({createdAt: -1});
        res.json(apps);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin Update Application Status
app.put('/api/admin/applications/:id/status', auth, adminAuth, async (req, res) => {
    try {
        const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(app);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`Backend Server listening on http://localhost:${PORT}`));
