const questions = [
    // Indirect: Systemizing vs Empathizing (Analyst/Leader vs Facilitator/Scribe)
    { text: "新しい家電を買ったとき、説明書を読む前にとりあえず触って動かしてみる。", dimension: "impulse", weight: 1.0 },
    { text: "他人の家の本棚を見ると、持ち主が「何を考えているか」よりも「どう分類しているか」が気になる。", dimension: "structure", weight: 1.0 },
    
    // Indirect: Focus of Control (Leader/Sub vs Scribe/Analyst)
    { text: "映画を観るとき、主人公よりも、その背後で計画を練っている参謀や黒幕に惹かれることが多い。", dimension: "strategic", weight: 1.0 },
    { text: "行列のできる店に並んでいるとき、待ち時間よりも「列がどれくらい効率的に捌けているか」が気になってしまう。", dimension: "efficiency", weight: 1.0 },

    // Indirect: Communication Style (Presenter/Leader vs Scribe/Facilitator)
    { text: "自分のアイデアを説明するとき、正確な定義よりも「たとえ話」や「イメージ」を多用する方だ。", dimension: "metaphor", weight: 1.0 },
    { text: "話し合いの最中、沈黙が続くと「何か話さなきゃ」と思うよりも、「みんな今、考えているんだな」と観察する。", dimension: "observation", weight: 1.0 },

    // Indirect: Adaptability & Risk (Presenter/Facilitator vs Analyst/Scribe)
    { text: "旅行の計画を立てる際、行きたい場所を絞る作業よりも、現地で「何が起こるかわからない時間」を残しておく方が重要だ。", dimension: "openness", weight: 1.0 },
    { text: "散らかった部屋を見ると、どこから手をつけるか「直感」で決めるよりも、まずはゴミを「種類別」に分けることから始める。", dimension: "sorting", weight: 1.0 },

    // Indirect: Motivation (Leader/Presenter vs Sub/Scribe)
    { text: "自分が評価されることよりも、自分の作った仕組みが勝手にうまく回り続けていることの方に快感を覚える。", dimension: "system", weight: 1.0 },
    { text: "複雑なジグソーパズルを完成させたとき、達成感よりも「もっと効率的な解き方があったはずだ」という反省が先にくる。", dimension: "iteration", weight: 1.0 }
];

const profiles = {
    "architect": { name: "システム建築家", role: "構造設計とリスク管理", style: "論理・効率・俯瞰", advice: "感情を抜きにした「正解」を見抜く力がありますが、チームの熱量を維持するために『無駄な対話』も大切にしましょう。" },
    "catalyst": { name: "共鳴の触媒者", role: "場の活性化と発想の飛躍", style: "直感・比喩・変化", advice: "あなたの柔軟な発想は停滞を打破します。一方で、具体性に欠けると周囲が迷うので、数値の裏付けを持つ人と組みましょう。" },
    "anchor": { name: "沈黙のアンカー", role: "安定した運用と記録", style: "観察・分類・着実", advice: "状況を冷静に仕分けるあなたの存在はチームの守り神です。気づいた違和感を早めに口に出すと、大事故を防げます。" },
    "director": { name: "多角的な指揮者", role: "意思決定とリソース配分", style: "戦略・目的・実利", advice: "全体最適を考えるのが得意ですが、細部に宿るメンバーのこだわりにも目を向けると、より強固な信頼が得られます。" }
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
    
    const resultKey = calculateImplicitProfile(rawScores);
    const profile = profiles[resultKey];

    resultType.innerHTML = `
        <div class="role-result">
            <span class="role-badge">潜在資質：${profile.style}</span>
            <h2 class="role-name">${profile.name}</h2>
            <p class="role-task">推奨される立ち回り: ${profile.role}</p>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="insight-container">
            <h3>🧠 無意識の思考パターン</h3>
            <p>あなたは${getMentalPattern(resultKey)}。この特性はグループワークにおいて、${profile.role}として非常に強力な武器になります。</p>

            <h3>💡 パフォーマンス最大化のヒント</h3>
            <p>${profile.advice}</p>

            <h3>🔍 あなたの「隠れた」嗜好</h3>
            <ul class="pref-list">
                <li><strong>心地よい行動:</strong> ${getHiddenPref(resultKey, 'action')}</li>
                <li><strong>信頼する人:</strong> ${getHiddenPref(resultKey, 'people')}</li>
            </ul>
        </div>
    `;
    
    showView(resultView);
    saveResult(`${profile.name}`);
}

function calculateImplicitProfile(s) {
    // 隠れた相関による複雑な判定
    const logicScore = (s.structure + s.sorting + s.system) / 3;
    const intuitionScore = (s.metaphor + s.openness + s.impulse) / 3;
    const strategicScore = (s.strategic + s.efficiency + s.iteration) / 3;
    const socialScore = (s.observation - s.efficiency) / 2;

    if (strategicScore > 0.5 && logicScore > 0.5) return "architect";
    if (intuitionScore > 0.5 && socialScore > 0) return "catalyst";
    if (logicScore > 0.5 && socialScore > 0.5) return "anchor";
    return "director";
}

function getMentalPattern(key) {
    const patterns = {
        architect: "物事を「感情」ではなく「構造」で捉える力が極めて高いタイプです。最短ルートを見つけるだけでなく、それが永続的に機能するかを無意識に計算しています",
        catalyst: "言葉にできない「空気感」や「可能性」をイメージで捉えるタイプです。一見無関係なもの同士を結びつけ、爆発的なアイデアを生む力があります",
        anchor: "混沌とした状況を「仕分ける」ことで安心を得るタイプです。あなたが整理した情報はチームの共有財産となり、全員の迷いを払拭します",
        director: "常に「費用対効果」と「目的」を天秤にかけているタイプです。情に流されず、結果を出すために今何が最優先かを冷徹かつ迅速に判断できます"
    };
    return patterns[key];
}

function getHiddenPref(key, type) {
    const prefs = {
        architect: { action: "無駄を削ぎ落とし、最適な仕組みを作る", people: "馴れ合いではなく、高い専門性で会話ができる人" },
        catalyst: { action: "予定にない面白い寄り道を楽しむ", people: "自分の枠を超えた発想を面白がってくれる人" },
        anchor: { action: "バラバラな情報を一つの地図にまとめる", people: "嘘がなく、一貫した行動をとる誠実な人" },
        director: { action: "混沌とした場に明確な一線を引く", people: "感情論ではなく、メリット・デメリットで議論できる人" }
    };
    return prefs[key][type];
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('implicit_role_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('implicit_role_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('implicit_role_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('implicit_role_history');
        renderHistory();
    }
}

renderHistory();
