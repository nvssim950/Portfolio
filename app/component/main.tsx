"use client"
import React, { useState, useEffect, useRef } from 'react';
import ContactForm from './ContactForm';
import {
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Database,
  Server,
  GitBranch,
  Shield,
  Sun,
  Moon,
  LucideIcon
} from 'lucide-react';

// Type definitions
interface MousePosition {
  x: number;
  y: number;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalX: number;
  originalY: number;
  pulse: number;
  size: number;
}

interface NeuralNetworkProps {
  mousePosition: MousePosition;
  isDarkMode: boolean;
}

interface Particle {
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
}

interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  status: string;
  URL: string;
  GIT: string;
}

interface Skill {
  name: string;
  icon: LucideIcon;
  level: number;
  color: string;
  technologies: string[];
}

interface ThemeClasses {
  bg: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  navBg: string;
  cardBg: string;
  inputBg: string;
  inputBorder: string;
  floatingParticles: string;
  gradientOverlay: string;
}

// Neural Network Animation Component
const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ mousePosition, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const initNodes = () => {
      const nodes: Node[] = [];
      const nodeCount = 80;
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
          pulse: Math.random() * Math.PI * 2,
          size: Math.random() * 2 + 1,
        });
      }
      nodesRef.current = nodes;
    };

    initNodes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodes = nodesRef.current;
      const mouseInfluence = 150;
      const connectionDistance = 120;
      
      // Update and draw nodes
      nodes.forEach((node) => {
        // Mouse attraction/repulsion
        const dx = mousePosition.x - node.x;
        const dy = mousePosition.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          node.vx += (dx / distance) * force * 0.01;
          node.vy += (dy / distance) * force * 0.01;
        }
        
        // Return to original position (gentle spring)
        const returnForce = 0.002;
        node.vx += (node.originalX - node.x) * returnForce;
        node.vy += (node.originalY - node.y) * returnForce;
        
        // Apply velocity with damping
        node.vx *= 0.98;
        node.vy *= 0.98;
        node.x += node.vx;
        node.y += node.vy;
        
        // Update pulse for glow effect
        node.pulse += 0.02;
        
        // Draw node
        const alpha = 0.6 + Math.sin(node.pulse) * 0.3;
        const nodeColor = isDarkMode ? `rgba(59, 130, 246, ${alpha})` : `rgba(99, 102, 241, ${alpha})`;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
        
        // Draw glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
        const glowColor = isDarkMode ? `rgba(59, 130, 246, ${alpha * 0.1})` : `rgba(99, 102, 241, ${alpha * 0.1})`;
        ctx.fillStyle = glowColor;
        ctx.fill();
      });
      
      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3;
            const connectionColor = isDarkMode 
              ? `rgba(59, 130, 246, ${opacity})` 
              : `rgba(99, 102, 241, ${opacity})`;
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[j].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setAnimatedElements(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return animatedElements;
};

const Main: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedElements = useScrollAnimation();

  // New state for floating particles
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // Generate random particles only on client after mount
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, index) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
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

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Animation helper function
  const getAnimationClass = (elementId: string, animationType: string = 'fade-up'): string => {
    const isAnimated = animatedElements.has(elementId);
    const baseClasses = 'transition-all duration-1000 ease-out';
    
    switch (animationType) {
      case 'fade-up':
        return `${baseClasses} ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`;
      case 'fade-left':
        return `${baseClasses} ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`;
      case 'fade-right':
        return `${baseClasses} ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`;
      case 'scale':
        return `${baseClasses} ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`;
      case 'slide-up':
        return `${baseClasses} ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`;
      default:
        return `${baseClasses} ${isAnimated ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  // Theme classes
  const themeClasses: ThemeClasses = {
    bg: isDarkMode ? 'bg-black' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-white/10' : 'border-gray-200',
    navBg: isDarkMode ? 'bg-black/20' : 'bg-white/20',
    cardBg: isDarkMode ? 'from-gray-900/50 to-gray-800/50' : 'from-white/50 to-gray-50/50',
    inputBg: isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50',
    inputBorder: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    floatingParticles: isDarkMode ? 'bg-white' : 'bg-gray-900',
    gradientOverlay: isDarkMode
      ? 'from-purple-900/10 via-transparent to-cyan-900/10'
      : 'from-blue-100/30 via-transparent to-purple-100/30'
  };

  const projects: Project[] = [
    {
      title: "Saleor Storefront",
      description: "A production-ready eCommerce storefront powered by Next.js and integrated with Saleor's GraphQL API.",
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL","Stripe"],
      image: "PROJ1.PNG",
      status: "Live",
      URL:"https://storefront.saleor.io/default-channel",
      GIT:"https://github.com/nvssim950/Saleor-Storefront"
    },
    {
      title: "Hashnode Clone",
      description: "The hassle-free blogging platform for engineers, thought-leaders, and the dev community!",
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL"],
      image: "PROJ2.PNG",
      status: "Open Source",
      URL:"https://hashnode-clone-iota.vercel.app/",
      GIT:"https://github.com/nvssim950/Hashnode"
    },
    {
      title: "OpenResume",
      description: "A sleek, customizable resume builder built with Next.js, Tailwind CSS, TypeScript, and PDF rendering using React PDF.",
      tech: ["Next.js", "Tailwind CSS", "TypeScript", "PostgreSQL","Zustand"],
      image: "PROJ3.PNG",
      status: "Beta",
      URL:"https://www.open-resume.com/",
      GIT:"https://github.com/xitanggg/open-resume"
    }
  ];

  const skills: Skill[] = [
    { name: "Frontend Development", icon: Code, level: 95, color: "from-blue-500 to-purple-600", technologies: ["React","JavaScript", "TypeScript", "Next.js"] },
    { name: "Backend Development", icon: Server, level: 90, color: "from-green-400 to-cyan-500", technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB","Supabase"] },
    { name: "Database Design", icon: Database, level: 88, color: "from-purple-500 to-pink-500", technologies: ["SQL", "NoSQL", "Redis", "GraphQL"] },
    { name: "Version Control", icon: GitBranch, level: 92, color: "from-yellow-400 to-orange-500", technologies: ["Git", "GitHub"] },
    { name: "Security & Testing", icon: Shield, level: 82, color: "from-cyan-400 to-blue-500", technologies: [ "OAuth", "JWT"] }
  ];

  return (
    <div
      ref={containerRef}
      className={`${themeClasses.bg} ${themeClasses.text} overflow-hidden relative transition-colors duration-500`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Neural Network Animation */}
        <NeuralNetwork mousePosition={mousePosition} isDarkMode={isDarkMode} />
        
        {/* Mouse-following radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`,
            transition: 'background-position 0.1s ease',
            willChange: 'background',
            zIndex: 2,
          }}
        />
        
        {/* Optional static gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${themeClasses.gradientOverlay}`} style={{ zIndex: 3 }} />
        
        {/* Floating particles */}
        {particles.map((dot, index) => (
          <div
            key={index}
            className={`absolute w-1 h-1 ${themeClasses.floatingParticles} rounded-full opacity-20 animate-pulse`}
            style={{
              left: dot.left,
              top: dot.top,
              animationDelay: dot.animationDelay,
              animationDuration: dot.animationDuration,
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className={`backdrop-blur-md ${themeClasses.navBg} border-b ${themeClasses.border}`}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Baheddi Nassim
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex space-x-8">
                {(['hero', 'about', 'projects', 'contact'] as const).map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`capitalize transition-all duration-300 hover:text-blue-400 ${
                      currentSection === section ? 'text-blue-400' : themeClasses.textSecondary
                    }`}
                  >
                    {section === 'hero' ? 'Home' : section}
                  </button>
                ))}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border ${themeClasses.border} backdrop-blur-sm hover:scale-110 transition-all duration-300 group`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-blue-400 group-hover:text-yellow-400 transition-colors" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-400 group-hover:text-purple-400 transition-colors" />
                )}
              </button>
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
            <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Crafting digital experiences that push the boundaries of what&apos;s possible on the web
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
            className={`group flex items-center mx-auto ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors animate-bounce`}
          >
            <ChevronDown className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left Column - About Content */}
            <div className={`scroll-animate ${getAnimationClass('about-content', 'fade-right')}`} id="about-content">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Full Stack Developer
              </h2>
              <p className={`text-lg ${themeClasses.textSecondary} mb-6 leading-relaxed`}>
                I specialize in building scalable web applications and robust backend systems. 
                With expertise spanning frontend frameworks, and database design, 
                I deliver end-to-end solutions that drive business growth.
              </p>
              <p className={`text-lg ${themeClasses.textSecondary} mb-8 leading-relaxed`}>
                My approach combines modern development practices with proven architectural patterns, 
                ensuring maintainable, secure, and high-performance applications.
              </p>

              <div className="flex flex-wrap gap-4">
                {["JavaScript", "TypeScript", "React", "Node.js", "Python", "MongoDB","Supabase","Next.js", "PostgreSQL"].map((tech, index) => (
                  <span
                    key={tech}
                    className={`scroll-animate px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border ${themeClasses.border} text-sm hover:scale-105 transition-all duration-500 cursor-default ${getAnimationClass(`tech-${index}`, 'scale')}`}
                    id={`tech-${index}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Skills */}
            <div className={`scroll-animate ${getAnimationClass('skills-section', 'fade-left')}`} id="skills-section">
              <div className="space-y-8">
                <h3 className="text-2xl font-semibold mb-6 text-blue-400">Technical Expertise</h3>
                {skills.map((skill, index) => (
                  <div 
                    key={skill.name} 
                    className={`scroll-animate group ${getAnimationClass(`skill-${index}`, 'slide-up')}`}
                    id={`skill-${index}`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-3">
                        <skill.icon className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-lg">{skill.name}</span>
                      </div>
                      <span className={`text-sm ${themeClasses.textMuted} font-mono`}>{skill.level}%</span>
                    </div>

                    <div className={`h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden mb-3`}>
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:scale-105 origin-left`}
                        style={{ 
                          width: animatedElements.has(`skill-${index}`) ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 200 + 500}ms`
                        }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skill.technologies.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className={`px-2 py-1 ${isDarkMode ? 'bg-gray-800/50 text-gray-300 border-gray-700/50' : 'bg-gray-100 text-gray-700 border-gray-300/50'} text-xs rounded border hover:border-blue-500/50 transition-colors`}
                          style={{ 
                            transitionDelay: `${index * 200 + techIndex * 100 + 700}ms`,
                            opacity: animatedElements.has(`skill-${index}`) ? 1 : 0,
                            transform: animatedElements.has(`skill-${index}`) ? 'translateY(0)' : 'translateY(10px)'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`scroll-animate text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ${getAnimationClass('projects-title', 'fade-up')}`} id="projects-title">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className={`scroll-animate group relative overflow-hidden rounded-2xl bg-gradient-to-br ${themeClasses.cardBg} border ${themeClasses.border} backdrop-blur-sm hover:scale-105 transition-all duration-500 ${getAnimationClass(`project-${index}`, 'scale')}`}
                id={`project-${index}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className={`h-48 relative overflow-hidden`}>
                  <img src={project.image} alt={project.title} />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className={`${themeClasses.textMuted} mb-4 text-sm leading-relaxed`}>
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
                      <span><a href={project.URL} target="_blank" rel="noopener noreferrer">View Project</a></span>
                    </button>
                    <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}>
                      <a href={project.GIT} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4" /></a>
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
        <div className="max-w-6xl mx-auto px-6">
          <div className={`scroll-animate text-center mb-16 ${getAnimationClass('contact-header', 'fade-up')}`} id="contact-header">
            <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Let&apos;s Work Together
            </h2>
            <p className={`text-xl ${themeClasses.textSecondary} mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Ready to turn your vision into reality? Let&apos;s collaborate and build something exceptional together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div className={`scroll-animate space-y-8 ${getAnimationClass('contact-info', 'fade-right')}`} id="contact-info">
              <h3 className={`text-3xl font-bold ${themeClasses.text} mb-8`}>Get In Touch</h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 group">
                  <div className={`p-3 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border ${themeClasses.border} group-hover:scale-110 transition-transform`}>
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className={`${themeClasses.textMuted} text-sm`}>Email</p>
                    <p className={`${themeClasses.text} font-medium`}>nassimbddm@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 group-hover:scale-110 transition-transform">
                    <Linkedin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className={`${themeClasses.textMuted} text-sm`}>LinkedIn</p>
                    <p className={`${themeClasses.text} font-medium`}>/in/nassim-baheddi-079143335 </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <p className={`${themeClasses.textMuted} text-sm mb-4`}>Available for:</p>
                <div className="flex flex-wrap gap-3">
                  {["Full-time Opportunities", "Freelance Projects", "Consulting", "Open Source Collaboration"].map((item, index) => (
                    <span
                      key={item}
                      className="px-3 py-2 bg-gradient-to-r from-green-600/20 to-cyan-600/20 border border-green-500/30 text-green-400 text-sm rounded-full transition-all duration-500"
                      style={{ 
                        transitionDelay: `${index * 100 + 500}ms`,
                        opacity: animatedElements.has('contact-info') ? 1 : 0,
                        transform: animatedElements.has('contact-info') ? 'translateY(0)' : 'translateY(20px)'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={`scroll-animate ${getAnimationClass('contact-form', 'fade-left')}`} id="contact-form">
              <ContactForm themeClasses={themeClasses} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className={`scroll-animate flex flex-col sm:flex-row gap-6 justify-center items-center mt-16 pt-8 border-t border-white/10 ${getAnimationClass('contact-buttons', 'slide-up')}`} id="contact-buttons">
            <button className="group px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all duration-300">
              <span className="flex items-center space-x-2">
                <Github className="w-5 h-5" />
                <a href="https://github.com/nvssim950" target="_blank" rel="noopener noreferrer"><span>View Portfolio</span></a>
              </span>
            </button>
            <button className="group px-8 py-4 border border-white/20 rounded-full font-medium hover:bg-white/5 transition-all duration-300">
              <span className="flex items-center space-x-2">
                <Linkedin className="w-5 h-5" />
                <a href="https://www.linkedin.com/in/nassim-baheddi-079143335/" target="_blank" rel="noopener noreferrer"><span>Connect on LinkedIn</span></a>
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
