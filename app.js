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
            <circle cx="50" cy="25" r="12" fill="#007AFF"/>
            <path d="M50 37 L50 70 M50 45 L75 30 M50 45 L25 30 M50 70 L70 90 M50 70 L30 90" stroke="#007AFF" stroke-width="6" stroke-linecap="round" fill="none"/>
            <circle cx="80" cy="25" r="6" fill="#00D2FF">
                <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
            </circle>
        </svg>`,
        description: "あなたは、既存の枠組みにとらわれない自由な思考の持ち主です。誰もが「これが当たり前」と思っていることに対して、「なぜ？」と疑問を持ち、新しい可能性を見出す力に長けています。チームにおいては、行き詰まった状況を打破する『ひらめき』を提供する重要なポジションです。",
        advice: "あなたの最大の武器は『多角的な視点』です。議論が煮詰まったときこそ、あなたの突飛なアイデアが状況を動かします。ただし、アイデアが抽象的になりすぎると周囲が置いていかれることがあるため、『具体的にどう動くか』をセットで考えるか、実務に強いメンバーと連携することで、あなたの真価がより発揮されます。",
        behavior: "1. 批判を恐れず、まずは質より量でアイデアを出してみましょう。2. 自分のひらめきを言語化する練習をすると、より周囲の協力を得やすくなります。3. 計画が細かすぎるとストレスを感じるため、自由度の高いパートを担当させてもらうのがベストです。"
    },
    "strategist": { 
        name: "STRATEGIST", 
        role: "全体設計・分析", 
        style: "LOGIC × ANALYTICAL", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="25" r="12" fill="#007AFF"/>
            <path d="M50 37 L50 70 M50 45 L75 55 M50 45 L25 55 M50 70 L65 95 M50 70 L35 95" stroke="#007AFF" stroke-width="6" stroke-linecap="round" fill="none"/>
            <rect x="30" y="45" width="40" height="25" rx="4" fill="none" stroke="#007AFF" stroke-width="2" stroke-dasharray="4 2"/>
        </svg>`,
        description: "あなたは、常に一歩引いた視点から物事を冷静に観察できる分析家です。感情に流されず、事実とデータに基づいて最適解を導き出す能力は、チームの安定性と成功率を劇的に高めます。混沌とした状況を整理し、論理的なロードマップを描くことが得意です。",
        advice: "あなたの冷静さは、チームに『確信』を与えます。リスクを早期に見抜き、致命的なミスを未然に防ぐことができるでしょう。一方で、正論が時に他人の感情を置き去りにしてしまうことがあります。アドバイスを伝える際に『相手の努力』を一度認めるステップを挟むだけで、あなたの提案はよりスムーズに受け入れられるようになります。",
        behavior: "1. 議論が発散したときは、要点を整理してマイルストーンを提示しましょう。2. 完璧主義に陥りすぎず、スピードが求められる場面では『8割の完成度』で良しとする感覚を持つと楽になります。3. 抽象的な議論を数値化・可視化することで、チームへの貢献度が最大化します。"
    },
    "supporter": { 
        name: "SUPPORTER", 
        role: "フォロー・調整", 
        style: "EMPATHY × STABILITY", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="25" r="12" fill="#007AFF"/>
            <path d="M50 37 L50 70 M50 45 C75 35 75 65 50 65 C25 65 25 35 50 45 M50 70 L70 90 M50 70 L30 90" stroke="#007AFF" stroke-width="6" stroke-linecap="round" fill="none"/>
        </svg>`,
        description: "あなたは、チームの心理的安全性を支える守り神のような存在です。メンバーの小さな変化や感情の機微を敏感に察知し、必要なときにそっと手を差し伸べることができます。あなたの存在があるからこそ、他のメンバーは安心して自分の役割に集中できるのです。",
        advice: "あなたの貢献は数字には現れにくいかもしれませんが、チームの持続性においては最も重要です。メンバー同士の衝突を和らげ、潤滑油として機能することで、チームの総和を最大化させています。自分を『裏方』だと思わず、あなたの調整力がなければチームは崩壊するという自覚を持ってください。",
        behavior: "1. 会議で発言が少ない人をフォローし、意見を出しやすい空気を作りましょう。2. 自分の負担が大きくなりやすいので、無理なときはNOと言う勇気を持ちましょう。3. メンバーの良いところを具体的に褒めることで、チーム全体の士気を劇的に上げることができます。"
    },
    "leader": { 
        name: "PRODUCER", 
        role: "意思決定・推進", 
        style: "COMMITMENT × DECISIVE", 
        illustration: `<svg viewBox="0 0 100 100" class="svg-humanoid">
            <circle cx="50" cy="25" r="12" fill="#007AFF"/>
            <path d="M50 37 L50 70 M50 45 L80 45 M50 45 L20 45 M50 70 L75 95 M50 70 L25 95" stroke="#007AFF" stroke-width="6" stroke-linecap="round" fill="none"/>
            <path d="M75 35 L85 45 L75 55" stroke="#007AFF" stroke-width="4" stroke-linecap="round" fill="none"/>
        </svg>`,
        description: "あなたは、目標に向かって迷いなく突き進む圧倒的なエネルギーの持ち主です。困難な状況でも『私たちがやるべきことはこれだ』と指針を示すことができるため、周囲はあなたを自然と頼りにします。責任感が強く、結果を出すための最短ルートを常に探求しています。",
        advice: "あなたの決断力は、停滞したチームを動かす原動力です。周囲が迷っているときに、あえてリスクを取って決める姿勢は、真のリーダーシップそのものです。ただし、独走しすぎると周囲が疲弊してしまうことがあります。定期的に後ろを振り返り、メンバーとの『納得感の共有』を行うことで、より大きな目標を達成できるはずです。",
        behavior: "1. チームの最終目標を繰り返し言葉にし、全員の目線を合わせましょう。2. メンバーに仕事を任せる際は、やり方まで指示せず『目的』を伝えることで、相手の成長を促せます。3. 意見が対立したときは、どちらが正しいかではなく、どちらが目標に近いかで判断しましょう。"
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
        <div class="result-pop-card">
            <span class="type-style">${type.style}</span>
            <h1 class="type-name">${type.name}</h1>
            <div class="role-chip">推奨される役割: ${type.role}</div>
        </div>
    `;

    resultDesc.innerHTML = `
        <div class="insight-box">
            <div class="analysis-section">
                <h3>🔍 あなたの資質分析</h3>
                <p>${type.description}</p>
            </div>
            
            <div class="advice-section">
                <h3>🎯 具体的なアクションプラン</h3>
                <p>${type.advice}</p>
                <div class="behavior-list">
                    ${type.behavior.split('\n').map(b => `<p class="behavior-item">${b}</p>`).join('')}
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
