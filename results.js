// DOM元素
const resultReport = document.getElementById('result-report');
const matchTags = document.getElementById('match-tags');
const restartBtn = document.getElementById('restart-btn');
const copyBtn = document.getElementById('copy-btn');

// 页面加载完成后初始化
// results.js
document.addEventListener('DOMContentLoaded', () => {
    renderReport();
    
    // 获取重新测试按钮
    const restartBtn = document.getElementById('restart-btn');
    
    // 获取复制按钮
    const copyBtn = document.getElementById('copy-btn');
    
    // 添加重新测试事件（包含二次确认）
    restartBtn.addEventListener('click', () => {
        if (confirm('确定要重新开始测试吗？当前结果将被清除。')) {
            localStorage.removeItem('quizProgress');
            window.location.href = 'index.html?reset=true';
        }
    });
    
    // 复制按钮事件
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert('链接已复制！分享给朋友一起测试吧~');
    });
});

// 渲染结果报告
function renderReport() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 如果没有参数，重定向到测试页
    if (urlParams.toString() === '') {
        window.location.href = 'index.html';
        return;
    }
    
    // 从URL参数获取维度分数
    const scores = {
        sleep: parseInt(urlParams.get('sleep')) || 50,
        cleanliness: parseInt(urlParams.get('cleanliness')) || 50,
        sound: parseInt(urlParams.get('sound')) || 50,
        entertainment: parseInt(urlParams.get('entertainment')) || 50,
        social: parseInt(urlParams.get('social')) || 50,
        study: parseInt(urlParams.get('study')) || 50,
        boundary: parseInt(urlParams.get('boundary')) || 50,
        conflict: parseInt(urlParams.get('conflict')) || 50,
        planning: parseInt(urlParams.get('planning')) || 50
    };

    
    // 生成标签
    const tags = {};
    Object.keys(scores).forEach(dim => {
        tags[dim] = dimensionTags[dim](scores[dim]);
    });
    
    // 确定大类型
    const personalityType = determinePersonalityType(tags);
    const personality = getPersonalityDetails(personalityType);
    
    // 渲染报告
    resultReport.innerHTML = `
        <div class="badge-animation">
            <h1>你的宿舍人格是</h1>
            <div class="main-badge">${personality.name}</div>
            <p>${personality.desc}</p>
        </div>
        
        <div class="tag-section">
            <h2>你的专属标签</h2>
            <div class="tag-row">
                ${personality.tags.map(tag => `
                    <div class="tag">
                        <span class="tag-icon">${tag.split(' ')[0]}</span>
                        <span>${tag}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="tag-section">
            <h2>详细维度分析</h2>
            <p><strong>作息模式:</strong> ${tags.sleep}</p>
            <p><strong>整洁要求:</strong> ${tags.cleanliness}</p>
            <p><strong>声音敏感度:</strong> ${tags.sound}</p>
            <p><strong>娱乐偏好:</strong> ${tags.entertainment}</p>
            <p><strong>社交能量:</strong> ${tags.social}</p>
            <p><strong>学习习惯:</strong> ${tags.study}</p>
            <p><strong>边界意识:</strong> ${tags.boundary}</p>
            <p><strong>冲突处理:</strong> ${tags.conflict}</p>
            <p><strong>未来规划:</strong> ${tags.planning}</p>
        </div>
    `;
    
    // 渲染匹配推荐
    matchTags.innerHTML = personality.matches.map(tag => `
        <span class="match-tag">${tag}</span>
    `).join('');
}