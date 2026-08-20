require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Exam, Submission } = require('../database/models');

const app = express();
const port = Number(process.env.PORT || 3000);
const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri || !jwtSecret) {
  console.error('Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env before starting the API.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, jwtSecret, { expiresIn: '2h' });
}
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try { req.user = jwt.verify(token, jwtSecret); next(); } catch { return res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
}
function requireRole(role) { return (req, res, next) => req.user.role === role ? next() : res.status(403).json({ message: `${role} access required.` }); }

app.get('/api/health', (req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email and an 8-character password are required.' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
    const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: 'student' });
    res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Could not create account.', error: error.message }); }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role = 'student' } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase(), role });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials for this workspace.' });
    res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { res.status(500).json({ message: 'Could not sign in.', error: error.message }); }
});
app.get('/api/exams', async (req, res) => { try { res.json(await Exam.find().sort({ featured: -1, createdAt: -1 })); } catch (error) { res.status(500).json({ message: 'Could not load exams.', error: error.message }); } });
app.post('/api/exams', requireAuth, requireRole('admin'), async (req, res) => { try { res.status(201).json(await Exam.create(req.body)); } catch (error) { res.status(400).json({ message: 'Could not create exam.', error: error.message }); } });
app.post('/api/submissions', requireAuth, requireRole('student'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found.' });
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    const score = exam.questions.reduce((total, question, index) => total + (answers[index] === question.correctIndex ? 1 : 0), 0);
    const submission = await Submission.create({ student: req.user.sub, exam: exam._id, answers, score, total: exam.questions.length, percentage: Math.round((score / exam.questions.length) * 100) });
    res.status(201).json({ id: submission._id, score, total: exam.questions.length, percentage: submission.percentage });
  } catch (error) { res.status(500).json({ message: 'Could not submit exam.', error: error.message }); }
});
app.get('/api/admin/stats', requireAuth, requireRole('admin'), async (req, res) => { res.json({ users: await User.countDocuments({ role: 'student' }), exams: await Exam.countDocuments(), submissions: await Submission.countDocuments() }); });

mongoose.connect(mongoUri).then(() => app.listen(port, () => console.log(`Examly API running at http://localhost:${port}`))).catch(error => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
