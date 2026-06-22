import { useState } from 'react';
import { knowledgeTree, knowledgeCategories, uploadedDocuments, type KnowledgeNode, type UploadedDocument } from '../data/knowledgeData';
import { Plus, Upload, X, ChevronRight, ChevronDown, FileText, FolderOpen, Search } from 'lucide-react';

interface TreeNodeProps {
  node: KnowledgeNode;
  level: number;
  selectedId: string | null;
  onNodeSelect: (id: string) => void;
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  onAddNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  onEditNode: (id: string, field: 'title' | 'description' | 'content', value: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  selectedId,
  onNodeSelect,
  expandedIds,
  onToggleExpand,
  onAddNode,
  onDeleteNode,
  onEditNode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);

  const isExpanded = expandedIds.includes(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0 || !node.isLeaf;

  const handleDoubleClick = () => {
    if (!node.isLeaf) return;
    setEditValue(node.title);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue !== node.title) {
      onEditNode(node.id, 'title', editValue);
    }
    setIsEditing(false);
  };

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg cursor-pointer
          transition-colors duration-150
          ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
          ${node.isLeaf ? 'cursor-text' : 'cursor-pointer'}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren && !node.isLeaf) {
            onToggleExpand(node.id);
          }
          if (node.isLeaf) {
            onNodeSelect(node.id);
          }
        }}
        onDoubleClick={handleDoubleClick}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren && !node.isLeaf && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="p-0.5 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        )}
        {(!hasChildren || node.isLeaf) && (
          <span className="w-4" />
        )}

        {/* Icon */}
        {node.isLeaf ? (
          <FileText className="w-4 h-4 text-blue-500" />
        ) : (
          <FolderOpen className="w-4 h-4 text-amber-500" />
        )}

        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="px-1 py-0.5 text-sm border border-blue-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-200"
            autoFocus
          />
        ) : (
          <span className="text-gray-700 font-medium text-sm flex-1">
            {node.title}
          </span>
        )}

        {/* Description for leaf nodes */}
        {node.isLeaf && node.description && (
          <span className="text-xs text-gray-400 truncate max-w-32">
            {node.description}
          </span>
        )}

        {/* Actions */}
        {node.isLeaf && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onNodeSelect={onNodeSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
              onEditNode={onEditNode}
            />
          ))}
        </div>
      )}

      {/* Add child button */}
      {!node.isLeaf && (
        <div
          className="flex items-center gap-2 px-2 py-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
          style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }}
          onClick={() => onAddNode(node.id)}
        >
          <Plus className="w-3 h-3" />
          <span className="text-xs">添加子节点</span>
        </div>
      )}
    </div>
  );
};

const Knowledge = () => {
  const [treeData, setTreeData] = useState<KnowledgeNode[]>(knowledgeTree);
  const [documents, setDocuments] = useState<UploadedDocument[]>(uploadedDocuments);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<string[]>(['tech-root', 'ai-root']);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Find node by id
  const findNode = (id: string): KnowledgeNode | null => {
    const search = (nodes: KnowledgeNode[]): KnowledgeNode | null => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children.length > 0) {
          const found = search(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(treeData);
  };

  // Toggle expand
  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select node
  const selectNode = (id: string) => {
    setSelectedNodeId(id);
  };

  // Add node
  const addNode = (parentId: string) => {
    const newId = `new-${Date.now()}`;
    const newNode: KnowledgeNode = {
      id: newId,
      title: '新节点',
      description: '',
      children: [],
      isLeaf: true,
      content: ''
    };

    const updateTree = (nodes: KnowledgeNode[]): KnowledgeNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...node.children, newNode]
          };
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateTree(node.children)
          };
        }
        return node;
      });
    };

    setTreeData(updateTree);
    setSelectedNodeId(newId);
    setExpandedIds(prev => [...prev, parentId]);
  };

  // Delete node
  const deleteNode = (id: string) => {
    if (!confirm('确定要删除这个节点吗？')) return;

    const deleteFromTree = (nodes: KnowledgeNode[]): KnowledgeNode[] => {
      return nodes.flatMap(node => {
        if (node.id === id) return [];
        if (node.children.length > 0) {
          return [{
            ...node,
            children: deleteFromTree(node.children)
          }];
        }
        return [node];
      });
    };

    setTreeData(deleteFromTree);
    setSelectedNodeId(null);
  };

  // Edit node
  const editNode = (id: string, field: 'title' | 'description' | 'content', value: string) => {
    const updateTree = (nodes: KnowledgeNode[]): KnowledgeNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, [field]: value };
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: updateTree(node.children)
          };
        }
        return node;
      });
    };

    setTreeData(updateTree);
  };

  // Upload document
  const uploadDocument = () => {
    if (!newDocName.trim() || !newDocContent.trim() || !selectedCategory) {
      alert('请填写完整信息');
      return;
    }

    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      category: selectedCategory,
      content: newDocContent,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setDocuments(prev => [...prev, newDoc]);
    setNewDocName('');
    setNewDocContent('');
    setSelectedCategory('');
  };

  // Delete document
  const deleteDocument = (id: string) => {
    if (!confirm('确定要删除这个文档吗？')) return;
    setDocuments(prev => prev.filter(d => d.id !== id));
    setSelectedDocId(null);
  };

  // Get selected node
  const selectedNode = selectedNodeId ? findNode(selectedNodeId) : null;

  // Filter documents by category and search
  const filteredDocuments = documents.filter(doc => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Tree View */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">知识树</h2>
                <button
                  onClick={() => {
                    const newNodes = knowledgeCategories.map(c => ({
                      id: `cat-${c.id}`,
                      title: c.name,
                      description: '',
                      children: [],
                      isLeaf: true
                    }));
                    setTreeData([...newNodes, ...treeData]);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  + 添加分类
                </button>
              </div>

              {/* Tree */}
              <div className="max-h-[600px] overflow-y-auto">
                {treeData.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    selectedId={selectedNodeId}
                    onNodeSelect={selectNode}
                    expandedIds={expandedIds}
                    onToggleExpand={toggleExpand}
                    onAddNode={addNode}
                    onDeleteNode={deleteNode}
                    onEditNode={editNode}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Document View */}
          <div className="w-full md:w-1/2 lg:w-2/3">
            {/* Upload Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">上传新文档</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">文档名称</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="输入文档名称"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    <option value="">选择分类</option>
                    {knowledgeCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">文档内容 (Markdown)</label>
                <textarea
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  placeholder="输入文档内容，支持 Markdown 格式..."
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
                />
              </div>

              <button
                onClick={uploadDocument}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <Upload className="w-4 h-4" />
                上传文档
              </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">已上传文档</h2>
                <div className="relative flex-1 max-w-xs mx-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索文档..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSearchQuery('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    !searchQuery ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  全部 ({documents.length})
                </button>
                {knowledgeCategories.map(cat => {
                  const count = documents.filter(d => d.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (searchQuery) {
                          setSearchQuery(`[${cat.name}]`);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        searchQuery === `[${cat.name}]` ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat.icon} {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {filteredDocuments.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    暂无文档
                  </div>
                ) : (
                  filteredDocuments.map(doc => {
                    const category = knowledgeCategories.find(c => c.id === doc.category);
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`
                          p-3 rounded-lg cursor-pointer transition-all
                          ${selectedDocId === doc.id 
                            ? 'bg-blue-50 border-2 border-blue-500' 
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="font-medium text-gray-900">{doc.name}</span>
                          </div>
                          {category && (
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${category.color}20`, color: category.color }}
                            >
                              {category.name}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {doc.uploadDate}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - View Document Content */}
      {selectedDocId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {documents.find(d => d.id === selectedDocId)?.name}
              </h3>
              <button
                onClick={() => setSelectedDocId(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)] prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">
                {documents.find(d => d.id === selectedDocId)?.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Modal - View Node Content */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedNode.title}
              </h3>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)]">
              {selectedNode.content ? (
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {selectedNode.content}
                </pre>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无内容，双击节点标题可编辑
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLeaf"
                  checked={selectedNode.isLeaf}
                  onChange={(e) => editNode(selectedNode.id, 'isLeaf', e.target.checked)}
                  className="w-4 h-4 text-blue-500 rounded"
                />
                <label htmlFor="isLeaf" className="text-sm text-gray-700">
                  标记为叶子节点（可编辑内容）
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Knowledge;
