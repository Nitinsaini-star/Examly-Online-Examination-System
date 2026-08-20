const exams = [
  { id: 'ux', title: 'UX & human behavior', subject: 'Design thinking', description: 'Test your instinct for creating experiences people love.', duration: '12 min', questions: 8, difficulty: 'Intermediate', tone: 'mint', type: 'popular', questionsData: [{q:'What is the primary goal of user-centered design?',a:['To make interfaces visually complex','To solve real user problems','To reduce development time','To follow every design trend'],correct:1},{q:'Which method is best for understanding user motivations?',a:['User interviews','Color picking','Code review','A/B testing only'],correct:0},{q:'What does an empathy map help a team understand?',a:['Server performance','What users say, think, do and feel','Brand colors','Project budget'],correct:1},{q:'A prototype is most useful for...',a:['Testing an idea early','Replacing all research','Writing production code','Measuring revenue'],correct:0},{q:'What does accessibility in design ensure?',a:['Only expert users can navigate','Products work for people with varied abilities','Pages load with more animation','A product uses fewer colors'],correct:1},{q:'A design system is a collection of...',a:['Random inspiration','Reusable patterns and guidelines','Customer complaints','Analytics dashboards'],correct:1},{q:'Which is an example of qualitative data?',a:['68% completion rate','A user describing their frustration','Number of clicks','Average session length'],correct:1},{q:'The best design decisions are usually based on...',a:['Assumptions','Evidence and user needs','Personal taste alone','The newest tool'],correct:1}] },
  { id: 'data', title: 'Data literacy essentials', subject: 'Data & analytics', description: 'Build confidence with the numbers behind every decision.', duration: '10 min', questions: 7, difficulty: 'Beginner', tone: 'yellow', type: 'new', questionsData: [{q:'What does the median represent?',a:['The most frequent value','The middle value in an ordered set','The total of all values','The largest value'],correct:1},{q:'A correlation between two variables means...',a:['One definitely causes the other','They vary in a related way','They are always equal','The data is incorrect'],correct:1},{q:'Which chart is best for showing a trend over time?',a:['Line chart','Pie chart','Treemap','Single number'],correct:0},{q:'What is a sample?',a:['The full population','A subset used to learn about a population','A data error','A chart label'],correct:1},{q:'A KPI is used to...',a:['Track a meaningful performance measure','Store passwords','Design a logo','Replace a hypothesis'],correct:0},{q:'What should you do before trusting a dataset?',a:['Check its source and quality','Delete unusual values','Publish immediately','Ignore missing values'],correct:0},{q:'A percentage is a ratio expressed out of...',a:['10','50','100','1,000'],correct:2}] },
  { id: 'product', title: 'Product strategy sprint', subject: 'Product', description: 'See the bigger picture, then make the next move.', duration: '15 min', questions: 10, difficulty: 'Advanced', tone: 'coral', type: 'popular', questionsData: [{q:'A product vision describes...',a:['A team’s daily schedule','The future state a product aims to create','A bug list','A pricing table'],correct:1},{q:'What is a product hypothesis?',a:['A testable belief about an outcome','A final answer','A design file','A legal requirement'],correct:0},{q:'Prioritization helps teams decide...',a:['Which work creates the most value next','Who gets the most meetings','Which font to use','How to avoid users'],correct:0},{q:'MVP stands for...',a:['Most Valuable Plan','Minimum Viable Product','Managed Visual Pattern','Market Value Point'],correct:1},{q:'A user story typically describes...',a:['A technical outage','A need from the user’s perspective','A company history','A sales target'],correct:1},{q:'Product-market fit means...',a:['A product meets a strong market need','A product has no competitors','A team has a large office','A feature is hard to use'],correct:0},{q:'Retention measures...',a:['How many users return over time','The size of a launch team','The number of screens','A one-time purchase'],correct:0},{q:'A roadmap is...',a:['A promise of every exact date','A shared view of product direction','A list of customer names','A visual style guide'],correct:1},{q:'Discovery work is used to...',a:['Learn before committing to a solution','Skip user feedback','Ship without testing','Only fix production bugs'],correct:0},{q:'A north star metric represents...',a:['A core measure of delivered value','A team vacation day','The number of meetings','A color token'],correct:0}] }
];

const grid = document.getElementById('examGrid');
const modal = document.getElementById('examModal');
const content = document.getElementById('examContent');
let currentExam, currentQuestion = 0, answers = [], remainingSeconds, timerId;
let authMode = 'login';

function renderExams(filter = 'all') {
  const visible = filter === 'all' ? exams : exams.filter(exam => exam.type === filter);
  document.getElementById('examCount').textContent = exams.length;
  grid.innerHTML = visible.map(exam => `<article class="exam-card"><div class="exam-top"><span class="subject-tag ${exam.tone}">${exam.subject}</span><span class="bookmark">♡</span></div><h3>${exam.title}</h3><p>${exam.description}</p><div class="exam-meta"><span class="duration">${exam.duration}</span><span class="questions">${exam.questions} questions</span><span class="difficulty">${exam.difficulty}</span></div><div class="exam-start"><span>Ready when you are</span><button data-exam="${exam.id}">Start exam <span>↗</span></button></div></article>`).join('');
  grid.querySelectorAll('[data-exam]').forEach(button => button.addEventListener('click', () => startExam(button.dataset.exam)));
}

function startExam(id) {
  currentExam = exams.find(exam => exam.id === id);
  currentQuestion = 0; answers = Array(currentExam.questionsData.length).fill(null); remainingSeconds = currentExam.questionsData.length * 75;
  modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); renderQuestion();
  clearInterval(timerId); timerId = setInterval(() => { remainingSeconds--; updateTimer(); if (remainingSeconds <= 0) finishExam(); }, 1000);
}
function updateTimer() { const timer = document.getElementById('timer'); if (timer) timer.textContent = `${String(Math.floor(remainingSeconds / 60)).padStart(2,'0')}:${String(remainingSeconds % 60).padStart(2,'0')}`; }
function renderQuestion() {
  const question = currentExam.questionsData[currentQuestion];
  content.innerHTML = `<h2 id="modalTitle">${currentExam.title}</h2><div class="exam-status"><span>Question ${currentQuestion + 1} of ${currentExam.questionsData.length}</span><span class="timer" id="timer"></span></div><div class="question-count">${currentExam.subject}</div><p class="question-text">${question.q}</p><div class="answers">${question.a.map((answer, index) => `<button class="answer-option ${answers[currentQuestion] === index ? 'selected' : ''}" data-answer="${index}">${String.fromCharCode(65 + index)}. ${answer}</button>`).join('')}</div><div class="exam-controls"><button id="previousButton" ${currentQuestion === 0 ? 'disabled' : ''}>← Previous</button>${currentQuestion === currentExam.questionsData.length - 1 ? '<button class="submit-button" id="submitButton">Submit exam</button>' : '<button class="next-button" id="nextButton">Next question →</button>'}</div>`;
  updateTimer();
  content.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => { answers[currentQuestion] = Number(button.dataset.answer); renderQuestion(); }));
  document.getElementById('previousButton').addEventListener('click', () => { if (currentQuestion > 0) { currentQuestion--; renderQuestion(); } });
  const next = document.getElementById('nextButton'); if (next) next.addEventListener('click', () => { if (answers[currentQuestion] !== null && currentQuestion < currentExam.questionsData.length - 1) { currentQuestion++; renderQuestion(); } });
  const submit = document.getElementById('submitButton'); if (submit) submit.addEventListener('click', finishExam);
}
function finishExam() { clearInterval(timerId); const correct = answers.reduce((total, answer, index) => total + (answer === currentExam.questionsData[index].correct ? 1 : 0), 0); const total = currentExam.questionsData.length; const percentage = Math.round(correct / total * 100); content.innerHTML = `<div class="result-score"><strong>${percentage}%</strong><span>your ${currentExam.title} result</span></div><div class="result-breakdown"><div><strong>${correct}</strong><span>Correct</span></div><div><strong>${total - correct}</strong><span>To review</span></div><div><strong>${total}</strong><span>Total</span></div></div><p class="result-message">${percentage >= 70 ? 'Strong work. You have a solid grasp of this topic.' : 'Good first pass. Review the answers and take another run when ready.'}</p><button class="restart-button" id="restartButton">Try again</button>`; document.getElementById('restartButton').addEventListener('click', () => startExam(currentExam.id)); }

document.getElementById('closeModal').addEventListener('click', () => { clearInterval(timerId); modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); });
modal.addEventListener('click', event => { if (event.target === modal) document.getElementById('closeModal').click(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { document.querySelector('.filter.active').classList.remove('active'); button.classList.add('active'); renderExams(button.dataset.filter); }));
document.getElementById('themeToggle').addEventListener('click', () => document.body.classList.toggle('dark'));
renderExams();

const apiBase = window.location.port === '5500' ? 'http://localhost:3000/api' : '/api';
const authModal = document.getElementById('authModal');
let selectedRole = 'student';

async function loadServerExams() {
  try {
    const response = await fetch(`${apiBase}/exams`);
    if (!response.ok) return;
    const serverExams = await response.json();
    if (!Array.isArray(serverExams) || !serverExams.length) return;
    exams.splice(0, exams.length, ...serverExams.map(exam => ({
      id: exam._id || exam.id,
      title: exam.title,
      subject: exam.subject,
      description: exam.description,
      duration: `${exam.durationMinutes} min`,
      questions: exam.questions.length,
      difficulty: exam.difficulty,
      tone: exam.tone || 'mint',
      type: exam.featured ? 'popular' : 'new',
      questionsData: exam.questions.map(question => ({ q: question.text, a: question.options, correct: question.correctIndex }))
    })));
    renderExams();
  } catch (error) {
    console.info('API unavailable; using local demo exams.', error.message);
  }
}

function openAuth() { authModal.classList.add('open'); authModal.setAttribute('aria-hidden', 'false'); document.getElementById('authEmail').focus(); }
function closeAuth() { authModal.classList.remove('open'); authModal.setAttribute('aria-hidden', 'true'); }
document.getElementById('openAuth').addEventListener('click', openAuth);
document.getElementById('profileButton').addEventListener('click', openDashboard);
document.getElementById('closeAuth').addEventListener('click', closeAuth);
authModal.addEventListener('click', event => { if (event.target === authModal) closeAuth(); });
document.querySelectorAll('.role-tab').forEach(tab => tab.addEventListener('click', () => {
  selectedRole = tab.dataset.role;
  document.querySelector('.role-tab.active').classList.remove('active');
  tab.classList.add('active');
  document.getElementById('authTitle').innerHTML = selectedRole === 'admin' ? 'Manage your<br /><em>exam space.</em>' : 'Sign in to your<br /><em>learning space.</em>';
  document.getElementById('authKicker').textContent = selectedRole === 'admin' ? 'Admin console' : 'Welcome back';
  if (selectedRole === 'admin' && authMode === 'register') setAuthMode('login');
}));
document.querySelectorAll('.auth-mode-button').forEach(button => button.addEventListener('click', () => setAuthMode(button.dataset.mode)));
function setAuthMode(mode) {
  authMode = mode;
  document.querySelector('.auth-mode-button.active').classList.remove('active');
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
  document.querySelector('.name-field').hidden = mode !== 'register';
  document.querySelector('.auth-submit').innerHTML = mode === 'register' ? 'Create student account <span>↗</span>' : 'Continue securely <span>↗</span>';
  document.getElementById('authTitle').innerHTML = mode === 'register' ? 'Start your<br /><em>learning journey.</em>' : selectedRole === 'admin' ? 'Manage your<br /><em>exam space.</em>' : 'Sign in to your<br /><em>learning space.</em>';
}
document.getElementById('authForm').addEventListener('submit', async event => {
  event.preventDefault();
  const message = document.getElementById('authMessage');
  message.className = 'auth-message'; message.textContent = 'Connecting securely...';
  try {
    const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
    const payload = { email: document.getElementById('authEmail').value, password: document.getElementById('authPassword').value };
    if (authMode === 'register') payload.name = document.getElementById('authName').value;
    else payload.role = selectedRole;
    const response = await fetch(`${apiBase}${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to sign in');
    localStorage.setItem('examlyToken', result.token);
    const user = result.user;
    localStorage.setItem('examlyUser', JSON.stringify(user));
    applySession(user); message.className = 'auth-message success'; message.textContent = `${user.role === 'admin' ? 'Admin' : 'Student'} access granted.`;
    setTimeout(() => { closeAuth(); openDashboard(); }, 500);
  } catch (error) { message.textContent = error.message.includes('Failed to fetch') ? 'Start the API server to enable sign in.' : error.message; }
});

const sceneStage = document.getElementById('sceneStage');
document.querySelector('.hero-visual').addEventListener('pointermove', event => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  sceneStage.style.transform = `rotateX(${y * -12}deg) rotateY(${x * 14}deg)`;
});
document.querySelector('.hero-visual').addEventListener('pointerleave', () => { sceneStage.style.transform = ''; });
loadServerExams();

function applySession(user) {
  document.getElementById('openAuth').hidden = true;
  document.getElementById('profileButton').hidden = false;
  document.getElementById('profileName').textContent = user.name || user.email;
  document.getElementById('profileAvatar').textContent = (user.name || user.email).slice(0, 2).toUpperCase();
}
async function openDashboard() {
  const user = JSON.parse(localStorage.getItem('examlyUser') || 'null');
  if (!user) return openAuth();
  const dashboard = document.getElementById('dashboardModal');
  const dashboardContent = document.getElementById('dashboardContent');
  dashboard.classList.add('open'); dashboard.setAttribute('aria-hidden', 'false');
  if (user.role === 'admin') {
    const response = await fetch(`${apiBase}/admin/stats`, { headers: { Authorization: `Bearer ${localStorage.getItem('examlyToken')}` } });
    const stats = await response.json();
    dashboardContent.innerHTML = `<div class="dashboard-grid"><div class="dashboard-card accent"><span>Exams published</span><strong>${stats.exams ?? 0}</strong><small>Manage your assessment library</small></div><div class="dashboard-card"><span>Student accounts</span><strong>${stats.users ?? 0}</strong><small>Registered learners</small></div><div class="dashboard-card"><span>Submissions</span><strong>${stats.submissions ?? 0}</strong><small>Completed assessments</small></div></div><div class="dashboard-actions"><button class="button button-primary" id="manageExams">Manage exam library <span>↗</span></button><button class="logout-button" id="logoutButton">Sign out</button></div>`;
  } else {
    dashboardContent.innerHTML = `<div class="student-welcome"><span class="dashboard-orb">✦</span><div><p class="eyebrow">Student dashboard</p><h3>Good to see you, ${user.name || 'learner'}.</h3><p>Choose an exam below and your results will be saved to your profile.</p></div></div><div class="dashboard-actions"><a class="button button-primary" href="#exams" id="browseExams">Browse exams <span>↗</span></a><button class="logout-button" id="logoutButton">Sign out</button></div>`;
  }
  document.getElementById('logoutButton').addEventListener('click', () => { localStorage.removeItem('examlyToken'); localStorage.removeItem('examlyUser'); document.getElementById('openAuth').hidden = false; document.getElementById('profileButton').hidden = true; closeDashboard(); });
  const browse = document.getElementById('browseExams'); if (browse) browse.addEventListener('click', closeDashboard);
}
function closeDashboard() { const dashboard = document.getElementById('dashboardModal'); dashboard.classList.remove('open'); dashboard.setAttribute('aria-hidden', 'true'); }
document.getElementById('closeDashboard').addEventListener('click', closeDashboard);
document.getElementById('dashboardModal').addEventListener('click', event => { if (event.target.id === 'dashboardModal') closeDashboard(); });
const storedUser = JSON.parse(localStorage.getItem('examlyUser') || 'null'); if (storedUser && localStorage.getItem('examlyToken')) applySession(storedUser);

const localFinishExam = finishExam;
finishExam = async function submitToServerAfterScoring() {
  localFinishExam();
  const token = localStorage.getItem('examlyToken');
  if (!token || !currentExam || !currentExam.id.match?.(/^[a-f\d]{24}$/i)) return;
  try {
    await fetch(`${apiBase}/submissions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ examId: currentExam.id, answers }) });
  } catch (error) { console.info('Submission API unavailable; local result remains visible.', error.message); }
};
