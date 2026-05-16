const questions = [
    // Measuring Conscientiousness (J/P) & Openness (N/S) through routine
    { text: "机の上の配置が変わっていると、すぐに違和感に気づく方だ。", dimension: "detail", weight: 1.0 },
    { text: "LINEなどのメッセージは、内容をしっかり練ってから送るよりも、直感的に早く返したい。", dimension: "speed", weight: 1.0 },
    
    // Measuring Agreeableness (F/T) & Extraversion (E/I) through social reaction
    { text: "映画を観終わった後、内容の考察を読むよりも、誰かと感想を共有したい気持ちが勝る。", dimension: "shared", weight: 1.0 },
    { text: "予定が全くない休日が3日続くと、リフレッシュするよりも「何か物足りない」と感じ始める。", dimension: "social_battery", weight: 1.0 },

    // Measuring Thinking (T/F) & Judging (J/P) through problem solving
    { text: "友達の相談に乗るとき、励ますことよりも「どうすれば解決するか」を先に考えている。", dimension: "solution", weight: 1.0 },
    { text: "買い物で迷ったときは、店員さんのオススメよりも、商品のスペックやレビューを重視する。", dimension: "objectivity", weight: 1.0 },

    // Measuring Intuition (N/S) & Perception (P/J) through curiosity
    { text: "ニュースを見ているとき、事実そのものよりも「なぜこれが起きたのか」という背景や裏側が気になる。", dimension: "depth", weight: 1.0 },
    { text: "旅行のしおりを作るなら、時間ごとの細かい予定よりも「絶対に見たい場所」だけ決めておきたい。", dimension: "flexibility", weight: 1.0 },

    // Measuring Leadership & Teamwork through self-concept
    { text: "自分がミスをするよりも、チーム全体の流れを止めてしまうことの方が何倍も怖い。", dimension: "responsibility", weight: 1.0 },
    { text: "複雑な問題を解くとき、自力で完結させるよりも、得意な人に頼ってでも早く終わらせたい。", dimension: "collaboration", weight: 1.0 }
];

const types = {
    "innovator": { name: "クリエイティブ", role: "アイデア出し・発信", style: "直感 × 発想", advice: "あなたの自由な発想はチームの突破口になります。実現可能性を考える人と組むと最強です。", pref: { action: "新しい企画の立案", people: "面白い視点を持つ人" } },
    "strategist": { name: "ストラテジスト", role: "全体設計・分析", style: "論理 × 客観", advice: "冷静な判断力でミスを防げます。正論が強すぎると場が凍るので、たまには「感情」も変数に入れてみて。", pref: { action: "データの整理、計画立案", people: "合理的で仕事が早い人" } },
    "supporter": { name: "サポーター", role: "フォロー・調整", style: "共感 × 安定", advice: "あなたの気配りがチームを救います。自分の意見を押し殺しすぎず、違和感は早めに伝えて大丈夫です。", pref: { action: "メンバーのケア、資料作成", people: "誠実で感謝を伝えてくれる人" } },
    "leader": { name: "プロデューサー", role: "意思決定・推進", style: "責任感 × 決断", advice: "進むべき道を示す力があります。全員に納得させようとせず、時には強引に進める勇気が成功を呼びます。", pref: { action: "全体の進捗管理", people: "行動力があり自立している人" } }
};

let currentQuestionIndex = 0;
let rawScores = {};

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
    rawScores = {};
    questions.forEach(q => rawScores[q.dimension] = 0);
    showView(quizView);
    updateQuestion();
    renderHistory();
}

function updateQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.text;
    
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
    const values = [
        { val: -2, label: "ちがうかも", color: "#FF6B6B", size: "lg" },
        { val: -1, label: "", color: "#FF8E8E", size: "sm" },
        { val: 0, label: "ふつう", color: "#E0E0E0", size: "md" },
        { val: 1, label: "", color: "#8EEDFF", size: "sm" },
        { val: 2, label: "そうかも！", color: "#4DBCFF", size: "lg" }
    ];

    values.forEach(item => {
        const btn = document.createElement('button');
        btn.className = `pop-btn pop-size-${item.size}`;
        btn.style.backgroundColor = item.color;
        if (item.label) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'pop-btn-label';
            labelSpan.textContent = item.label;
            btn.appendChild(labelSpan);
        }
        btn.onclick = () => handleAnswer(item.val);
        optionsContainer.appendChild(btn);
    });

    progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
}

function handleAnswer(value) {
    const q = questions[currentQuestionIndex];
    rawScores[q.dimension] = value;
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    
    const resultKey = calculateType(rawScores);
    const type = types[resultKey];

    resultType.innerHTML = `
        <div class="result-pop-card">
            <span class="type-style">${type.style}</span>
            <h2 class="type-name">${type.name}</h2>
            <div class="role-chip">推奨ロール: ${type.role}</div>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="insight-box">
            <p class="insight-intro">心理分析の結果、あなたは<strong>「${type.style}」</strong>のバランスが非常に優れています。これはチームにおいて${type.role}として機能することを意味します。</p>
            
            <div class="advice-section">
                <h4>🎯 行動のアドバイス</h4>
                <p>${type.advice}</p>
            </div>

            <div class="pref-grid">
                <div class="pref-item">
                    <h5>❤️ 好きな行動</h5>
                    <p>${type.pref.action}</p>
                </div>
                <div class="pref-item">
                    <h5>👥 好きな人</h5>
                    <p>${type.pref.people}</p>
                </div>
            </div>
        </div>
    `;
    
    showView(resultView);
    saveResult(`${type.name}タイプ`);
}

function calculateType(s) {
    const scoreMap = {
        innovator: s.flexibility + s.depth + s.metaphor,
        strategist: s.objectivity + s.solution + s.detail,
        supporter: s.shared + s.collaboration + s.social_battery * -1,
        leader: s.responsibility + s.speed + s.social_battery
    };
    return Object.keys(scoreMap).reduce((a, b) => (scoreMap[a] || 0) > (scoreMap[b] || 0) ? a : b);
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('pop_insight_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('pop_insight_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('pop_insight_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('pop_insight_history');
        renderHistory();
    }
}

renderHistory();
