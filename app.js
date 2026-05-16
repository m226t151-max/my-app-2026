const questions = [
    { text: "大人数のパーティーよりも、少人数の集まりの方が好きだ。", extrovert: false },
    { text: "新しい人と出会うことにワクワクする。", extrovert: true },
    { text: "考えをまとめるために一人の時間が必要だ。", extrovert: false },
    { text: "注目の的になるのが好きだ。", extrovert: true },
    { text: "週末は外出するよりも家でリラックスしたい。", extrovert: false }
];

let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startView = document.getElementById('start-view');
const quizView = document.getElementById('quiz-view');
const resultView = document.getElementById('result-view');
const questionText = document.getElementById('question-text');
const progressBar = document.getElementById('progress-bar');
const resultType = document.getElementById('result-type');
const resultDesc = document.getElementById('result-desc');
const historyList = document.getElementById('history-list');

// Event Listeners
document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('restart-btn').addEventListener('click', startQuiz);
document.getElementById('clear-history-btn').addEventListener('click', clearHistory);

document.querySelectorAll('.option-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = parseInt(e.target.dataset.value);
        handleAnswer(value);
    });
});

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showView(quizView);
    updateQuestion();
    renderHistory();
}

function updateQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.text;
    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
}

function handleAnswer(answerValue) {
    const question = questions[currentQuestionIndex];
    // "はい" (1) が外向的な回答と一致する場合、または "いいえ" (0) が内向的な回答と一致する場合
    if ((answerValue === 1 && question.extrovert) || (answerValue === 0 && !question.extrovert)) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    const total = questions.length;
    let type = '';
    let desc = '';

    if (score >= 4) {
        type = 'エネルギッシュな外向型';
        desc = 'あなたは社交的で、他人との交流からエネルギーを得るタイプです。';
    } else if (score >= 2) {
        type = 'バランスの取れた両向型';
        desc = 'あなたは状況に応じて外交的にも内向的にもなれる、バランスの取れたタイプです。';
    } else {
        type = '思慮深い内向型';
        desc = 'あなたは自分の内面と向き合い、一人の時間を大切にするタイプです。';
    }

    resultType.textContent = type;
    resultDesc.textContent = desc;
    showView(resultView);
    saveResult(type);
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

// LocalStorage Functions
function saveResult(type) {
    const history = JSON.parse(localStorage.getItem('personality_history') || '[]');
    const newEntry = {
        date: new Date().toLocaleString('ja-JP'),
        type: type
    };
    history.unshift(newEntry);
    localStorage.setItem('personality_history', JSON.stringify(history.slice(0, 10))); // Max 10 entries
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('personality_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('personality_history');
        renderHistory();
    }
}

// Initial History Load
renderHistory();
