// Copyright (c) 2025 IMDSI. Licensed under the MIT License.
// ===== 浏览器兼容性检查 =====
// 检查 localStorage 支持
if (typeof localStorage === 'undefined') {
    console.warn("浏览器不支持localStorage，将无法保存进度");
}

const navigationButtons = document.querySelector('.navigation-buttons');

// DOM元素
const quizContainer = document.getElementById('quiz-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressFill = document.getElementById('progress-fill');
const pageCounter = document.getElementById('page-counter');

let currentPage = 1;
let totalPages = Math.ceil(questions.length / PAGE_SIZE);
let answers = loadProgress();

// 初始化页面
function initPage() {
    // 检查重置参数
    const urlParams = new URLSearchParams(window.location.search);
    const reset = urlParams.get('reset');
    
    if (reset) {
        // 清除本地存储
        localStorage.removeItem('quizProgress');
        
        // 重置状态
        currentPage = 1;
        answers = {};
    } else {
        // 正常加载进度
        answers = loadProgress();
    }
    
    renderPage(currentPage);
    updateProgress();
    
    // 绑定事件
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
}

// 渲染当前页题目
function renderPage(page) {
    const startIdx = (page - 1) * PAGE_SIZE;
    const endIdx = Math.min(startIdx + PAGE_SIZE, questions.length);
    const pageQuestions = questions.slice(startIdx, endIdx);
    
    let html = '';
    
    pageQuestions.forEach((question, idx) => {
        const globalIdx = startIdx + idx;

        // 检查重置状态
        const urlParams = new URLSearchParams(window.location.search);
        const reset = urlParams.get('reset');
        
        html += `
            <div class="question" data-id="${question.id}">
                <p>${globalIdx + 1}. ${question.text}</p>
                <div class="options">
                    ${[1, 2, 3, 4, 5].map(opt => `
                        <div class="option">
                            <input type="radio" id="${question.id}-${opt}" 
                                   name="${question.id}" value="${opt}"
                                   ${answers[question.id] === opt ? 'checked' : ''}>
                            <label for="${question.id}-${opt}">
                                <span>${getOptionText(opt)}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="slider-labels">
                    <span>非常不同意</span>
                    <span>非常同意</span>
                </div>
            </div>
        `;
    });
    
    quizContainer.innerHTML = html;
    
    // 更新导航按钮
    prevBtn.classList.toggle('hidden', page === 1);
    prevBtn.classList.toggle('invisible', page === 1);
    nextBtn.textContent = page === totalPages ? '提交答案' : '下一页';

    // 调整按钮位置：第一页时"下一页"按钮靠右，其他页时"上一页"在左、"下一页"在右
    if (page === 1) {
        navigationButtons.style.justifyContent = 'flex-end';
    } else {
        navigationButtons.style.justifyContent = 'space-between';
    }
}

// 更新进度
function updateProgress() {
    const progress = (currentPage / totalPages) * 100;
    progressFill.style.width = `${progress}%`;
    pageCounter.textContent = `第 ${currentPage}/${totalPages} 部分`;
}

// 保存进度
function saveProgress() {
    const progress = {
        answers,
        currentPage,
        timestamp: Date.now(),
        version: QUESTION_VERSION
    };
    localStorage.setItem('quizProgress', JSON.stringify(progress));
}

// 加载进度
function loadProgress() {
    const saved = JSON.parse(localStorage.getItem('quizProgress') || '{}');
    
    // 检查版本和有效期（7天）
    if (saved.version === QUESTION_VERSION && 
        Date.now() - saved.timestamp < 604800000) {
        currentPage = saved.currentPage || 1;
        return saved.answers || {};
    }
    
    // 清除过期数据
    localStorage.removeItem('quizProgress');
    return {};
}

// 收集当前页答案
function collectAnswers() {
    const pageQuestions = questions.slice(
        (currentPage - 1) * PAGE_SIZE, 
        currentPage * PAGE_SIZE
    );
    
    pageQuestions.forEach(question => {
        const selected = document.querySelector(`input[name="${question.id}"]:checked`);
        if (selected) {
            answers[question.id] = parseInt(selected.value);
        }
    });
}

// 导航到上一页
function goToPrevPage() {
    if (currentPage > 1) {
        collectAnswers();
        currentPage--;
        renderPage(currentPage);
        updateProgress();
        saveProgress();
    }
}

// 导航到下一页
function goToNextPage() {
    collectAnswers();
    
    // 检查当前页是否完成
    if (!isPageComplete()) {
        alert('请完成本页所有问题后再继续');
        return;
    }
    
    saveProgress();
    
    if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        updateProgress();
    } else {
        submitQuiz();
    }
}

// 检查当前页是否完成
function isPageComplete() {
    const pageQuestions = questions.slice(
        (currentPage - 1) * PAGE_SIZE, 
        currentPage * PAGE_SIZE
    );
    
    return pageQuestions.every(q => answers[q.id] !== undefined);
}

// 提交问卷
function submitQuiz() {
    // 收集当前页答案
    collectAnswers();
    
    // 检查所有题目是否完成
    let allAnswered = true;
    const unansweredQuestions = [];
    
    questions.forEach(question => {
        if (typeof answers[question.id] === 'undefined') {
            allAnswered = false;
            unansweredQuestions.push(question.id);
        }
    });
    
    if (!allAnswered) {
        // 找出未答题所在的页码
        const unansweredPages = new Set();
        unansweredQuestions.forEach(qId => {
            const questionIndex = questions.findIndex(q => q.id === qId);
            if (questionIndex >= 0) {
                const pageNum = Math.floor(questionIndex / PAGE_SIZE) + 1;
                unansweredPages.add(pageNum);
            }
        });
        
        alert(`请完成所有问题后再提交！\n未完成的问题在第 ${Array.from(unansweredPages).join(', ')} 页`);
        return;
    }
    
    // 计算所有维度分数
    const calculatedScores = {
        sleep: calculateDimensionScore(answers, 'sleep'),
        cleanliness: calculateDimensionScore(answers, 'cleanliness'),
        sound: calculateDimensionScore(answers, 'sound'),
        entertainment: calculateDimensionScore(answers, 'entertainment'),
        social: calculateDimensionScore(answers, 'social'),
        study: calculateDimensionScore(answers, 'study'),
        boundary: calculateDimensionScore(answers, 'boundary'),
        conflict: calculateDimensionScore(answers, 'conflict'),
        planning: calculateDimensionScore(answers, 'planning')
    };
    
    // 跳转到结果页
    const params = new URLSearchParams();
    Object.entries(calculatedScores).forEach(([dim, score]) => {
        params.append(dim, score);
    });
    
    window.location.href = `results.html?${params.toString()}`;
}

// 选项文本
function getOptionText(opt) {
    const texts = [
        '非常不符合',
        '不太符合',
        '一般',
        '比较符合',
        '非常符合'
    ];
    return texts[opt - 1];
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);
