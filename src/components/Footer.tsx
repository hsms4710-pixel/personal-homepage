import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-agent-gray/50 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-agent-primary to-agent-secondary rounded-lg flex items-center justify-center font-mono font-bold text-agent-dark text-sm">
                {'>_'}
              </div>
              <span className="text-lg font-bold gradient-text">Agent Engineer</span>
            </div>
            <p className="text-gray-400 text-sm">
              构建面向未来的 AI 工程化工具，探索智能系统的边界。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              {['首页', '项目', '博客', '简历', '知识库'].map((item) => (
                <li key={item}>
                  <Link to={item === '首页' ? '/' : `/${item === '知识库' ? 'knowledge' : item === '简历' ? 'resume' : item.toLowerCase()}`}
                    className="text-gray-400 hover:text-agent-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:your-email@tencent.com" className="text-gray-400 hover:text-agent-primary transition-colors text-sm">
                  📧 your-email@tencent.com
                </a>
              </li>
              <li>
                <a href="https://github.com/hsms4710-pixel" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-agent-primary transition-colors text-sm">
                  💻 GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Agent Engineer. Built with React + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
