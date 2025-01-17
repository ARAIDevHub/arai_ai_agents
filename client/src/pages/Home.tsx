import { Link } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-red-950/30 to-cyan-950/50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/public/arai-hero.jpg")',
            backgroundSize: 'cover',
            filter: 'brightness(0.8)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            ARAI AI AGENTS
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Create and customize your own AI agents in an immersive cyberpunk world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agent-creator"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r 
                        from-cyan-600 to-orange-600 px-6 py-3 text-lg font-semibold text-white 
                        hover:from-cyan-700 hover:to-orange-700 transition-all duration-300"
            >
              <Brain className="w-5 h-5 mr-2" />
              Create Agent
            </Link>
            {/* <Link
              to="/node-creator"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900/50 
                        px-6 py-3 text-lg font-semibold text-white border border-orange-500/20 
                        hover:bg-slate-900/70 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Node Creator
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;