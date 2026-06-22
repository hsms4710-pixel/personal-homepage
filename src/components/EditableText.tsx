import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = '点击编辑...',
  className = '',
  as: Component = 'span',
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      if ('select' in ref.current) {
        ref.current.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const handleSave = () => {
    if (editValue !== value) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="editable-wrapper"
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        multiline ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none ${className}`}
            autoFocus
          />
        ) : (
          <input
            ref={ref as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none ${className}`}
            autoFocus
          />
        )
      ) : (
        <Component 
          className={`editable-content cursor-pointer hover:text-blue-600 transition-colors ${value ? '' : 'text-gray-400'} ${className}`}
        >
          {value || placeholder}
        </Component>
      )}
    </div>
  );
};

export default EditableText;
