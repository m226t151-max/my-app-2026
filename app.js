const questions = [
    // R1: Leadership/Facilitation
    { text: "グループでの話し合いでは、自分から口火を切って方向性を決めることが苦ではない。", dimension: "leadership", weight: 1.2 },
    { text: "意見が対立した際、双方の妥協点を見つけて場を収めることが得意だ。", dimension: "facilitation", weight: 1.0 },

    // R2: Support/Documentation
    { text: "議論を整理し、決定事項を後から見返せるように記録することにやりがいを感じる。", dimension: "support", weight: 1.2 },
    { text: "大きな方針を決めるよりも、具体的なタスクの抜け漏れをチェックする方が落ち着く。", dimension: "support", weight: 1.0 },

    // R3: Creativity/Presentation
    { text: "自分の考えをスライドや言葉で視覚化し、他人に伝えることが好きだ。", dimension: "expression", weight: 1.2 },
    { text: "既存のルールに従うよりも、「もっと面白い方法があるはずだ」と新しい提案をしたい。", dimension: "creativity", weight: 1.0 },

    // S1: Sub-Type Determinants (Passion/Social vs Logic/Method)
    { text: "論理的な正しさよりも、メンバーのやる気や熱量を高めることの方が重要だと思う。", dimension: "passion", weight: 1.0 },
    { text: "新しいことを始めるワクワク感よりも、最後まで着実にやり遂げる安心感の方が好きだ。", dimension: "stability", weight: 1.0 },
    { text: "想定外のトラブルが起きた時、慌てるよりも「どう解決するか」と頭が冷えていく感覚がある。", dimension: "logic_calm", weight: 1.0 },
    { text: "自分の成果を褒められるよりも、チーム全体の雰囲気が良いことの方が嬉しい。", dimension: "harmony", weight: 1.0 }
];

const mainRoles = {
    "leader": { name: "リーダー", task: "意思決定と全体指揮" },
    "subLeader": { name: "サブリーダー", task: "補佐とチームの潤滑油" },
    "facilitator": { name: "ファシリテーター", task: "議論の活性化と合意形成" },
    "scribe": { name: "書記・記録", task: "情報の構造化と記録" },
    "presenter": { name: "発表・プレゼンター", task: "成果の発信と視覚化" },
    "analyst": { name: "アナリスト", task: "論理チェックとリスク管理" }
};

const subTypes = {
    "passionate": { name: "情熱型", trait: "熱量で周囲を動かす", advice: "あなたのエネルギーは最大の武器ですが、冷静なメンバーとの温度差に注意しましょう。" },
    "strategic": { name: "戦略型", trait: "効率とゴールを見据える", advice: "最短ルートを見抜く力がありますが、プロセスの納得感を大切にするとより協力が得られます。" },
    "empathic": { name: "共感型", trait: "心の安全性を守る", advice: "メンバーのケアは素晴らしいですが、時には耳の痛い正論を伝える勇気も持ちましょう。" },
    "methodical": { name: "着実型", trait: "確実性と精度を追求する", advice: "ミスのなさは信頼に直結します。変化の激しい状況では、6割の完成度で動く練習もしてみて。" }
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
    rawScores = {
        leadership: 0, facilitation: 0, support: 0,
        expression: 0, creativity: 0, passion: 0,
        stability: 0, logic_calm: 0, harmony: 0
    };
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
        { val: -2, label: "全く違う", size: "lg" },
        { val: -1, label: "", size: "sm" },
        { val: 0, label: "どちらでもない", size: "md" },
        { val: 1, label: "", size: "sm" },
        { val: 2, label: "その通りだ", size: "lg" }
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
    rawScores[q.dimension] += value;
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    
    const mainKey = calculateMainRole(rawScores);
    const subKey = calculateSubType(rawScores);
    
    const main = mainRoles[mainKey];
    const sub = subTypes[subKey];

    resultType.innerHTML = `
        <div class="role-result">
            <span class="role-badge">${sub.name} × ${main.name}</span>
            <h2 class="role-name">${sub.name}な${main.name}</h2>
            <p class="role-task">専門領域: ${main.task}</p>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="insight-container">
            <h3>📌 あなたの独自スタイル</h3>
            <p><strong>${sub.trait}</strong>があなたの特徴です。同じ「${main.name}」担当の中でも、${sub.trait.toLowerCase()}という点が周囲からの信頼に繋がっています。</p>

            <h3>💡 このタイプへのアドバイス</h3>
            <p>${sub.advice}</p>

            <h3>🔍 好みの傾向</h3>
            <ul class="pref-list">
                <li><strong>心地よい行動:</strong> ${getDetailedPref(subKey, 'action')}</li>
                <li><strong>求める環境:</strong> ${getDetailedPref(subKey, 'env')}</li>
            </ul>
        </div>
    `;
    
    showView(resultView);
    saveResult(`${sub.name}な${main.name}`);
}

function calculateMainRole(s) {
    const scores = {
        leader: s.leadership * 1.5,
        presenter: s.expression * 1.5,
        scribe: s.support * 1.5,
        facilitator: s.facilitation * 1.2,
        analyst: s.creativity * 1.2,
        subLeader: (s.support + s.facilitation) / 2
    };
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function calculateSubType(s) {
    const scores = {
        passionate: s.passion,
        strategic: s.logic_calm,
        empathic: s.harmony,
        methodical: s.stability
    };
    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
}

function getDetailedPref(sub, type) {
    const prefs = {
        passionate: { action: "熱い議論、ビジョンの共有", env: "エネルギーに満ちた、活気ある現場" },
        strategic: { action: "効率化の検討、勝算の分析", env: "目的が明確で、無駄のない環境" },
        empathic: { action: "対話による相互理解、ケア", env: "心理的安全性が高く、温かいチーム" },
        methodical: { action: "手順の確立、確実な遂行", env: "ルールが整備された、安定感のある場" }
    };
    return prefs[sub][type];
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('group_role_v2_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('group_role_v2_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('group_role_v2_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('group_role_v2_history');
        renderHistory();
    }
}

renderHistory();
