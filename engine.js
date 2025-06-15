// Copyright (c) 2025 IMDSI. Licensed under the MIT License.

// 常量定义
const QUESTION_VERSION = "2024.06B";
const PAGE_SIZE = 7;
const MAX_WEIGHT = 1.25;

// 题目数据 (简化为8题示例)
const questions = [
    // 睡眠模式 (4题)
    {id: "q1", text: "深夜（23点后）是我思维最活跃的时段", dimension: "sleep", isReverse: true, weight: 1.10},
    {id: "q2", text: "我习惯在7点前自然醒来，不需要闹钟", dimension: "sleep", isReverse: false, weight: 1.10},
    {id: "q3", text: "即使周末，我的入睡和起床时间也和工作日基本一致", dimension: "sleep", isReverse: false, weight: 1.00},
    {id: "q4", text: "如果中午不午睡，下午就会精神不振", dimension: "sleep", isReverse: false, weight: 1.00},
    
    // 整洁标准 (4题)
    {id: "q5", text: "我的书桌必须保持随时整洁才能专注工作", dimension: "cleanliness", isReverse: false, weight: 1.15},
    {id: "q6", text: "看到公共区域（如客厅/洗手台）脏乱会主动打扫", dimension: "cleanliness", isReverse: false, weight: 1.15},
    {id: "q7", text: "使用完公共物品后会立即放回原位", dimension: "cleanliness", isReverse: false, weight: 1.15},
    {id: "q8", text: "我能容忍公共区域有未及时清理的杂物（如快递盒）", dimension: "cleanliness", isReverse: true, weight: 1.15},
    
    // 声音敏感度 (4题)
    {id: "q9", text: "室友在公共区域外放视频（无耳机）不会让我烦躁", dimension: "sound", isReverse: true, weight: 1.25},
    {id: "q10", text: "我需要绝对安静的环境才能集中注意力学习", dimension: "sound", isReverse: false, weight: 1.25},
    {id: "q11", text: "如果室友声音过大，我会直接提醒而非忍耐", dimension: "sound", isReverse: false, weight: 1.25},
    {id: "q12", text: "背景音乐/白噪音能帮助我更好地专注", dimension: "sound", isReverse: true, weight: 1.25},
    
    // 娱乐方式 (5题)
    {id: "q13", text: "刷抖音/小红书是我每天必做的放松方式", dimension: "entertainment", isReverse: true, weight: 1.00},
    {id: "q14", text: "有热门新剧上映时我会熬夜追更", dimension: "entertainment", isReverse: true, weight: 1.00},
    {id: "q15", text: "我每周会花10+小时在游戏（手游/端游）上", dimension: "entertainment", isReverse: true, weight: 1.00},
    {id: "q16", text: "关注ACG（动漫/漫画/游戏）资讯是我放松的重要方式", dimension: "entertainment", isReverse: true, weight: 1.00},
    {id: "q17", text: "我拥有并持续精进专业技能（如编程/设计/摄影等），视其为重要兴趣", dimension: "entertainment", isReverse: false, weight: 1.00},
    
    // 社交偏好 (3题)
    {id: "q18", text: "周末我更愿意待在宿舍而非外出社交", dimension: "social", isReverse: true, weight: 1.00},
    {id: "q19", text: "班级/社团组织的集体活动我总是积极参与", dimension: "social", isReverse: false, weight: 1.00},
    {id: "q20", text: "我倾向于和少数好友深交而非广泛社交", dimension: "social", isReverse: true, weight: 1.00},
    
    // 学习习惯 (3题)
    {id: "q21", text: "宿舍是我最主要的学习场所", dimension: "study", isReverse: true, weight: 1.00},
    {id: "q22", text: "我喜欢和同学一起讨论学习而非独自钻研", dimension: "study", isReverse: false, weight: 1.00},
    {id: "q23", text: "我会严格执行自己制定的学习计划表", dimension: "study", isReverse: false, weight: 1.00},
    
    // 边界意识 (2题)
    {id: "q24", text: "使用室友物品前一定会先征得同意", dimension: "boundary", isReverse: false, weight: 1.10},
    {id: "q25", text: "即使室友设备未锁屏，我也不会擅自查看其屏幕内容", dimension: "boundary", isReverse: false, weight: 1.10},
    
    // 冲突处理 (2题)
    {id: "q26", text: "发现室友行为影响我时，会立即当面沟通", dimension: "conflict", isReverse: false, weight: 1.10},
    {id: "q27", text: "支持每周固定时间讨论宿舍公共事务", dimension: "conflict", isReverse: false, weight: 1.10},
    
    // 未来规划 (2题)
    {id: "q28", text: "我有明确的职业/学业发展三年规划", dimension: "planning", isReverse: false, weight: 1.00},
    {id: "q29", text: "我会优先完成学习任务再安排娱乐活动", dimension: "planning", isReverse: false, weight: 1.00}
];

// 计算维度分数
function calculateDimensionScore(answers, dimension) {
    const dimQuestions = questions.filter(q => q.dimension === dimension);
    let total = 0, maxPossible = 0;
    
    dimQuestions.forEach(q => {
        if (typeof answers[q.id] === 'undefined') return;
        
        let score = parseInt(answers[q.id]);
        // 统一计分逻辑：isReverse=true时反转分数
        if (q.isReverse) score = 6 - score;
        
        const weightedScore = score * (q.weight / MAX_WEIGHT);
        total += weightedScore;
        maxPossible += 5 * (q.weight / MAX_WEIGHT);
    });
    
    return maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 50;
}

// 核心维度计算
function calculateCoreScores(scores) {
    return {
        lifestyle: Math.round((scores.sleep + scores.cleanliness + scores.sound) / 3),
        interest: Math.round((scores.entertainment + scores.social + scores.study) / 3),
        values: Math.round((scores.boundary + scores.conflict + scores.planning) / 3)
    };
}

// 中标签计算
function getCoreTags(coreScores) {
    return {
        lifestyle: coreScores.lifestyle > 70 ? "破晓引领者" : 
                  coreScores.lifestyle < 40 ? "星夜追梦人" : "晨暮均衡者",
        
        interest: coreScores.interest > 70 ? "专注深耕者" : 
                  coreScores.interest < 40 ? "多元体验家" : "平衡探索者",
        
        values: coreScores.values > 70 ? "秩序规划师" : 
                coreScores.values < 40 ? "灵动适应者" : "和谐共建者"
    };
}

// 诗意大标签矩阵
const mainTagMatrix = {
    // 破晓引领者系列
    "破晓引领者-专注深耕者-秩序规划师": {
        name: "晨曦筑梦师",
        icon: "🌅",
        desc: "在晨光中构筑梦想的殿堂",
        color: "#4361ee"
    },
    "破晓引领者-专注深耕者-和谐共建者": {
        name: "晨光规划家",
        icon: "📐",
        desc: "为每个清晨赋予明确方向",
        color: "#3a0ca3"
    },
    "破晓引领者-专注深耕者-灵动适应者": {
        name: "朝霞探索者",
        icon: "🔍",
        desc: "在晨光中追寻未知可能",
        color: "#7209b7"
    },
    
    // 星夜追梦人系列
    "星夜追梦人-多元体验家-灵动适应者": {
        name: "暮色幻想家",
        icon: "🌌",
        desc: "夜色中的灵感捕手",
        color: "#560bad"
    },
    "星夜追梦人-多元体验家-和谐共建者": {
        name: "月夜漫游者",
        icon: "🚶‍♂️",
        desc: "在星光下编织社交网络",
        color: "#480ca8"
    },
    "星夜追梦人-多元体验家-秩序规划师": {
        name: "星河架构师",
        icon: "✨",
        desc: "用星光绘制人生蓝图",
        color: "#3f37c9"
    },
    
    // 晨暮均衡者系列
    "晨暮均衡者-平衡探索者-和谐共建者": {
        name: "时光调和者",
        icon: "⏳",
        desc: "昼夜平衡的和谐使者",
        color: "#4895ef"
    },
    "晨暮均衡者-平衡探索者-秩序规划师": {
        name: "均衡规划师",
        icon: "⚖️",
        desc: "在平衡中寻找秩序之美",
        color: "#4cc9f0"
    },
    "晨暮均衡者-平衡探索者-灵动适应者": {
        name: "自由调停官",
        icon: "🕊️",
        desc: "灵活适应每一刻变化",
        color: "#4361ee"
    },
    
    // 默认组合
    "default": {
        name: "多维融合者",
        icon: "🌈",
        desc: "融合多重特质的独特存在",
        color: "#f72585"
    }
};

// 生成报告
function generateReport(answers) {
    // 计算所有维度分数
    const scores = {
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
    
    // 计算核心维度分数
    const coreScores = calculateCoreScores(scores);
    
    // 获取中标签
    const coreTags = getCoreTags(coreScores);
    
    // 获取大标签
    const tagKey = `${coreTags.lifestyle}-${coreTags.interest}-${coreTags.values}`;
    const mainTag = mainTagMatrix[tagKey] || mainTagMatrix['default'];
    
    return {
        scores,
        coreScores,
        coreTags,
        mainTag
    };
}
