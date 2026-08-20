require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Exam } = require('./models');
const sampleExams = [
  { title: 'UX & human behavior', subject: 'Design thinking', description: 'Test your instinct for creating experiences people love.', durationMinutes: 12, difficulty: 'Intermediate', tone: 'mint', featured: true, questions: [{ text: 'What is the primary goal of user-centered design?', options: ['To make interfaces visually complex', 'To solve real user problems', 'To reduce development time', 'To follow every design trend'], correctIndex: 1 }, { text: 'Which method is best for understanding user motivations?', options: ['User interviews', 'Color picking', 'Code review', 'A/B testing only'], correctIndex: 0 }, { text: 'What does an empathy map help a team understand?', options: ['Server performance', 'What users say, think, do and feel', 'Brand colors', 'Project budget'], correctIndex: 1 }] },
  { title: 'Data literacy essentials', subject: 'Data & analytics', description: 'Build confidence with the numbers behind every decision.', durationMinutes: 10, difficulty: 'Beginner', tone: 'yellow', featured: false, questions: [{ text: 'What does the median represent?', options: ['The most frequent value', 'The middle value in an ordered set', 'The total of all values', 'The largest value'], correctIndex: 1 }, { text: 'Which chart is best for showing a trend over time?', options: ['Line chart', 'Pie chart', 'Treemap', 'Single number'], correctIndex: 0 }] },
  { title: 'Product strategy sprint', subject: 'Product', description: 'See the bigger picture, then make the next move.', durationMinutes: 15, difficulty: 'Advanced', tone: 'coral', featured: true, questions: [{ text: 'What is a product hypothesis?', options: ['A testable belief about an outcome', 'A final answer', 'A design file', 'A legal requirement'], correctIndex: 0 }, { text: 'MVP stands for...', options: ['Most Valuable Plan', 'Minimum Viable Product', 'Managed Visual Pattern', 'Market Value Point'], correctIndex: 1 }] },
  { title: 'JavaScript fundamentals', subject: 'Development', description: 'Sharpen the building blocks behind interactive products.', durationMinutes: 14, difficulty: 'Intermediate', tone: 'mint', featured: false, questions: [{ text: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'define', 'value'], correctIndex: 1 }, { text: 'What does JSON.parse do?', options: ['Turns JSON text into a JavaScript value', 'Saves a file', 'Encrypts a password', 'Creates a database'], correctIndex: 0 }] },
  { title: 'Communication essentials', subject: 'Professional skills', description: 'Practice the habits that make ideas easier to understand.', durationMinutes: 8, difficulty: 'Beginner', tone: 'yellow', featured: false, questions: [{ text: 'Active listening means...', options: ['Waiting silently', 'Understanding and responding to what someone says', 'Planning your reply only', 'Avoiding questions'], correctIndex: 1 }, { text: 'A concise message should...', options: ['Lead with the main point', 'Use every detail available', 'Avoid structure', 'Hide the request'], correctIndex: 0 }] },
  { title: 'Critical thinking lab', subject: 'Reasoning', description: 'Separate strong evidence from assumptions and noise.', durationMinutes: 11, difficulty: 'Advanced', tone: 'coral', featured: true, questions: [{ text: 'A reliable conclusion should be based on...', options: ['Evidence that supports the claim', 'The loudest opinion', 'A single anecdote', 'A guess'], correctIndex: 0 }, { text: 'Confirmation bias is the tendency to...', options: ['Seek information that supports existing beliefs', 'Change your mind quickly', 'Check multiple sources', 'Avoid decisions'], correctIndex: 0 }] }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.updateOne({ email: process.env.ADMIN_EMAIL }, { $set: { name: 'Examly Admin', email: process.env.ADMIN_EMAIL, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' } }, { upsert: true });
  await Exam.deleteMany({});
  await Exam.insertMany(sampleExams);
  console.log(`Seeded ${sampleExams.length} exams and admin ${process.env.ADMIN_EMAIL}`);
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error); process.exit(1); });
