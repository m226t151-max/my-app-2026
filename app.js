const questions = [
    // E (Extraversion) vs I (Introversion)
    { text: "他人に会った後、心が満たされるよりも、自分の世界に戻ってリセットする必要があると感じる。", dimension: "EI", weight: 1.2, inverse: true },
    { text: "集団の中では、会話をリードするよりも、聞き役に回って場の空気を読む方が落ち着く。", dimension: "EI", weight: 1.0, inverse: true },
    { text: "自分の考えや感情を、言葉にする前に頭の中で何度も咀嚼する癖がある。", dimension: "EI", weight: 0.8, inverse: true },

    // S (Sensing) vs N (Intuition)
    { text: "未来の可能性や「見えない繋がり」を想像するよりも、目の前にある事実や実感を大切にする。", dimension: "SN", weight: 1.2, inverse: true },
    { text: "「直感」という言葉よりも、「経験」や「裏付け」という言葉に信頼を置く。", dimension: "SN", weight: 1.0, inverse: true },
    { text: "新しい手法を試すよりも、これまで上手くいっていた伝統的なやり方を洗練させたい。", dimension: "SN", weight: 0.8, inverse: true },

    // T (Thinking) vs F (Feeling)
    { text: "誰かを助ける時、共感することよりも、具体的な解決策を提示することの方が重要だと思う。", dimension: "TF", weight: 1.2 },
    { text: "判断に迷った時、感情を一旦脇に置いて、客観的な正しさを追求できる。", dimension: "TF", weight: 1.0 },
    { text: "議論において、和を乱さないことよりも、論理的な一貫性を守ることを優先する。", dimension: "TF", weight: 0.8 },

    // J (Judging) vs P (Perceiving)
    { text: "未完成の状態が嫌いで、何事も早めに結論を出して決着をつけたい。", dimension: "JP", weight: 1.2 },
    { text: "予定が未定であることよりも、一日のスケジュールが完璧に決まっている方が心地よい。", dimension: "JP", weight: 1.0 },
    { text: "「流れに任せる」よりも、自分の手で状況をコントロールしている感覚が欲しい。", dimension: "JP", weight: 0.8 }
];

const archetypes = {
    // I (Introvert), S (Sensing), T (Thinking), J (Judging) -> ISTJ
    "ISTJ": { name: "不倒の番人", trait: "誠実・秩序・完遂", desc: "あなたは静かなる守護者です。目立つことは好みませんが、誰よりも責任感が強く、あなたの築いた安定した土台が周囲を支えています。" },
    "ISFJ": { name: "慈愛の泉", trait: "調和・献身・記憶", desc: "目に見えない配慮ができる人です。過去の出来事や相手の好みを細かく記憶し、そっと手を差し伸べる温かさを持っています。" },
    "INFJ": { name: "静寂の予言者", trait: "直感・理想・洞察", desc: "物事の裏側を見抜く力があります。高い理想を持ち、人々の魂の成長を助けるような、静かだが力強い影響力を持っています。" },
    "INTJ": { name: "孤高の設計図", trait: "戦略・自律・完璧", desc: "数手先を読み、システム全体を最適化する天才です。馴れ合いを嫌い、独自の論理で世界を再構築しようとする野心を持っています。" },
    "ISTP": { name: "沈黙の職人", trait: "技術・観察・適応", desc: "言葉よりも行動で語る人です。危機的な状況で最も冷静になり、即座に手を動かして問題を解決する、孤高のスペシャリストです。" },
    "ISFP": { name: "風の表現者", trait: "感性・自由・現在", desc: "瞬間の美しさを捉えるアーティストです。型にはまることを嫌い、自分の心に従って色彩豊かな人生を描いていきます。" },
    "INFP": { name: "月下の詩人", trait: "純粋・共鳴・信念", desc: "深海のように深い感受性を持っています。自分だけの美しい価値観を持ち、世界がもっと優しくあるべきだと心から願っています。" },
    "INTP": { name: "真理の探究者", trait: "分析・独創・疑念", desc: "常識を疑い、本質を解剖する人です。知的好奇心の赴くままに思考の宇宙を彷徨い、誰も思いつかなかった理論を構築します。" },
    "ESTP": { name: "閃光の冒険家", trait: "スリル・実行・即興", desc: "今この瞬間を最大限に燃焼させる人です。リスクを恐れず飛び込み、その場の状況を巧みに操る、圧倒的な現実対応力を持っています。" },
    "ESFP": { name: "太陽の共演者", trait: "情熱・歓喜・交流", desc: "あなたの存在そのものが周囲を明るくします。人生を祝祭として捉え、人々と共に今を楽しみ、笑顔を広げる天性のエンターテイナーです。" },
    "ENFP": { name: "夢見る風車", trait: "可能性・発想・自由", desc: "退屈な日常を冒険に変える人です。溢れ出すアイデアで人々にインスピレーションを与え、新しい世界への扉を次々と開いていきます。" },
    "ENTP": { name: "知の破壊者", trait: "機知・挑戦・変革", desc: "既存の枠組みを打ち破る挑戦者です。鋭い弁舌と独創的な視点で議論を巻き起こし、停滞した空気に風穴を開ける変革の士です。" },
    "ESTJ": { name: "鉄の行政官", trait: "組織・実利・統率", desc: "混沌を秩序に変えるリーダーです。明確な基準と圧倒的な推進力で、チームを目標達成へと導く、頼れる実力者です。" },
    "ESFJ": { name: "祝祭の主人", trait: "世話・調和・社交", desc: "誰もが居心地よく過ごせる場を作る名人です。人々のニーズを敏感に察知し、コミュニティの絆を強める、温かな調整役です。" },
    "ENFJ": { name: "導きの聖火", trait: "情熱・鼓舞・信頼", desc: "他人の可能性を信じ、引き出す人です。あなたの言葉は人々の心に火を灯し、共通の理想に向かって団結させるカリスマ性を持っています。" },
    "ENTJ": { name: "覇道の王", trait: "決断・野心・構築", desc: "巨大なビジョンを実現するために生まれた人です。困難な状況でも迷わず決断し、効率的に組織を動かして勝利を掴む、生まれながらの司令塔です。" }
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
    
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    
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
    // inverseがtrueなら値を反転（内向的・感覚的などをプラス側に持っていく）
    const adjustedValue = q.inverse ? -value : value;
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
    
    // スコアから4文字のコードを決定
    // 今回は内部的にMBTIの軸を使いつつ、出力は独自のアーキタイプにする
    // 正負の判定：
    // EI: + 外向, - 内向
    // SN: + 直感, - 感覚
    // TF: + 思考, - 感情
    // JP: + 判断, - 知覚
    const typeCode = 
        (scores.EI >= 0 ? "E" : "I") +
        (scores.SN < 0 ? "S" : "N") + // inverse処理でSを負にしているので
        (scores.TF >= 0 ? "T" : "F") +
        (scores.JP >= 0 ? "J" : "P");

    const arch = archetypes[typeCode];
    
    // 結果表示のカスタマイズ
    resultType.innerHTML = `<span class="arch-name">${arch.name}</span><br><span class="arch-trait">${arch.trait}</span>`;
    resultDesc.textContent = arch.desc;
    
    showView(resultView);
    saveResult(`${arch.name}`);
}

function showView(view) {
    [startView, quizView, resultView].forEach(v => v.classList.add('hidden'));
    view.classList.remove('hidden');
}

function saveResult(typeName) {
    const history = JSON.parse(localStorage.getItem('psyche_history') || '[]');
    history.unshift({
        date: new Date().toLocaleString('ja-JP'),
        type: typeName
    });
    localStorage.setItem('psyche_history', JSON.stringify(history.slice(0, 10)));
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('psyche_history') || '[]');
    historyList.innerHTML = '';
    history.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${entry.date}</span> <span>${entry.type}</span>`;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    if (confirm('履歴を削除しますか？')) {
        localStorage.removeItem('psyche_history');
        renderHistory();
    }
}

renderHistory();
