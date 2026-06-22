import { useState } from 'react';
import { Plus, Trash2, Edit3, X } from 'lucide-react';

interface EditableCardProps {
  title: string;
  onTitleChange: (title: string) => void;
  content: string;
  onContentChange: (content: string) => void;
  onDelete?: () => void;
  className?: string;
}

export const EditableCard: React.FC<EditableCardProps> = ({
  title,
  onTitleChange,
  content,
  onContentChange,
  onDelete,
  className = ''
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const handleTitleSave = () => {
    if (editTitle !== title) {
      onTitleChange(editTitle);
    }
    setIsEditingTitle(false);
  };

  const handleContentSave = () => {
    if (editContent !== content) {
      onContentChange(editContent);
    }
    setIsEditingContent(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md ${className}`}>
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              autoFocus
            />
          ) : (
            <h3 
              onClick={() => setIsEditingTitle(true)}
              className="flex-1 text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            >
              {title || '点击添加标题'}
            </h3>
          )}
          
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        {isEditingContent ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleContentSave}
            onKeyDown={(e) => e.key === 'Escape' && handleContentSave()}
            className="w-full h-32 p-3 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            autoFocus
            placeholder="添加内容..."
          />
        ) : (
          <p 
            onClick={() => setIsEditingContent(true)}
            className="text-gray-600 leading-relaxed whitespace-pre-wrap cursor-pointer hover:text-blue-600 transition-colors"
          >
            {content || '点击编辑内容'}
          </p>
        )}
      </div>
    </div>
  );
};

interface EditableCardListProps {
  items: { id: string; title: string; content: string }[];
  onChange: (items: { id: string; title: string; content: string }[]) => void;
  className?: string;
}

export const EditableCardList: React.FC<EditableCardListProps> = ({ items, onChange, className = '' }) => {
  const handleAdd = () => {
    const newItem = {
      id: Date.now().toString(),
      title: '',
      content: ''
    };
    onChange([...items, newItem]);
  };

  const handleUpdate = (id: string, field: 'title' | 'content', value: string) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDelete = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <EditableCard
          key={item.id}
          title={item.title}
          onTitleChange={(title) => handleUpdate(item.id, 'title', title)}
          content={item.content}
          onContentChange={(content) => handleUpdate(item.id, 'content', content)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
      
      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-400 transition-colors font-medium"
      >
        <Plus className="w-5 h-5 inline mr-2" />
 添加新条目
      </button>
    </div>
  );
};

export default EditableCard;
