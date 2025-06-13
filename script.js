// 题目数据 - 你可以根据需要修改或扩展
const questions = [
    {
        id: "q1",
        text: "我通常在晚上11点后感觉精神最好，效率最高。",
        dimension: "rhythm"
    },
    {
        id: "q2",
        text: "我习惯早起（早于7点），享受清晨的宁静时光。",
        dimension: "rhythm"
    },
    {
        id: "q3",
        text: "我非常在意居住环境的整洁度，定期整理是必须的。",
        dimension: "rhythm"
    },
    {
        id: "q4",
        text: "我容易被环境噪音干扰，需要安静的环境才能专注。",
        dimension: "rhythm"
    },
    {
        id: "q5",
        text: "我的精力比较平稳，很少出现大起大落的情况。",
        dimension: "rhythm"
    },
    {
        id: "q6",
        text: "我经常刷短视频（抖音、B站等），每天超过1小时。",
        dimension: "interest"
    },
    {
        id: "q7",
        text: "我是动漫/二次元文化的爱好者，关注相关作品和活动。",
        dimension: "interest"
    },
    {
        id: "q8",
        text: "我对新出的电子设备很感兴趣，喜欢研究科技产品。",
        dimension: "interest"
    },
    {
        id: "q9",
        text: "我更喜欢宅在宿舍，享受独处或小范围社交。",
        dimension: "interest"
    },
    {
        id: "q10",
        text: "我倾向于和室友保持一定的个人空间和边界感。",
        dimension: "interest"
    }
];

// 标签定义 - 你可以修改或添加更多标签
const tags = [
    {
        id: "night-owl",
        name: "🌙 暗夜精灵",
        desc: "夜幕降临，你的能量才刚刚充满！深夜灵感迸发是你的常态。",
        conditions: [
            { questionId: "q1", minScore: 4 }
        ]
    },
    {
        id: "early-bird",
        name: "🌅 破晓者",
        desc: "晨光初现，你已活力满满！清晨的宁静时光是你最高效的时段。",
        conditions: [
            { questionId: "q2", minScore: 4 }
        ]
    },
    {
        id: "neat-freak",
        name: "🧼 洁净达人",
        desc: "一尘不染是底线，收纳整理是艺术。你的空间永远井井有条！",
        conditions: [
            { questionId: "q3", minScore: 4 }
        ]
    },
    {
        id: "quiet-zone",
        name: "🔇 静音结界",
        desc: "安静是你最大的需求，细微声响也逃不过你的耳朵。专注环境是必需品。",
        conditions: [
            { questionId: "q4", minScore: 4 }
        ]
    },
    {
        id: "stable-energy",
        name: "🔋 能量稳定舱",
        desc: "情绪如平静湖面，精力输出稳定可靠。你是宿舍的定海神针。",
        conditions: [
            { questionId: "q5", minScore: 4 }
        ]
    },
    {
        id: "scroller",
        name: "📱 刷屏战士",
        desc: "指尖滑动间，世界尽在掌握。最新热点和流行趋势你从不缺席。",
        conditions: [
            { questionId: "q6", minScore: 4 }
        ]
    },
    {
        id: "anime-lover",
        name: "🎌 二次元住民",
        desc: "新番老番如数家珍，ACG是精神家园。找到同好就是找到组织！",
        conditions: [
            { questionId: "q7", minScore: 4 }
        ]
    },
    {
        id: "tech-enthusiast",
        name: "🤖 科技尝鲜者",
        desc: "新品发布必关注，参数功能了如指掌。科技前沿是你的游乐场。",
        conditions: [
            { questionId: "q8", minScore: 4 }
        ]
    },
    {
        id: "homebody",
        name: "🏠 宅能量满格",
        desc: "舒适圈就是快乐圈！独处充电，享受安静时光是你的幸福源泉。",
        conditions: [
            { questionId: "q9", minScore: 4 }
        ]
    },
    {
        id: "boundary-keeper",
        name: "🚧 边界感卫士",
        desc: "个人空间神圣不可侵犯，相互尊重是你的相处之道。",
        conditions: [
            { questionId: "q10", minScore: 4 }
        ]
    }
];

// DOM元素
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');
const tagsContainer = document.getElementById('tags-container');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const copyBtn = document.getElementById('copy-btn');

// 初始化页面
function initPage() {
    // 检查URL参数，如果有结果参数则直接显示结果
    const urlParams = new URLSearchParams(window.location.search);
    const resultsParam = urlParams.get('results');
    
    if (resultsParam) {
        try {
            const results = JSON.parse(decodeURIComponent(resultsParam));
            showResults(results);
        } catch (e) {
            console.error('Error parsing results:', e);
            renderQuestions();
        }
    } else {
        renderQuestions();
    }
}

// 渲染题目
function renderQuestions() {
    let html = '';
    
    questions.forEach((question, index) => {
        html += `
            <div class="question" data-id="${question.id}">
                <p>${index + 1}. ${question.text}</p>
                <div class="options">
                    <div class="option">
                        <input type="radio" id="${question.id}-1" name="${question.id}" value="1">
                        <label for="${question.id}-1">非常不符合</label>
                    </div>
                    <div class="option">
                        <input type="radio" id="${question.id}-2" name="${question.id}" value="2">
                        <label for="${question.id}-2">不太符合</label>
                    </div>
                    <div class="option">
                        <input type="radio" id="${question.id}-3" name="${question.id}" value="3">
                        <label for="${question.id}-3">一般</label>
                    </div>
                    <div class="option">
                        <input type="radio" id="${question.id}-4" name="${question.id}" value="4">
                        <label for="${question.id}-4">比较符合</label>
                    </div>
                    <div class="option">
                        <input type="radio" id="${question.id}-5" name="${question.id}" value="5">
                        <label for="${question.id}-5">非常符合</label>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `<button id="submit-btn">生成我的专属标签！</button>`;
    quizContainer.innerHTML = html;
    
    // 重新绑定提交按钮事件
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
}

// 提交问卷
function submitQuiz() {
    const answers = {};
    let allAnswered = true;
    
    // 收集答案
    questions.forEach(question => {
        const selectedOption = document.querySelector(`input[name="${question.id}"]:checked`);
        if (selectedOption) {
            answers[question.id] = parseInt(selectedOption.value);
        } else {
            allAnswered = false;
        }
    });
    
    if (!allAnswered) {
        alert('请回答所有问题后再提交！');
        return;
    }
    
    // 计算并显示结果
    showResults(answers);
    
    // 更新URL，生成可分享链接
    updateUrlWithResults(answers);
}

// 显示结果
function showResults(answers) {
    const userTags = calculateTags(answers);
    
    // 渲染标签
    let tagsHtml = '';
    userTags.forEach(tag => {
        tagsHtml += `
            <div class="tag">
                <span class="tag-icon">${tag.name.split(' ')[0]}</span>
                <div>
                    <span>${tag.name}</span>
                    <span class="tag-desc">${tag.desc}</span>
                </div>
            </div>
        `;
    });
    
    tagsContainer.innerHTML = tagsHtml;
    
    // 显示结果容器，隐藏题目容器
    quizContainer.classList.add('hidden');
    resultContainer.style.display = 'block';
    resultContainer.classList.remove('hidden');
}

// 计算用户标签
function calculateTags(answers) {
    const userTags = [];
    
    // 检查每个标签的条件是否满足
    tags.forEach(tag => {
        let conditionsMet = true;
        
        tag.conditions.forEach(condition => {
            if (answers[condition.questionId] < condition.minScore) {
                conditionsMet = false;
            }
        });
        
        if (conditionsMet) {
            userTags.push(tag);
        }
    });
    
    // 如果没有匹配到标签，使用默认标签
    if (userTags.length === 0) {
        userTags.push({
            name: "🎭 百变生活家",
            desc: "你的生活方式充满多样性，能适应各种环境！"
        });
    }
    
    return userTags;
}

// 更新URL以包含结果参数
function updateUrlWithResults(answers) {
    const resultsString = JSON.stringify(answers);
    const encodedResults = encodeURIComponent(resultsString);
    const newUrl = `${window.location.origin}${window.location.pathname}?results=${encodedResults}`;
    window.history.pushState({}, '', newUrl);
}

// 复制分享链接
function copyToClipboard() {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    alert('链接已复制到剪贴板！分享给你的朋友吧！');
}

// 绑定事件监听器
function bindEvents() {
    copyBtn.addEventListener('click', copyToClipboard);
    
    restartBtn.addEventListener('click', () => {
        // 清除URL参数
        window.history.pushState({}, '', window.location.pathname);
        
        // 重新渲染题目
        resultContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        renderQuestions();
    });
}

// 社交分享功能（简化版）
document.querySelectorAll('.share-icon').forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.classList[1];
        let message = '我刚测了我的宿舍生活家标签，快来试试吧！';
        
        switch(platform) {
            case 'wechat':
                alert('请使用微信扫描屏幕截图分享给朋友');
                break;
            case 'weibo':
                window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(message)}`, '_blank');
                break;
            case 'qq':
                window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('宿舍生活家图谱')}&summary=${encodeURIComponent(message)}`, '_blank');
                break;
        }
    });
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    bindEvents();
});