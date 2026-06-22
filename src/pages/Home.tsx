import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, X } from 'lucide-react';

interface RadialItem {
  id: string;
  name: string;
  angle: number; // 角度，0°=右侧，90°=底部，180°=左侧，-90°=顶部
}

// 对角分布（GTA5轮盘风格）
// 0° = 右侧，逆时针为负
// 注意：屏幕上y轴向下为正，所以角度计算时已取反
// 目标位置：左上、右上、右下、左下
const radialItems: RadialItem[] = [
  { id: 'knowledge', name: '知识库', angle: 135 },      // 左上（x负，y负）
  { id: 'projects', name: '个人项目', angle: 45 },      // 右上（x正，y负）
  { id: 'experience', name: '实习/工作', angle: -45 },  // 右下（x正，y正）
  { id: 'blog', name: '个人博客', angle: -135 },        // 左下（x负，y正）
];

interface KnowledgeNode {
  id: string;
  title: string;
  description?: string;
  children: KnowledgeNode[];
  isLeaf?: boolean;
  content?: string;
}

const initialKnowledgeTree: KnowledgeNode[] = [
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
            isLeaf: true,
            content: '## Python 基础语法\n\n### 变量类型\nPython 是动态类型语言...\n\n### 数据结构\n- 列表\n- 字典\n- 元组\n- 集合'
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
            isLeaf: true,
            content: '## 大语言模型基础\n\n### 定义\n大语言模型是基于深度学习的自然语言处理模型...'
          }
        ]
      }
    ]
  }
];

const Home = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [knowledgeTree, setKnowledgeTree] = useState<KnowledgeNode[]>(initialKnowledgeTree);
  const [expandedKnowledgeIds, setExpandedKnowledgeIds] = useState<string[]>(['tech-root', 'ai-root']);
  const [selectedKnowledgeId, setSelectedKnowledgeId] = useState<string | null>(null);
  const [containerCenter, setContainerCenter] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerCenter({
          x: rect.width / 2,
          y: rect.height / 2
        });
      }
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  const toggleKnowledgeExpand = (id: string) => {
    setExpandedKnowledgeIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectKnowledgeNode = (id: string) => {
    setSelectedKnowledgeId(id);
  };

  const findKnowledgeNode = (id: string): KnowledgeNode | null => {
    const search = (nodes: KnowledgeNode[]): KnowledgeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (Array.isArray(node.children) && node.children.length > 0) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(knowledgeTree);
  };

  // 按钮距离中心的像素距离
  const BUTTON_DISTANCE = 160;
  const CENTER_SIZE = 176; // w-44 = 176px

  const renderTreeNode = (
    node: KnowledgeNode,
    level: number,
    expandedIds: string[],
    onToggle: (id: string) => void,
    onSelect: (id: string) => void
  ) => {
    const isExpanded = expandedIds.includes(node.id);
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="select-none"
      >
        <div
          className="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 mb-1 hover:bg-gray-700/50"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (hasChildren) {
              onToggle(node.id);
            } else {
              onSelect(node.id);
            }
          }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(node.id);
              }}
              className="p-0.5 hover:bg-gray-600 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}

          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center ${node.isLeaf || !hasChildren ? 'bg-gray-600/80' : 'bg-gray-700'}`}>
            <span className="text-[10px] text-gray-300">{node.isLeaf ? '文' : '目'}</span>
          </span>

          <span className="text-gray-200 text-sm font-medium flex-1 truncate">
            {node.title}
          </span>
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && Array.isArray(node.children) && node.children.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {node.children.map((child) => (
                <div key={child.id}>
                  {renderTreeNode(child, level + 1, expandedIds, onToggle, onSelect)}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: '#1a1a1a',
      }}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      
      {/* 微妙的背景纹理 */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 主内容区 - 完美居中 */}
      <div ref={containerRef} className="relative w-full h-full">
        
        {/* ===== 连线层 - 使用固定长度 ===== */}
        <svg 
          className="absolute pointer-events-none" 
          style={{ 
            width: `${BUTTON_DISTANCE * 2 + CENTER_SIZE + 100}px`, 
            height: `${BUTTON_DISTANCE * 2 + CENTER_SIZE + 100}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
          }}
        >
          <AnimatePresence>
            {showButtons && !resumeOpen && !activeSection && radialItems.map((item) => {
              // 角度转弧度：0°=右侧（3点钟），90°=底部（6点钟）
              // 注意：屏幕上y轴向下为正，所以需要取反
              const radians = item.angle * (Math.PI / 180);
              const cx = (BUTTON_DISTANCE * 2 + CENTER_SIZE + 100) / 2;
              const cy = (BUTTON_DISTANCE * 2 + CENTER_SIZE + 100) / 2;
              // 起点：从中心圆边缘开始
              const startRadius = CENTER_SIZE / 2 + 10;
              // 终点：到按钮边缘结束
              const endRadius = startRadius + BUTTON_DISTANCE - 44; // 减去按钮半径
              
              return (
                <motion.line
                  key={`line-${item.id}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  x1={cx + Math.cos(radians) * startRadius}
                  y1={cy + (-Math.sin(radians)) * startRadius}  // 取反
                  x2={cx + Math.cos(radians) * endRadius}
                  y2={cy + (-Math.sin(radians)) * endRadius}  // 取反
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* ===== 中心圆圈 ===== */}
        <motion.button
          onClick={() => setResumeOpen(!resumeOpen)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="absolute z-20 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: CENTER_SIZE,
            height: CENTER_SIZE,
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.04) 60%, rgba(255,255,255,0) 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 0 40px rgba(255,255,255,0.05)',
          }}
        >
          {/* 双层脉冲环 */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: CENTER_SIZE + 30,
              height: CENTER_SIZE + 30,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: CENTER_SIZE + 55,
              height: CENTER_SIZE + 55,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* 头像占位 - 只显示一个字 */}
          <div 
            className="rounded-full flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-xl font-medium text-white/90" style={{ letterSpacing: '0.05em' }}>江</span>
          </div>
        </motion.button>

        {/* ===== 径向按钮 - 使用角度计算实现完美圆形分布 ===== */}
        <AnimatePresence>
          {showButtons && !resumeOpen && !activeSection && radialItems.map((item, index) => {
            // 使用角度和距离计算圆周上的位置
            const radians = item.angle * (Math.PI / 180);
            const distance = 160; // 距离中心的距离
            const offsetX = Math.cos(radians) * distance;
            const offsetY = -Math.sin(radians) * distance; // 屏幕y轴向下，取反
            
            // 用containerCenter计算绝对px位置
            const btnLeft = containerCenter.x + offsetX;
            const btnTop = containerCenter.y + offsetY;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  delay: index * 0.06, 
                  type: "spring", 
                  stiffness: 350, 
                  damping: 22 
                }}
                className="absolute z-10"
                style={{
                  left: `${btnLeft}px`,
                  top: `${btnTop}px`,
                  transform: 'translate(-50%, -50%)',
                  width: 88,
                  height: 88,
                }}
              >
                <motion.button
                  onClick={() => setActiveSection(item.id)}
                  className="w-full h-full rounded-full flex flex-col items-center justify-center backdrop-blur-sm cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.3)',
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                  whileTap={{ scale: 0.93 }}
                >
                  <span className="text-sm font-medium text-white/90 tracking-wide">
                    {item.name.split('/')[0]}
                  </span>
                  {item.name.includes('/') && (
                    <span className="text-[11px] text-white/50 mt-0.5">
                      {item.name.split('/')[1]}
                    </span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ===== 个人简历面板 - 灰白高级色调 ===== */}
      <AnimatePresence>
        {resumeOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            onClick={() => setResumeOpen(false)}
          >
            {/* 半透明遮罩 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* 简历卡片容器 */}
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="relative pointer-events-auto"
              style={{
                width: '720px',
                maxWidth: '90vw',
                background: '#222',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 - 小巧精致 */}
              <button
                onClick={() => setResumeOpen(false)}
                className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>

              <div className="flex">
                {/* 左侧面板 - 信息区 */}
                <div 
                  className="flex-1 p-8 relative overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, #282828 0%, #1f1f1f 100%)' }}
                >
                  {/* 装饰性背景 */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-30"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 70%)',
                    }}
                  />
                  
                  <div className="relative">
                    <h2 className="text-2xl font-semibold text-white mb-1">江启源</h2>
                    <p className="text-white/45 text-sm mb-8">AI/Agent 研究员</p>
                    
                    <div className="space-y-5">
                      <div className="group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                          <span className="text-xs text-white/35 uppercase tracking-wider">邮箱</span>
                        </div>
                        <p className="text-white/70 text-sm pl-3.5">qiyuan.jiang@mail.foxconn.com</p>
                      </div>
                      <div className="group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
                          <span className="text-xs text-white/35 uppercase tracking-wider">简介</span>
                        </div>
                        <p className="text-white/55 text-sm leading-relaxed pl-3.5">
                          热爱 AI/Agent 领域的开发者，专注于大语言模型应用和智能代理系统的研究与开发。
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 底部分隔线装饰 */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* 右侧面板 - 技能区 */}
                <div 
                  className="flex-1 p-8 relative overflow-hidden"
                  style={{ background: 'linear-gradient(180deg, #252525 0%, #1c1c1c 100%)' }}
                >
                  <div 
                    className="absolute bottom-0 left-0 w-32 h-32 opacity-30"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)',
                    }}
                  />
                  
                  <div className="relative h-full flex flex-col">
                    <h3 className="text-lg font-semibold text-white/90 mb-6">技能栈</h3>
                    
                    <div className="space-y-3 flex-1">
                      {[
                        { label: 'Python / JavaScript', level: 90 },
                        { label: 'React / TypeScript', level: 85 },
                        { label: 'LLM / Agent', level: 80 },
                        { label: '后端开发', level: 75 },
                      ].map((skill, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.08 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{skill.label}</span>
                            <span className="text-xs text-white/25">{skill.level}%</span>
                          </div>
                          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                              className="h-full bg-white/15 group-hover:bg-white/25 transition-colors rounded-full"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 内容面板 - 页面聚焦动画 ===== */}
      <AnimatePresence>
        {activeSection && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-30 flex flex-col overflow-hidden"
            style={{ background: '#181818' }}
          >
            {/* 关闭按钮 */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => setActiveSection(null)}
              className="absolute top-5 right-5 z-50 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:rotate-90"
            >
              <X className="w-4 h-4 text-white/60" />
            </motion.button>

            {/* 内容区域 */}
            <div className="relative flex-1 overflow-hidden">
              
              {/* ===== 知识库 - 从右滑入 ===== */}
              {activeSection === 'knowledge' && (
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: "spring", stiffness: 85, damping: 22, mass: 1 }}
                  className="w-full h-full flex"
                >
                  {/* 左侧树状结构 */}
                  <div 
                    className="w-[320px] flex flex-col shrink-0"
                    style={{ 
                      background: '#1e1e1e',
                      borderRight: '1px solid rgba(255,255,255,0.06)'
                    }}
                  >
                    <div className="px-5 py-4 border-b border-white/5">
                      <h2 className="text-base font-semibold text-white/90">知识库</h2>
                      <p className="text-xs text-white/35 mt-0.5">分类文档结构</p>
                    </div>
                    <div className="flex-1 overflow-y-auto py-3 px-3">
                      {knowledgeTree.map((node) => (
                        <div key={node.id}>
                          {renderTreeNode(node, 0, expandedKnowledgeIds, toggleKnowledgeExpand, selectKnowledgeNode)}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-white/5">
                      <button className="w-full py-2 text-xs text-white/40 hover:text-white/60 hover:bg-white/5 rounded-lg transition-all">
                        + 添加分类
                      </button>
                    </div>
                  </div>

                  {/* 右侧内容展示 */}
                  <div className="flex-1 p-8 overflow-y-auto" style={{ background: '#181818' }}>
                    {selectedKnowledgeId ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                      >
                        <div className="mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-9 h-9 rounded-lg flex items-center justify-center"
                              style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              <span className="text-base text-white/70">文</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white/90">
                                {findKnowledgeNode(selectedKnowledgeId)?.title}
                              </h3>
                              <p className="text-xs text-white/35 mt-0.5">
                                {findKnowledgeNode(selectedKnowledgeId)?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div 
                          className="p-6 rounded-xl"
                          style={{ 
                            background: '#202020', 
                            border: '1px solid rgba(255,255,255,0.05)' 
                          }}
                        >
                          <pre className="text-white/65 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {findKnowledgeNode(selectedKnowledgeId)?.content || '暂无内容'}
                          </pre>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <motion.div 
                          animate={{ y: [0, -8, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                          className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
                          style={{ background: '#252525', border: '1px dashed rgba(255,255,255,0.12)' }}
                        >
                          <span className="text-xl text-white/25">+</span>
                        </motion.div>
                        <p className="text-sm text-white/40 font-medium">选择左侧节点查看内容</p>
                        <p className="text-xs text-white/25 mt-1">点击叶子节点查看文档详情</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ===== 个人项目 - 从下滑入 ===== */}
              {activeSection === 'projects' && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: "spring", stiffness: 85, damping: 22, mass: 1 }}
                  className="w-full h-full overflow-y-auto"
                >
                  <div className="max-w-3xl mx-auto px-8 pt-14 pb-12">
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <span className="text-lg text-white/70">项</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-white/95">个人项目</h2>
                        </div>
                      </div>
                      <p className="text-sm text-white/35 ml-13">项目与作品集展示</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: '1',
                          title: 'AI Agent 系统',
                          date: '2024-2025',
                          desc: '基于大语言模型的智能代理系统，支持多轮对话和工具调用。',
                          tech: ['Python', 'LangChain', 'OpenAI', 'FastAPI'],
                        },
                        {
                          id: '2',
                          title: '个人主页',
                          date: '2025',
                          desc: '使用 React + TypeScript 构建的个人作品集网站。',
                          tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
                        }
                      ].map((project, i) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.12)' }}
                          className="p-5 rounded-xl cursor-default transition-all"
                          style={{ 
                            background: '#202020', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderLeft: '3px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 rounded text-xs text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>
                              个人项目
                            </span>
                            <span className="text-xs text-white/25">{project.date}</span>
                          </div>
                          <h3 className="text-base font-semibold text-white/90 mb-1">{project.title}</h3>
                          <p className="text-sm text-white/40 mb-3">{project.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tech.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded text-xs text-white/35" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ===== 个人博客 - 从下滑入 ===== */}
              {activeSection === 'blog' && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: "spring", stiffness: 85, damping: 22, mass: 1 }}
                  className="w-full h-full overflow-y-auto"
                >
                  <div className="max-w-3xl mx-auto px-8 pt-14 pb-12">
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <span className="text-lg text-white/70">笔</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-white/95">个人博客</h2>
                        </div>
                      </div>
                      <p className="text-sm text-white/35 ml-13">技术分享与心得</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: '1',
                          title: '深入理解 React Hooks',
                          date: '2025-05-15',
                          readTime: '5 分钟',
                          excerpt: '本文介绍了 React Hooks 的核心概念和最佳实践。',
                          tags: ['React', '前端'],
                        },
                        {
                          id: '2',
                          title: 'LangChain 入门指南',
                          date: '2025-06-01',
                          readTime: '8 分钟',
                          excerpt: '从零开始学习 LangChain，构建你自己的 AI 应用程序。',
                          tags: ['AI', 'LangChain'],
                        }
                      ].map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.12)' }}
                          className="p-5 rounded-xl cursor-pointer transition-all"
                          style={{ 
                            background: '#202020', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderLeft: '3px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-center gap-3 mb-2 text-xs text-white/25">
                            <span>{post.date}</span>
                            <span>·</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="text-base font-semibold text-white/90 mb-1">{post.title}</h3>
                          <p className="text-sm text-white/40 mb-3">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {post.tags.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs text-white/35" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ===== 实习工作 - 从下滑入 ===== */}
              {activeSection === 'experience' && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: "spring", stiffness: 85, damping: 22, mass: 1 }}
                  className="w-full h-full overflow-y-auto"
                >
                  <div className="max-w-3xl mx-auto px-8 pt-14 pb-12">
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <span className="text-lg text-white/70">工</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-white/95">实习/工作经历</h2>
                        </div>
                      </div>
                      <p className="text-sm text-white/35 ml-13">职业发展历程</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          id: '1',
                          position: 'AI 算法实习生',
                          company: '富士康工业互联网',
                          duration: '2024.06 - 至今',
                          description: '参与 AI/Agent 相关项目的研发工作，负责大语言模型应用开发。',
                          achievements: [
                            '开发基于 LLM 的智能问答系统',
                            '参与 Agent 框架的设计与实现',
                            '优化模型推理性能，降低延迟 30%',
                          ],
                        }
                      ].map((exp, i) => (
                        <motion.div
                          key={exp.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          whileHover={{ y: -3, borderColor: 'rgba(255,255,255,0.12)' }}
                          className="p-5 rounded-xl transition-all"
                          style={{ 
                            background: '#202020', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderLeft: '3px solid rgba(255,255,255,0.12)',
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-base font-semibold text-white/90">{exp.position}</h3>
                              <p className="text-sm text-white/50">{exp.company}</p>
                              <p className="text-xs text-white/30 mt-0.5">{exp.duration}</p>
                            </div>
                          </div>
                          <p className="text-sm text-white/40 mb-3">{exp.description}</p>
                          <ul className="space-y-1.5">
                            {exp.achievements.map((achievement, j) => (
                              <li 
                                key={j}
                                className="flex items-start gap-2 text-sm text-white/40"
                              >
                                <span className="text-white/20 mt-1.5 shrink-0">▸</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
