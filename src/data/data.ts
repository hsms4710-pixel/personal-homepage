export interface Project {
  id: string;
  title: string;
  type: 'internship' | 'personal';
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  github?: string;
  demo?: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readTime: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  achievements: string[];
}

export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'GDD V6.0 架构重构',
    type: 'internship',
    description: 'Graph-Driven Development 插件架构重构，优化5层节点设计',
    longDescription: '负责 GDD (Graph-Driven Development) V6.0 架构重构，采用双轨架构设计（Agent插件+独立Web UI），包含L1 Constitution至L5 Task的5层架构设计。实现了MCP协议集成、SmartMate 5层节点架构优化、事件驱动双向同步及Zustand状态管理。',
    technologies: ['React', 'TypeScript', 'MCP', 'Zustand', 'FastAPI'],
    image: '/projects/gdd.jpg',
    github: 'https://github.com/your-repo/gdd',
    date: '2026'
  },
  {
    id: 'project-2',
    title: '云产品健康检查 Agent',
    type: 'internship',
    description: '构建300-400检查项的自动化健康检查系统',
    longDescription: '开发云产品健康检查 Agent，采用1+N+1架构，包含风险挖掘与根因分析功能。系统支持300-400个检查项，实现了自动化健康检查、风险预警和根因分析能力。',
    technologies: ['Python', 'LangGraph', 'FastAPI', 'MySQL', 'Docker'],
    image: '/projects/health-check.jpg',
    github: 'https://github.com/your-repo/health-agent',
    date: '2026'
  },
  {
    id: 'project-3',
    title: 'Harness Skills v3.7.4',
    type: 'personal',
    description: '为 Coding Agents 构建的工程化规范系统',
    longDescription: '开发 Harness Skills v3.7.4，为 Claude Code、Codex、CodeBuddy、TRAE 等 Coding Agents 提供工程化规范。支持 Python/Go/TypeScript 多语言，实现了项目感知、自动化规范和质量验证功能。',
    technologies: ['TypeScript', 'Python', 'Shell', 'Markdown'],
    image: '/projects/harness.jpg',
    github: 'https://github.com/hsms4710-pixel/your-harness',
    date: '2026'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Graph-Driven Development：重新定义 AI 辅助开发',
    excerpt: '探讨 GDD 如何通过图谱驱动的架构设计，提升 Coding Agent 的开发效率...',
    content: '# Graph-Driven Development：重新定义 AI 辅助开发\n\n文章内容...',
    date: '2026-06-15',
    tags: ['GDD', 'AI', 'Architecture'],
    readTime: '8 min'
  },
  {
    id: 'blog-2',
    title: '从零构建 MCP Server：实战经验分享',
    excerpt: '详细介绍如何设计并实现一个生产级的 Model Context Protocol 服务器...',
    content: '# 从零构建 MCP Server\n\n文章内容...',
    date: '2026-06-01',
    tags: ['MCP', 'TypeScript', 'Backend'],
    readTime: '12 min'
  }
];

export const workExperiences: WorkExperience[] = [
  {
    company: '腾讯 CSIG',
    position: '软件工程师（实习）',
    duration: '2026 - 至今',
    description: '参与云产品智能运维和 AI Agent 开发，负责 GDD 架构设计和实施。',
    achievements: [
      '完成 GDD V6.0 架构重构，支持多平台 Coding Agent',
      '开发云产品健康检查 Agent，覆盖300+检查项',
      '实现 Harness Skills v3.7.4，提升团队开发规范'
    ]
  }
];

export const personalInfo = {
  name: '江启元',
  title: 'Agent 工程师 | 全栈开发者',
  email: 'your-email@tencent.com',
  github: 'https://github.com/hsms4710-pixel',
  linkedin: 'https://linkedin.com/in/your-profile',
  bio: '专注于构建面向 Coding Agents 的工程化工具和智能系统，热衷于探索 AI 与软件工程的交叉领域。'
};
