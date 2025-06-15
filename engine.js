// Copyright (c) 2025 IMDSI. Licensed under the MIT License.
// 题库版本
const QUESTION_VERSION = "2024.06A";
// 分页设置
const PAGE_SIZE = 7; // 每页题目数
// 维度权重最大值
const MAX_WEIGHT = 1.25;

// 题目数据 (简化为8题示例)
const questions = [
    // 睡眠模式 (4题)
    {id: "q1", text: "深夜（23点后）是我思维最活跃的时段", dimension: "sleep", isReverse: false, weight: 1.10},
    {id: "q2", text: "我习惯在7点前自然醒来，不需要闹钟", dimension: "sleep", isReverse: false, weight: 1.10},
    {id: "q3", text: "即使周末，我的入睡和起床时间也和工作日基本一致", dimension: "sleep", isReverse: true, weight: 1.00},
    {id: "q4", text: "如果中午不午睡，下午就会精神不振", dimension: "sleep", isReverse: true, weight: 1.00},
    
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
    {id: "q20", text: "我倾向于和少数好友深交而非广泛社交", dimension: "social", isReverse: false, weight: 1.00},
    
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

// 维度标签映射
const dimensionTags = {
    sleep: score => score > 75 ? "🌙 深度夜猫型" : score > 50 ? "🌗 混合作息型" : "🌅 晨鸟型",
    cleanliness: score => score > 80 ? "🧼 极致整洁控" : score > 50 ? "🧹 适度整洁型" : "🎒 随性收纳派",
    sound: score => {
        if (score > 90) return "🔇 高敏感型";
        if (score > 70) return "🔊 中度敏感型";
        if (score > 40) return "🔉 适度敏感型";
        return "🎧 包容型";
    },
    entertainment: score => score > 70 ? "📚 深度学习者" : score > 40 ? "🎮 娱乐平衡者" : "📱 刷屏战士",
    social: score => score < 30 ? "🎉 社交达人" : score < 60 ? "👥 选择社交者" : "🏠 宅能量满格",
    study: score => score > 75 ? "📖 自律学习家" : score > 50 ? "✏️ 规律学习者" : "🌱 随性学习派",
    boundary: score => score > 80 ? "📐 边界守护者" : score > 50 ? "⚖️ 边界平衡者" : "🤝 无界融合派",
    conflict: score => score > 80 ? "⚔️ 主动沟通者" : score > 50 ? "🕊️ 和谐维护者" : "🌫️ 回避冲突型",
    planning: score => score > 80 ? "🎯 目标导向型" : score > 50 ? "📝 计划执行者" : "🍃 随遇而安型"
};

// 大类型人格映射
const personalityTypes = {
    // 大类型ID: [包含的维度标签组合, 描述, 匹配推荐]
    "night-scholar": [
        ["🌙 深度夜猫型", "🔇 高敏感型", "📖 自律学习家"],
        "夜间高效工作者，需要安静环境专注研究/学习",
        ["🌅 晨光社交家", "🕊️ 和谐维护者"]
    ],
    "morning-socializer": [
        ["🌅 晨鸟型", "🎉 社交达人", "⚖️ 边界平衡者"],
        "清晨活力满满，喜欢组织活动，善于协调关系",
        ["🌙 深度夜猫型", "🎮 娱乐平衡者"]
    ],
    "creative-free": [
        ["🌗 混合作息型", "🎮 娱乐平衡者", "🤝 无界融合派"],
        "灵感迸发的创造者，灵活适应各种环境",
        ["🎯 目标导向型", "🎧 包容型"]
    ],
    "self-disciplined": [
        ["🌅 晨鸟型", "📖 自律学习家", "🎯 目标导向型"],
        "严格作息，高效学习，未来规划清晰",
        ["🧼 极致整洁控", "📝 计划执行者"]
    ],
    "harmonious": [
        ["🎧 包容型", "🌱 随性学习派", "🕊️ 和谐维护者"],
        "适应性极强，善于化解矛盾，氛围调节者",
        ["🎉 社交达人", "🍃 随遇而安型"]
    ],
    "neat-manager": [
        ["🧼 极致整洁控", "⚔️ 主动沟通者", "🎯 目标导向型"],
        "空间秩序维护者，善于制定规则并沟通",
        ["🧹 适度整洁型", "📐 边界守护者"]
    ],
    "art-dreamer": [
        ["📱 刷屏战士", "🍃 随遇而安型", "🌫️ 回避冲突型"],
        "沉浸艺术世界，避免冲突，随性生活",
        ["🎮 娱乐平衡者", "🤝 无界融合派"]
    ],
    "adventurer": [
        ["🌗 混合作息型", "🎮 娱乐平衡者", "🎯 目标导向型"],
        "打破常规，热衷新体验，不拘小节",
        ["🎉 社交达人", "🌱 随性学习派"]
    ],

    "extreme-sensitive": [
        ["🔇 高敏感型", "🧼 极致整洁控", "📐 边界守护者"],
        "您对环境要求极高，需要完全掌控个人空间",
        ["🎧 包容型", "🤝 无界融合派"]
    ],
    
    "night-owl-extreme": [
        ["🌙 深度夜猫型", "📱 刷屏战士", "🌫️ 回避冲突型"],
        "夜间活动者，数字世界居民，避免现实冲突",
        ["🌅 晨光行动派", "🕊️ 和谐维护者"]
    ],
    
    "self-disciplined-extreme": [
        ["🌅 晨鸟型", "📖 自律学习家", "🎯 目标导向型"],
        "严格自律的生活规划师，目标明确，执行力强",
        ["🍃 随遇而安型", "🎮 娱乐平衡者"]
    ],

    "balanced": [
        ["⚖️ 平衡大师"],
        "你的生活方式充满多样性，能适应各种环境！",
        ["所有类型"]
    ]
};

// 计算维度分数
function calculateDimensionScore(answers, dimension) {
    const dimQuestions = questions.filter(q => q.dimension === dimension);
    let totalScore = 0;
    let maxPossible = 0;
    
    dimQuestions.forEach(q => {
        if (typeof answers[q.id] === 'undefined') return;
        
        const baseScore = parseInt(answers[q.id]);
        const effectiveScore = q.isReverse ? (6 - baseScore) : baseScore;
        
        const normalizedWeight = q.weight / MAX_WEIGHT;
        const weightedScore = effectiveScore * normalizedWeight;
        
        totalScore += weightedScore;
        maxPossible += 5 * normalizedWeight;

        // 添加调试日志
        console.log(
            `题目 ${q.id}: ${q.text}\n` +
            `  原始答案: ${baseScore}, ` +
            `方向: ${q.isReverse ? '反向' : '正向'}, ` +
            `有效分数: ${effectiveScore}, ` +
            `权重: ${q.weight} (标准化: ${normalizedWeight.toFixed(2)}), ` +
            `加权分数: ${weightedScore.toFixed(2)}`
        );
    });
    // 标准化到0-100
    return maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 50;
}

// 生成完整报告
function generateReport(answers) {
    const scores = {};
    const tags = {};
    
    // 计算各维度分数 - 添加所有9个维度
    const dimensions = [
        'sleep', 'cleanliness', 'sound', 
        'entertainment', 'social', 'study',
        'boundary', 'conflict', 'planning'
    ];
    
    dimensions.forEach(dim => {
        scores[dim] = calculateDimensionScore(answers, dim);
        tags[dim] = dimensionTags[dim](scores[dim]);
    });
    
    // 确定大类型人格
    const personalityType = determinePersonalityType(tags);
    const personality = getPersonalityDetails(personalityType);
    
    return {
        scores,
        tags,
        personality
    };
}

function determinePersonalityType(tags) {
    // 根据标签组合确定大类型
    const tagSet = new Set(Object.values(tags));
    
    if (tagSet.has("🌙 深度夜猫型") && tagSet.has("🔇 高敏感型")) {
        return "night-scholar";
    }
    if (tagSet.has("🌅 晨鸟型") && tagSet.has("🎉 社交达人")) {
        return "morning-socializer";
    }
    if (tagSet.has("🌗 混合作息型") && tagSet.has("🎮 娱乐平衡者")) {
        return "creative-free";
    }
    if (tagSet.has("📖 自律学习家") && tagSet.has("🎯 目标导向型")) {
        return "self-disciplined";
    }
    if (tagSet.has("🎧 包容型") && tagSet.has("🕊️ 和谐维护者")) {
        return "harmonious";
    }
    if (tagSet.has("🧼 极致整洁控") && tagSet.has("⚔️ 主动沟通者")) {
        return "neat-manager";
    }
    if (tagSet.has("📱 刷屏战士") && tagSet.has("🌫️ 回避冲突型")) {
        return "art-dreamer";
    }
    if (tagSet.has("🎮 娱乐平衡者") && tagSet.has("🎯 目标导向型")) {
        return "adventurer";
    }
    if (tagSet.has("🔇 高敏感型") && 
        tagSet.has("🧼 极致整洁控") && 
        tagSet.has("📐 边界守护者")) {
        return "extreme-sensitive";
    }
    if (tagSet.has("🌙 深度夜猫型") && 
        tagSet.has("📱 刷屏战士") && 
        tagSet.has("🌫️ 回避冲突型")) {
        return "night-owl-extreme";
    }
    if (tagSet.has("🌅 晨鸟型") && 
        tagSet.has("📖 自律学习家") && 
        tagSet.has("🎯 目标导向型")) {
        return "self-disciplined-extreme";
    }
    // 默认返回平衡型
    return "balanced";
}

// 获取大类型详情
function getPersonalityDetails(typeId) {
    // 如果未定义类型，使用默认值
    const baseDetails = personalityTypes[typeId] || [
        ["🌗 混合作息型", "⚖️ 平衡协调者"],
        "你的生活方式充满多样性，能适应各种环境！",
        ["所有类型"]
    ];
    
    // 为特定类型设置自定义名称
    let displayName;
    switch(typeId) {
        case "extreme-sensitive":
            displayName = "🚨 极致敏感型";
            break;
        case "night-owl-extreme":
            displayName = "🌌 深度夜猫型";
            break;
        case "self-disciplined-extreme":
            displayName = "⏱️ 极度自律型";
            break;
        case "night-scholar":
            displayName = "🌙 静谧学者";
            break;
        case "morning-socializer":
            displayName = "🌅 晨光社交家";
            break;
        case "creative-free":
            displayName = "🎮 创意自由人";
            break;
        case "self-disciplined":
            displayName = "📚 自律规划师";
            break;
        case "harmonious":
            displayName = "🎧 包容调和者";
            break;
        case "neat-manager":
            displayName = "🧹 整洁管理者";
            break;
        case "art-dreamer":
            displayName = "🎨 艺术梦想家";
            break;
        case "adventurer":
            displayName = "🚀 挑战开拓者";
            break;
        case "balanced":
            displayName = "⚖️ 平衡大师";
            break;
        default:
            displayName = baseDetails[0].join(" + ");
    }
    
    return {
        name: displayName,
        tags: baseDetails[0],
        desc: baseDetails[1],
        matches: baseDetails[2]
    };
}
