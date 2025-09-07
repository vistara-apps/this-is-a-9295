import React, { useState } from 'react';
import { Lightbulb, Search, Loader, Plus, TrendingUp, Users, DollarSign } from 'lucide-react';
import { generateIdeaFromKeywords } from '../utils/openaiService';

const IdeaGenerator = ({ ideas, setIdeas, user }) => {
  const [keywords, setKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState([]);

  const industries = [
    'SaaS & Tech',
    'E-commerce',
    'Healthcare',
    'Education',
    'Finance',
    'Marketing',
    'Productivity',
    'Content Creation',
    'Developer Tools',
    'Other'
  ];

  const handleGenerate = async () => {
    if (!keywords.trim()) return;

    setIsGenerating(true);
    try {
      const problems = await generateIdeaFromKeywords(keywords, industry);
      setGeneratedProblems(problems);
    } catch (error) {
      console.error('Error generating ideas:', error);
      // Fallback with sample data
      setGeneratedProblems([
        {
          name: "API Monitoring Dashboard",
          description: "A simple tool for developers to monitor API uptime and performance with customizable alerts",
          problem_category: "Developer Tools",
          user_pain_points: ["Complex monitoring tools", "Expensive enterprise solutions", "Lack of real-time alerts"],
          validation_stage: "initial",
          revenue_potential: 299,
          target_users: 500
        }
      ]);
    }
    setIsGenerating(false);
  };

  const addToIdeas = (problem) => {
    const newIdea = {
      id: Date.now().toString(),
      ...problem,
      created_at: new Date().toISOString()
    };
    setIdeas([...ideas, newIdea]);
    setGeneratedProblems(generatedProblems.filter(p => p !== problem));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Problem Discovery Engine</h2>
            <p className="text-text-secondary">
              Enter keywords related to your interests or industry, and our AI will surface underserved problems and emerging pain points.
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="card p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-text-primary mb-2">
              Keywords or Interest Areas
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., developer tools, small business automation, content creation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-text-primary mb-2">
              Industry Focus (Optional)
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select an industry...</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keywords.trim() || isGenerating}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Market Opportunities...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Discover Problems
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Problems */}
      {generatedProblems.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Discovered Opportunities</h3>
          <div className="space-y-4">
            {generatedProblems.map((problem, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary text-lg mb-2">{problem.name}</h4>
                    <p className="text-text-secondary mb-3">{problem.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-accent mr-2" />
                        <span className="text-text-secondary">Revenue: </span>
                        <span className="font-medium text-text-primary ml-1">${problem.revenue_potential}/mo</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-text-secondary">Users: </span>
                        <span className="font-medium text-text-primary ml-1">{problem.target_users}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {problem.problem_category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-text-primary">Key Pain Points:</span>
                      <ul className="list-disc list-inside text-sm text-text-secondary mt-1 space-y-1">
                        {problem.user_pain_points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => addToIdeas(problem)}
                    className="ml-4 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add to Ideas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Ideas */}
      {ideas.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Your Ideas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-text-primary mb-2">{idea.name}</h4>
                <p className="text-text-secondary text-sm mb-3">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    idea.validation_stage === 'validated' 
                      ? 'bg-green-100 text-green-800'
                      : idea.validation_stage === 'testing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {idea.validation_stage || 'Initial'}
                  </span>
                  <span className="text-text-secondary text-xs">{idea.problem_category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaGenerator;