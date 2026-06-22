import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts, type BlogPost } from '../data/data';
import { Edit3, ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === id);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">博客未找到</h1>
          <button
            onClick={() => navigate('/blog')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回博客列表
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (field: keyof BlogPost) => {
    const updatedPosts = blogPosts.map(p => 
      p.id === post.id ? { ...p, [field]: editValue } : p
    );
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setEditingField(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          返回博客列表
        </button>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Meta Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-gray-500">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          {editingField === 'title' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave('title')}
              onKeyDown={(e) => e.key === 'Enter' && handleSave('title')}
              className="w-full px-4 py-2 text-4xl font-bold border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => {
                setEditValue(post.title);
                setEditingField('title');
              }}
              className="text-4xl font-bold text-gray-900 cursor-pointer hover:text-blue-500 transition-colors mb-6"
            >
              {post.title}
            </h1>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          {editingField === 'content' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave('content')}
              className="w-full h-96 px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              autoFocus
            />
          ) : (
            <div
              onClick={() => {
                setEditValue(post.content);
                setEditingField('content');
              }}
              className="bg-gray-50 p-6 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors prose prose-gray max-w-none"
            >
              <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                {post.content}
              </pre>
            </div>
          )}
        </article>

        {/* Edit Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setEditValue(post.title);
              setEditingField('title');
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            编辑博客
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
