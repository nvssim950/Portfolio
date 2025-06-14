import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Code, Zap, Palette, Terminal } from 'lucide-react';

function Main() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('hero');
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setCurrentSection(current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    {
      title: "Neural Dashboard",
      description: "AI-powered analytics platform with real-time data visualization and machine learning insights.",
      tech: ["Next.js", "TensorFlow.js", "D3.js", "WebGL"],
      image: "bg-gradient-to-br from-purple-600 to-blue-600",
      status: "Live"
    },
    {
      title: "Quantum UI Kit",
      description: "Revolutionary component library with physics-based animations and adaptive theming.",
      tech: ["React", "Framer Motion", "TypeScript", "Storybook"],
      image: "bg-gradient-to-br from-green-500 to-cyan-500",
      status: "Open Source"
    },
    {
      title: "BlockChain Explorer",
      description: "Decentralized application for exploring blockchain transactions with 3D visualizations.",
      tech: ["Web3.js", "Three.js", "Solidity", "GraphQL"],
      image: "bg-gradient-to-br from-orange-500 to-red-500",
      status: "Beta"
    }
  ];

  const skills = [
    { name: "Frontend", icon: Code, level: 95, color: "from-blue-500 to-purple-600" },
    { name: "Performance", icon: Zap, level: 90, color: "from-yellow-400 to-orange-500" },
    { name: "Design", icon: Palette, level: 85, color: "from-pink-500 to-rose-500" },
    { name: "DevOps", icon: Terminal, level: 80, color: "from-green-400 to-cyan-500" }
  ];

  return (
    <div ref={containerRef} className="bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              &lt;Dev/&gt;
            </div>
            <div className="flex space-x-8">
              {['hero', 'about', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-all duration-300 hover:text-blue-400 ${
                    currentSection === section ? 'text-blue-400' : 'text-gray-300'
                  }`}
                >
                  {section === 'hero' ? 'Home' : section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
        <div className={`text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <h1 className="text-7xl md:text-9xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              DEVELOPER
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Crafting digital experiences that push the boundaries of what's possible on the web
            </p>
          </div>
          
          <div className="flex justify-center space-x-6 mb-12">
            {[Github, Linkedin, Mail].map((Icon, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm hover:scale-110 transition-all duration-300 cursor-pointer"
              >
                <Icon className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollToSection('about')}
            className="group flex items-center mx-auto text-gray-400 hover:text-white transition-colors animate-bounce"
          >
            <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Creative Developer
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                I specialize in creating immersive digital experiences that blend cutting-edge technology 
                with intuitive design. From interactive 3D visualizations to AI-powered applications, 
                I bring ideas to life through code.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                My passion lies in exploring the intersection of art and technology, constantly 
                pushing the boundaries of what's possible in web development.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {["React", "Next.js", "Three.js", "WebGL", "AI/ML", "Blockchain"].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 text-sm hover:scale-105 transition-transform cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <skill.icon className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <span className="text-sm text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:scale-105 origin-left`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-500"
              >
                <div className={`h-48 ${project.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Project</span>
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Github className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Let's Create Something Amazing
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to turn your vision into reality? Let's collaborate and build the future of digital experiences together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-medium hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
              <span className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Start a Project</span>
              </span>
            </button>
            <button className="group px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all duration-300">
              <span className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <span>View My Work</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Developer Portfolio. Crafted with passion and precision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Main;