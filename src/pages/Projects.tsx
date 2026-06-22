import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projects, type Project } from '../data/data';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'internship' | 'personal'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    longDescription: '',
    technologies: [],
    type: 'personal',
    date: new Date().getFullYear().toString()
  });
  const [showForm, setShowForm] = useState(false);

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);

  const handleSaveEdit = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project && editData.title) {
      const updatedProjects = projects.map(p => 
        p.id === id ? { ...p, ...editData, id: p.id } : p
      );
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
    }
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      const updatedProjects = projects.filter(p => p.id !== id);
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      window.location.reload();
    }
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      alert('请填写项目名称和描述');
      return;
    }

    const newId = `project-${Date.now()}`;
    const fullProject: Project = {
      id: newId,
      title: newProject.title,
      type: newProject.type || 'personal',
      description: newProject.description,
      longDescription: newProject.longDescription || '',
      technologies: (newProject.technologies || []).filter(Boolean) as string[],
      image: ''
      ,
      github: newProject.github,
      demo: newProject.demo,
      date: newProject.date || new Date().getFullYear().toString()
    };

    const updatedProjects = [...projects, fullProject];
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    navigate(`/projects/${newId}`);
  };

  const handleAddTech = () => {
    setNewProject(prev => ({
      ...prev,
      technologies: [...(prev.technologies || []), '']
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">我的项目</h1>
            <p className="text-gray-500 mt-1">实习项目与个人项目的集合</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            添加项目
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'all', label: '全部' },
            { key: 'internship', label: '实习项目' },
            { key: 'personal', label: '个人项目' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Add Project Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">添加新项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称 *</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="输入项目名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目类型</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="internship">实习项目</option>
                  <option value="personal">个人项目</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">项目描述 *</label>
              <input
                type="text"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="简短描述项目"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">详细描述</label>
              <textarea
                value={newProject.longDescription}
                onChange={(e) => setNewProject(prev => ({ ...prev, longDescription: e.target.value }))}
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="详细描述项目内容"
              />
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">技术栈</label>
                <button
                  onClick={handleAddTech}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  + 添加技术
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(newProject.technologies || []).map((tech, index) => (
                  <input
                    key={index}
                    type="text"
                    value={tech}
                    onChange={(e) => {
                      const technologies = [...(newProject.technologies || [])];
                      technologies[index] = e.target.value;
                      setNewProject(prev => ({ ...prev, technologies }));
                    }}
                    onBlur={() => {
                      const technologies = (newProject.technologies || []).filter((t, i) => i !== index || t);
                      setNewProject(prev => ({ ...prev, technologies }));
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="技术名称"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                发布项目
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewProject({ title: '', description: '', longDescription: '', technologies: [], type: 'personal', date: new Date().getFullYear().toString() });
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    project.type === 'internship' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {project.type === 'internship' ? '实习项目' : '个人项目'}
                  </span>
                  <span className="text-gray-400 text-sm">{project.date}</span>
                </div>
                
                {editingId === project.id ? (
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      value={editData.title || project.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <input
                      type="text"
                      value={editData.description || project.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(project.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData({});
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-500 text-sm mb-4">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        查看详情
                        <span className="text-xs">→</span>
                      </Link>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(project.id);
                            setEditData({});
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            暂无项目，点击"添加项目"开始创建
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
