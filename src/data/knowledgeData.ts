export interface KnowledgeNode {
  id: string;
  title: string;
  description?: string;
  children: KnowledgeNode[];
  isLeaf?: boolean;
  content?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  category: string;
  content: string;
  uploadDate: string;
}

// Sample knowledge categories
export const knowledgeCategories = [
  { id: 'tech', name: '技术', icon: '💻', color: '#6366F1' },
  { id: 'ai', name: 'AI/Agent', icon: '🤖', color: '#10B981' },
  { id: 'web', name: 'Web 开发', icon: '🌐', color: '#3B82F6' },
  { id: 'backend', name: '后端开发', icon: '⚙️', color: '#F59E0B' },
  { id: 'devops', name: 'DevOps', icon: '🔧', color: '#EF4444' },
  { id: 'other', name: '其他', icon: '📌', color: '#9CA3AF' }
];

// Sample knowledge tree
export const knowledgeTree: KnowledgeNode[] = [
  {
    id: 'tech-root',
    title: '技术基础',
    description: '编程语言与基础技术',
    children: [
      {
        id: 'python',
        title: 'Python',
        description: 'Python 编程知识',
        children: [
          {
            id: 'python-basics',
            title: '基础语法',
            description: 'Python 基础语法知识点',
            children: [],
            isLeaf: true,
            content: '## Python 基础语法\n\n### 变量类型\nPython 是动态类型语言...\n\n### 数据结构\n- 列表\n- 字典\n- 元组\n- 集合'
          },
          {
            id: 'python-advanced',
            title: '高级特性',
            description: '装饰器、生成器、异步编程',
            children: [],
            isLeaf: true,
            content: '## Python 高级特性\n\n### 装饰器\n装饰器是 Python 的重要特性...\n\n### 生成器\n生成器用于创建迭代器...'
          }
        ]
      },
      {
        id: 'typescript',
        title: 'TypeScript',
        description: 'JavaScript 的超集',
        children: [
          {
            id: 'ts-types',
            title: '类型系统',
            description: 'TypeScript 类型系统介绍',
            children: [],
            isLeaf: true,
            content: '## TypeScript 类型系统\n\n### 基础类型\n- string\n- number\n- boolean\n- array\n\n### 高级类型\n- 泛型\n- 联合类型\n- 交叉类型'
          }
        ]
      }
    ]
  },
  {
    id: 'ai-root',
    title: 'AI/Agent',
    description: '人工智能与智能代理',
    children: [
      {
        id: 'llm',
        title: '大语言模型',
        description: 'LLM 基础知识',
        children: [
          {
            id: 'llm-basics',
            title: '基础概念',
            description: '什么是大语言模型',
            children: [],
            isLeaf: true,
            content: '## 大语言模型基础\n\n### 定义\n大语言模型是基于深度学习的自然语言处理模型...\n\n### 主流模型\n- GPT 系列\n- Claude 系列\n- Llama 系列'
          }
        ]
      },
      {
        id: 'agent',
        title: 'AI Agent',
        description: '智能代理开发',
        children: [
          {
            id: 'agent-design',
            title: 'Agent 设计',
            description: '如何设计 AI Agent',
            children: [],
            isLeaf: true,
            content: '## AI Agent 设计\n\n### 核心组件\n- Prompt Engineering\n- Tool Use\n- Memory\n- Planning\n\n### 设计模式\n- ReAct\n- Plan-and-Execute'
          }
        ]
      }
    ]
  }
];

// Sample uploaded documents
export const uploadedDocuments: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Python 最佳实践',
    category: 'tech',
    content: '# Python 最佳实践\n\n## 代码风格\n遵循 PEP 8 规范...\n\n## 命名规范\n- 变量：snake_case\n- 类：PascalCase',
    uploadDate: '2026-06-20'
  },
  {
    id: 'doc-2',
    name: 'React Hooks 指南',
    category: 'web',
    content: '# React Hooks 指南\n\n## useState\n用于管理组件状态...\n\n## useEffect\n用于处理副作用...',
    uploadDate: '2026-06-19'
  }
];
