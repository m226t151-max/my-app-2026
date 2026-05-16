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
    "innovator": { 
        name: "INNOVATOR", 
        role: "アイデア出し・発信", 
        style: "INTUITION × CREATIVE", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="50" r="45" fill="#FFF4D1" opacity="0.5"/>
            <circle cx="50" cy="22" r="12" fill="#FFB800"/>
            <path d="M50 34 L50 75 M50 45 L85 35 M50 45 L15 35 M50 75 L75 95 M50 75 L25 95" stroke="#FFB800" stroke-width="8" stroke-linecap="round" fill="none"/>
            <path d="M80 15 L82 22 L89 22 L83 26 L85 33 L80 29 L75 33 L77 26 L71 22 L78 22 Z" fill="#FFD700">
                <animateTransform attributeName="transform" type="rotate" from="0 80 25" to="360 80 25" dur="4s" repeatCount="indefinite" />
            </path>
        </svg>`,
        description: "あなたの脳内は、常に新しいアイデアが弾ける『創造のラボ』です！当たり前の景色に『！』を見出す天才で、停滞した空気を一瞬でワクワクに変える魔法を持っています。チームにおけるあなたの存在は、未開の地を照らすサーチライトそのものです。",
        advice: "あなたの武器は、誰もが驚く『発想の飛躍』です。議論が詰まったときほど、あなたの出番！ただし、ひらめきが速すぎて周りが追いつけないこともあるので、図解したり例え話を使ったりして、みんなをあなたの冒険に巻き込んでいきましょう。",
        behavior: "🌟 質より量！まずは10個の『おもしろ案』を出してみる\n🌟 実務が得意な相棒を見つけて、アイデアを形にする\n🌟 「もし〇〇だったら？」という魔法の質問を投げかける"
    },
    "strategist": { 
        name: "STRATEGIST", 
        role: "全体設計・分析", 
        style: "LOGIC × ANALYTICAL", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="50" r="45" fill="#E0F2FF" opacity="0.5"/>
            <circle cx="50" cy="22" r="12" fill="#007AFF"/>
            <path d="M50 34 L50 75 M50 45 L80 60 M50 45 L20 60 M50 75 L65 95 M50 70 L35 95" stroke="#007AFF" stroke-width="8" stroke-linecap="round" fill="none"/>
            <rect x="70" y="20" width="10" height="10" rx="2" fill="#007AFF">
                <animate attributeName="y" values="20;25;20" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="75" y="35" width="8" height="8" rx="2" fill="#00D2FF"/>
        </svg>`,
        description: "あなたは、混沌としたパズルを一瞬で解き明かす『知の設計士』です。感情に左右されず、常に10手先を読み切る冷静さは、チームに最強の安心感を与えます。あなたの描くロードマップは、メンバー全員にとっての『勝利への地図』となります。",
        advice: "あなたの冷静な分析は、チームの無駄を削ぎ落とし、成功率を最大化します。リスクを察知するセンサーは超一級品！正論を伝えるときは、少しの『ユーモア』や『共感』を添えるだけで、チームの結束力はさらに盤石なものになります。",
        behavior: "📊 議論の要点を3行でまとめて、迷いを取り除く\n📊 完璧を目指しすぎず、まずは『最小の成功モデル』を作る\n📊 数字や根拠をセットにして、説得力を爆上げする"
    },
    "supporter": { 
        name: "SUPPORTER", 
        role: "フォロー・調整", 
        style: "EMPATHY × STABILITY", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="50" r="45" fill="#FFF0F0" opacity="0.5"/>
            <circle cx="50" cy="22" r="12" fill="#FF6B6B"/>
            <path d="M50 34 L50 75 M50 45 C80 30 80 70 50 70 C20 70 20 30 50 45 M50 75 L70 95 M50 75 L30 95" stroke="#FF6B6B" stroke-width="8" stroke-linecap="round" fill="none"/>
            <path d="M80 30 L82 33 L85 30 L85 27 L82 27 Z" fill="#FF6B6B" transform="scale(2)">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
            </path>
        </svg>`,
        description: "あなたは、チームという生命体を守る『優しき心臓』です。メンバーの表情一つで不調を察し、場を温めるあなたの配慮は、全員のパフォーマンスを底上げします。あなたがいてくれるからこそ、チームは一つの生き物として機能できるのです。",
        advice: "あなたの『聴く力』は、どんなスキルよりも希少です。メンバーの衝突を回避し、全員を納得感のあるゴールへ導く力は、プロジェクトの持続性を支えています。自分のケアも忘れずに！あなたが笑っていることが、チームの一番の活力になります。",
        behavior: "🤝 発言が少ない人に『〇〇さんはどう思う？』とパスを出す\n🤝 メンバーの小さな成功を、誰よりも早く見つけて褒める\n🤝 議論がトゲトゲしてきたら、お菓子や休憩を提案する"
    },
    "leader": { 
        name: "PRODUCER", 
        role: "意思決定・推進", 
        style: "COMMITMENT × DECISIVE", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="50" r="45" fill="#F3F0FF" opacity="0.5"/>
            <circle cx="50" cy="22" r="12" fill="#6C5CE7"/>
            <path d="M50 34 L50 75 M50 45 L85 45 M50 45 L15 45 M50 75 L75 95 M50 75 L25 95" stroke="#6C5CE7" stroke-width="8" stroke-linecap="round" fill="none"/>
            <path d="M15 45 L15 20 L35 32 L15 45" fill="#6C5CE7"/>
            <path d="M15 45 L15 60" stroke="#6C5CE7" stroke-width="4"/>
        </svg>`,
        description: "あなたは、嵐の中でも太陽の方向を示し続ける『熱き航海士』です。不確実な未来に一歩踏み出すあなたの決断力は、チーム全員の勇気に火を灯します。掲げた旗（ゴール）に向かって全員を巻き込み、結果を掴み取るパワーは圧巻です。",
        advice: "あなたの『やり抜く力』は、不可能を可能に変えます。時には強引に道を切り拓く勇気も必要ですが、メンバーと同じ景色を見ているか、定期的に声をかけるだけで、チームの馬力はさらに跳ね上がります。あなたの背中が、みんなの道標です。",
        behavior: "🚩 チームの『最終ゴール』を何度も, 熱く語りかける\n🚩 決まらない議論に、あえて『一線を引く』決断をする\n🚩 成功したときは『みんなのおかげ』、失敗は『自分の責任』"
    }
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
        { val: -2, label: "NO", color: "#FF6B6B", size: "lg" },
        { val: -1, label: "", color: "#FFB3B3", size: "sm" },
        { val: 0, label: "MIDDLE", color: "#E1E8F0", size: "md" },
        { val: 1, label: "", color: "#A3D8FF", size: "sm" },
        { val: 2, label: "YES", color: "#007AFF", size: "lg" }
    ];

    values.forEach(item => {
        const btnWrapper = document.createElement('div');
        btnWrapper.className = 'pop-btn-wrapper';

        const btn = document.createElement('button');
        btn.className = `pop-btn pop-size-${item.size}`;
        btn.style.backgroundColor = item.color;
        btn.style.borderColor = "#fff";
        
        if (item.label) {
            const labelSpan = document.createElement('span');
            labelSpan.className = 'pop-btn-label-persistent';
            labelSpan.textContent = item.label;
            btnWrapper.appendChild(labelSpan);
        }
        
        btn.onclick = () => handleAnswer(item.val);
        btnWrapper.appendChild(btn);
        optionsContainer.appendChild(btnWrapper);
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

    const illustrationContainer = document.getElementById('result-illustration');
    illustrationContainer.innerHTML = type.illustration;

    resultType.innerHTML = `
        <div class="result-pop-card-vivid">
            <span class="type-style-pop">${type.style}</span>
            <h1 class="type-name-pop">${type.name}</h1>
            <div class="role-chip-vivid">${type.role}</div>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="pop-layout-container">
            <div class="pop-card-insight">
                <div class="pop-card-header">
                    <span class="pop-icon">🔍</span>
                    <h3>あなたの資質分析</h3>
                </div>
                <div class="pop-card-body">
                    <p>${type.description}</p>
                </div>
            </div>
            
            <div class="pop-card-action">
                <div class="pop-card-header">
                    <span class="pop-icon">🎯</span>
                    <h3>アクションプラン</h3>
                </div>
                <div class="pop-card-body">
                    <p class="action-summary">${type.advice}</p>
                    <div class="pop-behavior-box">
                        ${type.behavior.split('\n').map(b => `<div class="pop-behavior-item">${b}</div>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showView(resultView);
    saveResult(`${type.name}タイプ`);
}

function calculateType(s) {
    const scoreMap = {
        innovator: (s.flexibility || 0) + (s.depth || 0),
        strategist: (s.objectivity || 0) + (s.solution || 0) + (s.detail || 0),
        supporter: (s.shared || 0) + (s.collaboration || 0) + ((s.social_battery || 0) * -1),
        leader: (s.responsibility || 0) + (s.speed || 0) + (s.social_battery || 0)
    };
    return Object.keys(scoreMap).reduce((a, b) => (scoreMap[a] || 0) > (scoreMap[b] || 0) ? a : b);
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('team_scan_v3_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('team_scan_v3_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('team_scan_v3_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('team_scan_v3_history');
        renderHistory();
    }
}

renderHistory();
