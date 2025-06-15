// Copyright (c) 2025 IMDSI. Licensed under the MIT License.
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
        // 使用GitHub Pages地址
        const shareUrl = 'https://imdsi.github.io/test/';
        
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                alert('测试链接已复制！邀请朋友一起探索吧~');
            })
            .catch(err => {
                console.error('复制失败:', err);
                // 备选复制方案
                const tempInput = document.createElement('textarea');
                tempInput.value = shareUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('链接已复制！分享给朋友吧！');
            });
    });

    // ===== 添加分享描述文本修改 =====
    const shareText = document.querySelector('.share-section p');
    if (shareText) {
        shareText.textContent = '分享测试给朋友，一起探索宿舍人格！';
    }
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
    
    // 计算核心维度分数
    const coreScores = {
        lifestyle: Math.round((scores.sleep + scores.cleanliness + scores.sound) / 3),
        interest: Math.round((scores.entertainment + scores.social + scores.study) / 3),
        values: Math.round((scores.boundary + scores.conflict + scores.planning) / 3)
    };
    
    // 获取中标签
    const coreTags = {
        lifestyle: coreScores.lifestyle > 70 ? "破晓引领者" : 
                  coreScores.lifestyle < 40 ? "星夜追梦人" : "晨暮均衡者",
        interest: coreScores.interest > 70 ? "专注深耕者" : 
                  coreScores.interest < 40 ? "多元体验家" : "平衡探索者",
        values: coreScores.values > 70 ? "秩序规划师" : 
                coreScores.values < 40 ? "灵动适应者" : "和谐共建者"
    };
    
    // 获取大标签
    const tagKey = `${coreTags.lifestyle}-${coreTags.interest}-${coreTags.values}`;
    const mainTag = mainTagMatrix[tagKey] || mainTagMatrix['default'];
    
    // 渲染报告
    resultReport.innerHTML = `
        <div class="main-tag" style="background: linear-gradient(135deg, ${mainTag.color} 0%, #f8f9fa 100%);">
            <div class="tag-icon">${mainTag.icon}</div>
            <h1>${mainTag.name}</h1>
            <p class="tag-desc">${mainTag.desc}</p>
        </div>
        
        <div class="core-dimensions">
            <div class="dimension-card">
                <h2>生活习惯</h2>
                <div class="dimension-score">${coreScores.lifestyle}分</div>
                <div class="dimension-tag">${coreTags.lifestyle}</div>
                <div class="sub-dimensions">
                    <p>作息模式: ${scores.sleep}分</p>
                    <p>整洁需求: ${scores.cleanliness}分</p>
                    <p>声音敏感: ${scores.sound}分</p>
                </div>
            </div>
            
            <div class="dimension-card">
                <h2>兴趣爱好</h2>
                <div class="dimension-score">${coreScores.interest}分</div>
                <div class="dimension-tag">${coreTags.interest}</div>
                <div class="sub-dimensions">
                    <p>娱乐方式: ${scores.entertainment}分</p>
                    <p>社交倾向: ${scores.social}分</p>
                    <p>学习特点: ${scores.study}分</p>
                </div>
            </div>
            
            <div class="dimension-card">
                <h2>价值观</h2>
                <div class="dimension-score">${coreScores.values}分</div>
                <div class="dimension-tag">${coreTags.values}</div>
                <div class="sub-dimensions">
                    <p>边界意识: ${scores.boundary}分</p>
                    <p>冲突处理: ${scores.conflict}分</p>
                    <p>未来规划: ${scores.planning}分</p>
                </div>
            </div>
        </div>
        
        <div class="personal-advice">
            <h3>专属建议</h3>
            <p>基于您的三维度分析，为您提供以下宿舍生活建议：</p>
            <ul>
                <li>保持规律的作息时间，与室友协商安静时段</li>
                <li>在公共区域使用耳机，尊重他人空间</li>
                <li>每周安排固定时间与室友交流，增进理解</li>
                <li>创建个人学习空间，提高专注度</li>
            </ul>
        </div>
    `;
    
    // 渲染匹配推荐
    matchTags.innerHTML = `
        <span class="match-tag">晨光规划家</span>
        <span class="match-tag">时光调和者</span>
        <span class="match-tag">星河架构师</span>
    `;
}
