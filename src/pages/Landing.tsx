
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Music2, Headphones, ListMusic, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-8">
          <Music2 size={32} className="text-white" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold text-center mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
          Harmony Stream
        </h1>
        
        <p className="text-xl md:text-2xl text-center text-white/70 max-w-3xl mb-12">
          Discover your unique sound journey with our revolutionary AI-powered music experience.
        </p>
        
        <Button 
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-0 text-white px-8 py-6 text-lg"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        
        <p className="text-sm text-white/50 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-16 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Why Choose Harmony Stream?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Personalized Discovery</h3>
            <p className="text-white/70">
              Our AI learns your preferences to suggest music that resonates with your unique taste.
            </p>
          </div>
          
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4">
              <Headphones size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">High-Quality Audio</h3>
            <p className="text-white/70">
              Experience superior sound quality with our high-fidelity streaming technology.
            </p>
          </div>
          
          <div className="bg-white/5 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4">
              <ListMusic size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Smart Playlists</h3>
            <p className="text-white/70">
              Create and discover curated playlists that evolve as your musical journey continues.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Section */}
      <div className="container mx-auto px-4 py-8 border-t border-white/10 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Music2 size={16} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Harmony
            </span>
          </div>
          
          <div className="text-white/50 text-sm">
            © 2023 Harmony Stream. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
