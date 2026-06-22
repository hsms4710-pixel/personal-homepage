import { useParams, useNavigate } from 'react-router-dom';
import { projects, type Project } from '../data/data';
import { Edit3, ArrowLeft } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">项目未找到</h1>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回项目列表
          </button>
        </div>
      </div>
    );
  }

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSave = (field: keyof Project) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...p, [field]: editValue } : p
    );
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setEditingField(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          返回项目列表
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                project.type === 'internship' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {project.type === 'internship' ? '实习项目' : '个人项目'}
              </span>
              <span className="text-gray-400 text-sm">{project.date}</span>
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
                setEditValue(project.title);
                setEditingField('title');
              }}
              className="text-4xl font-bold text-gray-900 cursor-pointer hover:text-blue-500 transition-colors mb-6"
            >
              {project.title}
            </h1>
          )}

          {/* Description */}
          {editingField === 'description' ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave('description')}
              onKeyDown={(e) => e.key === 'Enter' && handleSave('description')}
              className="w-full px-4 py-2 text-lg border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 mb-6"
              autoFocus
            />
          ) : (
            <p
              onClick={() => {
                setEditValue(project.description);
                setEditingField('description');
              }}
              className="text-lg text-gray-600 mb-8 cursor-pointer hover:text-blue-500 transition-colors"
            >
              {project.description}
            </p>
          )}

          {/* Long Description */}
          {editingField === 'longDescription' ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave('longDescription')}
              className="w-full h-40 px-4 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none mb-8"
              autoFocus
            />
          ) : (
            <div
              onClick={() => {
                setEditValue(project.longDescription);
                setEditingField('longDescription');
              }}
              className="bg-gray-50 p-6 rounded-lg mb-8 cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">项目详情</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {project.longDescription}
              </p>
            </div>
          )}

          {/* Technologies */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                在线演示
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
