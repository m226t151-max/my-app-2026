const questions = [
    // E (Extraversion) vs I (Introversion)
    { text: "新しい人と会った後、エネルギーが湧いてくる（疲れるのではなく）。", dimension: "EI", weight: 1.2 },
    { text: "注目を浴びることに抵抗がなく、むしろ楽しむ方だ。", dimension: "EI", weight: 1.0 },
    { text: "考えをまとめる前に、つい口に出してしまうことが多い。", dimension: "EI", weight: 0.8 },

    // S (Sensing) vs N (Intuition)
    { text: "抽象的な概念や理論よりも、目に見える事実や現実的な詳細を重視する。", dimension: "SN", weight: 1.2 },
    { text: "「もしも〜だったら」という想像よりも、「今ここ」にあるものを大切にする。", dimension: "SN", weight: 1.0 },
    { text: "物事を進める際、直感よりも過去の経験や確立された手順に従うのが好きだ。", dimension: "SN", weight: 0.8 },

    // T (Thinking) vs F (Feeling)
    { text: "決断を下す際、他人の感情よりも論理的な正しさを優先する。", dimension: "TF", weight: 1.2 },
    { text: "議論において、真実を伝えることは相手の気分を害さないことよりも重要だ。", dimension: "TF", weight: 1.0 },
    { text: "客観的な分析が得意で、冷静だと人から言われることが多い。", dimension: "TF", weight: 0.8 },

    // J (Judging) vs P (Perceiving)
    { text: "締め切りギリギリにやるよりも、余裕を持って計画的に進めるのが好きだ。", dimension: "JP", weight: 1.2 },
    { text: "身の回りの整理整頓がされており、予定がしっかり決まっていると安心する。", dimension: "JP", weight: 1.0 },
    { text: "一度決めたことは、状況が変わっても最後までやり通したい方だ。", dimension: "JP", weight: 0.8 }
];

const personalityTypes = {
    "ISTJ": { title: "管理者", desc: "実用的で事実を重視し、信頼される誠実な努力家です。" },
    "ISFJ": { title: "擁護者", desc: "非常に献身的で温かく、大切な人々を全力で守るタイプです。" },
    "INFJ": { title: "提唱者", desc: "静かで神秘的ですが、人々を勇気づける理想主義者です。" },
    "INTJ": { title: "建築家", desc: "想像力が豊かで、あらゆる事象に対して戦略を練る完璧主義者です。" },
    "ISTP": { title: "巨匠", desc: "大胆かつ実用的で、あらゆる道具を使いこなす実践者です。" },
    "ISFP": { title: "冒険家", desc: "柔軟で魅力的な芸術家で、常に新しい経験を求めるタイプです。" },
    "INFP": { title: "仲介者", desc: "詩的で親切、常に利他的な活動を求める理想主義者です。" },
    "INTP": { title: "論理学者", desc: "貪欲な知識欲を持ち、革新的な発明家としての素質があります。" },
    "ESTP": { title: "起業家", desc: "賢く、エネルギッシュで、非常に鋭い観察眼を持つ行動派です。" },
    "ESFP": { title: "エンターテイナー", desc: "自発的でエネルギッシュ、周りを飽きさせない情熱家です。" },
    "ENFP": { title: "広報運動家", desc: "情熱的で独創的、かつ社交的な自由人です。" },
    "ENTP": { title: "討論者", desc: "賢く好奇心旺盛で、知的な挑戦を恐れない思考家です。" },
    "ESTJ": { title: "幹部", desc: "物事や人々を管理する能力に長けた、優秀な管理者です。" },
    "ESFJ": { title: "領事", desc: "非常に思いやりがあり社交的、常に人助けをしたいタイプです。" },
    "ENFJ": { title: "主人公", desc: "カリスマ性があり、人々を励まし導くことに情熱を注ぐリーダーです。" },
    "ENTJ": { title: "指揮官", desc: "大胆で想像力が豊か、常に道を見出す強い意志を持つリーダーです。" }
};

let currentQuestionIndex = 0;
let scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

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

function startQuiz() {
    currentQuestionIndex = 0;
    scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    showView(quizView);
    updateQuestion();
    renderHistory();
}

function updateQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.text;
    
    // スケールボタンの生成
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    // -2 (強く同意しない) から +2 (強く同意する) までのスケール
    const values = [
        { val: -2, label: "同意しない", size: "lg" },
        { val: -1, label: "", size: "sm" },
        { val: 0, label: "どちらでもない", size: "md" },
        { val: 1, label: "", size: "sm" },
        { val: 2, label: "同意する", size: "lg" }
    ];

    values.forEach(item => {
        const btn = document.createElement('button');
        btn.className = `scale-btn scale-${item.size}`;
        if (item.label) btn.setAttribute('title', item.label);
        btn.onclick = () => handleAnswer(item.val);
        optionsContainer.appendChild(btn);
    });

    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
}

function handleAnswer(value) {
    const q = questions[currentQuestionIndex];
    // 重みを掛けて加算
    scores[q.dimension] += (value * q.weight);
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    
    // 指標の判定
    const type = 
        (scores.EI >= 0 ? "E" : "I") +
        (scores.SN >= 0 ? "S" : "N") +
        (scores.TF >= 0 ? "T" : "F") +
        (scores.JP >= 0 ? "J" : "P");

    const result = personalityTypes[type];
    resultType.textContent = `${type} : ${result.title}`;
    resultDesc.textContent = result.desc;
    
    showView(resultView);
    saveResult(`${type} (${result.title})`);
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeStr) {
    const history = JSON.parse(localStorage.getItem('mbti_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeStr
    });
    localStorage.setItem('mbti_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('mbti_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('mbti_history');
        renderHistory();
    }
}

renderHistory();
