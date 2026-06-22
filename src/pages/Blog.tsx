import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogPosts, type BlogPost } from '../data/data';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const Blog = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    date: new Date().toISOString().split('T')[0],
    readTime: '',
  });

  const handleAddPost = () => {
    if (!newPost.title || !newPost.content) {
      alert('请填写标题和内容');
      return;
    }

    const newId = `blog-${Date.now()}`;
    const fullPost: BlogPost = {
      id: newId,
      title: newPost.title,
      excerpt: newPost.excerpt || newPost.content.slice(0, 100) + '...',
      content: newPost.content,
      tags: (newPost.tags || []).filter(Boolean) as string[],
      date: newPost.date || new Date().toISOString().split('T')[0],
      readTime: newPost.readTime || '5 min'
    };

    const updatedPosts = [...blogPosts, fullPost];
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    navigate(`/blog/${newId}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这篇博客吗？')) {
      const updatedPosts = blogPosts.filter(p => p.id !== id);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      window.location.reload();
    }
  };

  const handleAddTag = () => {
    setNewPost(prev => ({
      ...prev,
      tags: [...(prev.tags || []), '']
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">技术博客</h1>
            <p className="text-gray-500 mt-1">分享技术心得与经验</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            写博客
          </button>
        </div>

        {/* Add Blog Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">写新博客</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="输入博客标题"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
              <input
                type="text"
                value={newPost.excerpt}
                onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="简短描述（可选）"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">内容 *</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="输入博客内容..."
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">标签</label>
                <button
                  onClick={handleAddTag}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  + 添加标签
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(newPost.tags || []).map((tag, index) => (
                  <input
                    key={index}
                    type="text"
                    value={tag}
                    onChange={(e) => {
                      const tags = [...(newPost.tags || [])];
                      tags[index] = e.target.value;
                      setNewPost(prev => ({ ...prev, tags }));
                    }}
                    onBlur={() => {
                      const tags = (newPost.tags || []).filter((t, i) => i !== index || t);
                      setNewPost(prev => ({ ...prev, tags }));
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="标签名称"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">阅读时间</label>
                <input
                  type="text"
                  value={newPost.readTime}
                  onChange={(e) => setNewPost(prev => ({ ...prev, readTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="例如：5 min"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddPost}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                发布博客
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewPost({ title: '', excerpt: '', content: '', tags: [], date: new Date().toISOString().split('T')[0], readTime: '' });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNewPost({
                          title: post.title,
                          excerpt: post.excerpt,
                          content: post.content,
                          tags: post.tags,
                          date: post.date,
                          readTime: post.readTime
                        });
                        setShowForm(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="编辑"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-500 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-500 text-sm mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.id}`}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                >
                  阅读全文
                  <span className="text-xs">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            暂无博客，点击"写博客"开始创作
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
