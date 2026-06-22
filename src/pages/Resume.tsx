import { useState } from 'react';
import { personalInfo, workExperiences, type WorkExperience } from '../data/data';
import { Edit3, Trash2, Plus, X } from 'lucide-react';

const Resume = () => {
  const [editingSection, setEditingSection] = useState<'info' | 'experience' | null>(null);
  const [newExperience, setNewExperience] = useState<Partial<WorkExperience>>({
    company: '',
    position: '',
    duration: '',
    description: '',
    achievements: []
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editExpData, setEditExpData] = useState<Partial<WorkExperience>>({});

  const handleSaveInfo = () => {
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo));
    setEditingSection(null);
  };

  const handleAddExperience = () => {
    if (!newExperience.company || !newExperience.position) {
      alert('请填写公司和职位');
      return;
    }

    const fullExp: WorkExperience = {
      company: newExperience.company,
      position: newExperience.position,
      duration: newExperience.duration || '',
      description: newExperience.description || '',
      achievements: newExperience.achievements.filter(Boolean) as string[]
    };

    const updatedExperiences = [...workExperiences, fullExp];
    localStorage.setItem('workExperiences', JSON.stringify(updatedExperiences));
    setNewExperience({ company: '', position: '', duration: '', description: '', achievements: [] });
    window.location.reload();
  };

  const handleDeleteExperience = (index: number) => {
    if (confirm('确定要删除这条经历吗？')) {
      const updatedExperiences = workExperiences.filter((_, i) => i !== index);
      localStorage.setItem('workExperiences', JSON.stringify(updatedExperiences));
      window.location.reload();
    }
  };

  const handleSaveEditExp = (index: number) => {
    const updatedExperiences = [...workExperiences];
    updatedExperiences[index] = { ...updatedExperiences[index], ...editExpData };
    localStorage.setItem('workExperiences', JSON.stringify(updatedExperiences));
    setEditingExpId(null);
    setEditExpData({});
  };

  const handleAddAchievement = () => {
    setNewExperience(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), '']
    }));
  };

  const handleEditAddAchievement = () => {
    setEditExpData(prev => ({
      ...prev,
      achievements: [...((prev.achievements as string[]) || []), '']
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">我的简历</h1>
            <p className="text-gray-500 mt-1">工作经历与技能</p>
          </div>
        </div>
        
        <div className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">个人信息</h2>
              <button
                onClick={() => setEditingSection(editingSection === 'info' ? null : 'info')}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
            
            {editingSection === 'info' ? (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => {
                        const updated = { ...personalInfo, name: e.target.value };
                        localStorage.setItem('personalInfo', JSON.stringify(updated));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                    <input
                      type="text"
                      value={personalInfo.title}
                      onChange={(e) => {
                        const updated = { ...personalInfo, title: e.target.value };
                        localStorage.setItem('personalInfo', JSON.stringify(updated));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => {
                        const updated = { ...personalInfo, email: e.target.value };
                        localStorage.setItem('personalInfo', JSON.stringify(updated));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                    <input
                      type="text"
                      value={personalInfo.github}
                      onChange={(e) => {
                        const updated = { ...personalInfo, github: e.target.value };
                        localStorage.setItem('personalInfo', JSON.stringify(updated));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
                  <textarea
                    value={personalInfo.bio}
                    onChange={(e) => {
                      const updated = { ...personalInfo, bio: e.target.value };
                      localStorage.setItem('personalInfo', JSON.stringify(updated));
                    }}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveInfo}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  保存
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">姓名</h3>
                  <p className="text-gray-700">{personalInfo.name}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">职位</h3>
                  <p className="text-gray-700">{personalInfo.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">邮箱</h3>
                  <p className="text-gray-700">{personalInfo.email}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">GitHub</h3>
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{personalInfo.github}</a>
                </div>
              </div>
            )}
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">工作/实习经历</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingExpId(null)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setEditingSection(editingSection === 'experience' ? null : 'experience')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  添加经历
                </button>
              </div>
            </div>
            
            {editingSection === 'experience' && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">公司 *</label>
                    <input
                      type="text"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="公司名称"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">职位 *</label>
                    <input
                      type="text"
                      value={newExperience.position}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="职位名称"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">时间</label>
                    <input
                      type="text"
                      value={newExperience.duration}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="例如：2026 - 至今"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                      placeholder="描述工作内容"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">成就</label>
                    <button
                      onClick={handleAddAchievement}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      + 添加成就
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(newExperience.achievements || []).map((achievement, index) => (
                      <input
                        key={index}
                        type="text"
                        value={achievement}
                        onChange={(e) => {
                          const achievements = [...(newExperience.achievements || [])];
                          achievements[index] = e.target.value;
                          setNewExperience(prev => ({ ...prev, achievements }));
                        }}
                        onBlur={() => {
                          const achievements = (newExperience.achievements || []).filter((a, i) => i !== index || a);
                          setNewExperience(prev => ({ ...prev, achievements }));
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="成就描述"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleAddExperience}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    发布
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5" />
                  
                  {editingExpId === index ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                          <input
                            type="text"
                            value={editExpData.company || exp.company}
                            onChange={(e) => setEditExpData(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
                          <input
                            type="text"
                            value={editExpData.position || exp.position}
                            onChange={(e) => setEditExpData(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                        <textarea
                          value={editExpData.description || exp.description}
                          onChange={(e) => setEditExpData(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEditExp(index)}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => {
                            setEditingExpId(null);
                            setEditExpData({});
                          }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingExpId(index);
                              setEditExpData({});
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(index)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{exp.company}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{exp.description}</p>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                            <span className="text-blue-500 mt-1">▸</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>

            {workExperiences.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                暂无工作经历，点击"添加经历"开始创建
              </div>
            )}
          </div>

          {/* Download Button */}
          <div className="text-center">
            <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              下载 PDF 简历
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
