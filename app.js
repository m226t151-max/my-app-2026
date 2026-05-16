const questions = [
    // R1: Leadership/Facilitation (Influence & Vision)
    { text: "グループでの話し合いでは、自分から口火を切って方向性を決めることが苦ではない。", dimension: "leadership", weight: 1.2 },
    { text: "意見が対立した際、双方の妥協点を見つけて場を収めることが得意だ。", dimension: "facilitation", weight: 1.0 },

    // R2: Support/Documentation (Details & Order)
    { text: "議論を整理し、決定事項を後から見返せるように記録することにやりがいを感じる。", dimension: "support", weight: 1.2 },
    { text: "大きな方針を決めるよりも、具体的なタスクの抜け漏れをチェックする方が落ち着く。", dimension: "support", weight: 1.0 },

    // R3: Creativity/Presentation (Expression & Concept)
    { text: "自分の考えをスライドや言葉で視覚化し、他人に伝えることが好きだ。", dimension: "expression", weight: 1.2 },
    { text: "既存のルールに従うよりも、「もっと面白い方法があるはずだ」と新しい提案をしたい。", dimension: "creativity", weight: 1.0 },

    // P1: Action/Environment/People Preferences
    { text: "一人で黙々と作業する時間よりも、対話を通じてアイデアを磨く時間の方が好きだ。", dimension: "interpersonal", weight: 1.2 },
    { text: "不確実で自由な状況よりも、役割とゴールが明確な環境の方が力を発揮できる。", dimension: "structure", weight: 1.0 },
    { text: "感情的な共感よりも、知的な刺激をくれる人と一緒にいることに価値を感じる。", dimension: "intellectual", weight: 1.0 },
    { text: "計画通りに物事を進めることそのものに快感を覚える。", dimension: "order", weight: 1.0 }
];

const roleDefinitions = {
    "leader": { name: "舵取りリーダー", role: "意思決定と全体指揮", advice: "全体の進捗を常に把握し、停滞した時に「決める」勇気を持ちましょう。周囲に意見を求める余裕も忘れずに。" },
    "subLeader": { name: "伴走型サブリーダー", role: "リーダーの補佐と調整", advice: "リーダーが見落としがちなメンバーの不満や細部をフォローしましょう。橋渡し役としての存在感が鍵です。" },
    "facilitator": { name: "調整役（ファシリテーター）", role: "場の活性化と合意形成", advice: "発言の少ない人に話を振ったり、対立をポジティブな議論に変えることを意識してください。" },
    "scribe": { name: "知の書記官（記録担当）", role: "情報の整理と資産化", advice: "ただ記録するだけでなく、議論を構造化して「今、何が決まったか」を随時共有すると感謝されます。" },
    "presenter": { name: "伝えるプロ（発表者）", role: "成果の視覚化と発信", advice: "聞き手が何を求めているかを意識しましょう。論理だけでなく、熱意を乗せるとより伝わります。" },
    "analyst": { name: "精密アナリスト（分析担当）", role: "論理チェックとリスク管理", advice: "「なぜ？」という視点を持ち続け、計画の穴を塞ぎましょう。批判ではなく、改善案として伝えるのがコツです。" }
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
    rawScores[q.dimension] += (value * q.weight);
    
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        updateQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    progressBar.style.width = '100%';
    
    const roleKey = calculateRole(rawScores);
    const role = roleDefinitions[roleKey];
    const preferences = calculatePreferences(rawScores);

    resultType.innerHTML = `
        <div class="role-result">
            <span class="role-badge">適正ロール</span>
            <h2 class="role-name">${role.name}</h2>
            <p class="role-task">主な役割: ${role.role}</p>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="insight-container">
            <h3>💡 行動・思考のアドバイス</h3>
            <p>${role.advice}</p>

            <h3>❤️ あなたの「好き」の傾向</h3>
            <ul class="pref-list">
                <li><strong>行動:</strong> ${preferences.action}</li>
                <li><strong>環境:</strong> ${preferences.env}</li>
                <li><strong>人物:</strong> ${preferences.people}</li>
            </ul>
        </div>
    `;
    
    showView(resultView);
    saveResult(`${role.name}`);
}

function calculateRole(s) {
    // 簡易的な判定ロジック
    if (s.leadership > 1) return "leader";
    if (s.expression > 1) return "presenter";
    if (s.support > 1) return "scribe";
    if (s.facilitation > 0.5) return "facilitator";
    if (s.creativity > 0.5) return "analyst";
    return "subLeader";
}

function calculatePreferences(s) {
    return {
        action: s.interpersonal > 0 ? "対話を通じたブラッシュアップ、共有" : "静かな環境での深い思考、具体化",
        env: s.structure > 0 ? "役割と手順が明確な整った場" : "自由度が高く、変化を楽しめる場",
        people: s.intellectual > 0 ? "専門性が高く、知的な刺激をくれる人" : "共感的で、心理的安全性を守ってくれる人"
    };
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('group_role_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('group_role_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('group_role_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('group_role_history');
        renderHistory();
    }
}

renderHistory();
