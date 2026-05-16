const questions = [
    // Social Drive (E/I)
    { text: "一人で作業するよりも、チームや対面で意見を交わしながら進める方が、質が高まると感じる。", dimension: "social", weight: 1.2 },
    { text: "新しい環境や初対面の人との交流を、楽しみよりも負担に感じることが多い。", dimension: "social", weight: 1.0, inverse: true },
    { text: "週末は誰とも会わずに過ごすと、心身ともに回復した実感が持てる。", dimension: "social", weight: 0.8, inverse: true },

    // Data Reliance (S/N)
    { text: "何かを決める際、「なんとなくの直感」よりも「数値や過去の実績」を第一の判断材料にする。", dimension: "data", weight: 1.2 },
    { text: "マニュアルや手順書がない状況で動くよりも、ルールが明確な方が力を発揮できる。", dimension: "data", weight: 1.0 },
    { text: "将来の大きなビジョンを語るより、今日の具体的なタスクを片付けることに満足感を得る。", dimension: "data", weight: 0.8 },

    // Logic Weight (T/F)
    { text: "話し合いの場では、相手の気持ちを汲み取ることより、正論や効率を重視する。", dimension: "logic", weight: 1.2 },
    { text: "「冷徹」と言われることがあっても、客観的な正しさを貫くことが信頼に繋がると信じている。", dimension: "logic", weight: 1.0 },
    { text: "映画や物語を観て、論理的な矛盾が気になると、内容に感情移入できなくなることがある。", dimension: "logic", weight: 0.8 },

    // Action Speed (J/P)
    { text: "ギリギリまで情報を集めて柔軟に変えるより、早めに計画を固定して安心したい。", dimension: "action", weight: 1.2 },
    { text: "突発的な予定変更にはストレスを感じ、当初の計画を維持しようとする。", dimension: "action", weight: 1.0 },
    { text: "机の上や部屋が整理整頓されていないと、思考の集中力が著しく低下する。", dimension: "action", weight: 0.8 }
];

const componentLabels = {
    social: "対人エネルギー",
    data: "情報信頼度",
    logic: "論理優先度",
    action: "計画完遂度"
};

let currentQuestionIndex = 0;
// 各指標 0〜100% で算出するためのスコア
let scores = { social: 0, data: 0, logic: 0, action: 0 };

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
    scores = { social: 0, data: 0, logic: 0, action: 0 };
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
        { val: -2, label: "全くない", size: "lg" },
        { val: -1, label: "", size: "sm" },
        { val: 0, label: "普通", size: "md" },
        { val: 1, label: "", size: "sm" },
        { val: 2, label: "非常にある", size: "lg" }
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
    const adjustedValue = q.inverse ? -value : value;
    
    // スコア加算（正規化は最後に行う）
    // 1質問あたり最大 2 * weight
    scores[q.dimension] += (adjustedValue * q.weight);
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    
    // 各指標を 0-100 のパーセンテージに変換
    // 理論上の最小値は - (2 * (1.2+1.0+0.8)) = -6
    // 理論上の最大値は +6
    // (score + 6) / 12 * 100
    const finalScores = {};
    for (const key in scores) {
        let percentage = ((scores[key] + 6) / 12) * 100;
        finalScores[key] = Math.min(Math.max(Math.round(percentage), 0), 100);
    }

    // インサイトの生成
    const insights = generateInsights(finalScores);
    
    resultType.innerHTML = `<div class="composition-grid">
        ${Object.entries(finalScores).map(([key, val]) => `
            <div class="comp-item">
                <span class="comp-label">${componentLabels[key]}</span>
                <div class="comp-bar-bg"><div class="comp-bar-fill" style="width: ${val}%"></div></div>
                <span class="comp-val">${val}%</span>
            </div>
        `).join('')}
    </div>`;

    resultDesc.innerHTML = `<div class="insight-container">
        <h3>分析インサイト</h3>
        <p class="main-type-label">あなたは <strong>「${getMainType(finalScores)}」</strong> 傾向が強いタイプです。</p>
        <ul class="insight-list">
            ${insights.map(i => `<li>${i}</li>`).join('')}
        </ul>
    </div>`;
    
    showView(resultView);
    saveResult(`構成分析: ${getMainType(finalScores)}`);
}

function getMainType(s) {
    if (s.social > 60 && s.action > 60) return "推進リーダー";
    if (s.data > 60 && s.logic > 60) return "精密アナリスト";
    if (s.social < 40 && s.logic > 60) return "独立思考家";
    if (s.social > 60 && s.logic < 40) return "調和サポーター";
    if (s.action < 40 && s.data < 40) return "柔軟クリエイター";
    return "バランスプレイヤー";
}

function generateInsights(s) {
    const ins = [];
    if (s.social > 70) ins.push("交流からエネルギーを得るため、孤独な長時間の作業は効率を下げます。適度な雑談を。");
    else if (s.social < 30) ins.push("一人の時間を確保することで思考が深化します。重要な決断は静かな環境で。");

    if (s.data > 70) ins.push("確実性を重視するあまり、前例のない挑戦に躊躇しがちです。たまには直感も信じて。");
    else if (s.data < 30) ins.push("抽象的な概念を扱うのが得意ですが、細部の詰めが甘くなる傾向があります。確認作業を大切に。");

    if (s.logic > 70) ins.push("論理的整合性を求めすぎるあまり、周囲との感情的な摩擦を生む可能性があります。");
    else if (s.logic < 30) ins.push("他人の期待に応えようとしすぎて、自分自身の本音を後回しにする傾向があります。");

    if (s.action > 70) ins.push("計画通りに進まないと強いストレスを感じます。バッファを持たせたスケジュール設計を。");
    else if (s.action < 30) ins.push("締め切り間際に集中力が上がるタイプですが、周囲をヒヤヒヤさせることも。");

    return ins;
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('inbody_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('inbody_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('inbody_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('inbody_history');
        renderHistory();
    }
}

renderHistory();
