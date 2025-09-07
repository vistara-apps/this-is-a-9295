import React, { useState } from 'react';
import { Target, CheckCircle, AlertCircle, Copy, Download, Send } from 'lucide-react';
import { generateValidationQuestions, generateSurveyTemplate } from '../utils/openaiService';

const ValidationTools = ({ ideas, setIdeas }) => {
  const [selectedIdea, setSelectedIdea] = useState('');
  const [validationQuestions, setValidationQuestions] = useState([]);
  const [surveyTemplate, setSurveyTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationResults, setValidationResults] = useState({});

  const handleGenerateValidation = async () => {
    if (!selectedIdea) return;

    const idea = ideas.find(i => i.id === selectedIdea);
    if (!idea) return;

    setIsGenerating(true);
    try {
      const questions = await generateValidationQuestions(idea);
      const survey = await generateSurveyTemplate(idea, questions);
      
      setValidationQuestions(questions);
      setSurveyTemplate(survey);
    } catch (error) {
      console.error('Error generating validation tools:', error);
      // Fallback with sample data
      setValidationQuestions([
        {
          type: 'problem_validation',
          question: 'How often do you currently face this problem?',
          purpose: 'Understand frequency and impact of the problem'
        },
        {
          type: 'solution_interest',
          question: 'If a solution existed, how likely would you be to try it?',
          purpose: 'Gauge interest in potential solution'
        },
        {
          type: 'pricing_sensitivity',
          question: 'What would you expect to pay for such a solution monthly?',
          purpose: 'Understand willingness to pay'
        }
      ]);
      setSurveyTemplate(`Survey: ${idea.name} Validation\n\n1. How often do you face this problem?\n2. What solutions do you currently use?\n3. What's your biggest challenge with current solutions?\n4. How much would you pay for a better solution?`);
    }
    setIsGenerating(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const recordValidationResult = (ideaId, result) => {
    setValidationResults(prev => ({
      ...prev,
      [ideaId]: result
    }));

    // Update the idea's validation stage
    setIdeas(prev => prev.map(idea => 
      idea.id === ideaId 
        ? { ...idea, validation_stage: result.stage, validation_data: result }
        : idea
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Rapid Validation Tools</h2>
            <p className="text-text-secondary">
              Generate targeted questions and survey templates to quickly validate your ideas with potential users.
            </p>
          </div>
        </div>
      </div>

      {/* Idea Selection */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Select Idea to Validate</h3>
        
        {ideas.length > 0 ? (
          <div className="space-y-4">
            <select
              value={selectedIdea}
              onChange={(e) => setSelectedIdea(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose an idea...</option>
              {ideas.map((idea) => (
                <option key={idea.id} value={idea.id}>
                  {idea.name} - {idea.problem_category}
                </option>
              ))}
            </select>

            {selectedIdea && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {(() => {
                  const idea = ideas.find(i => i.id === selectedIdea);
                  return idea ? (
                    <div>
                      <h4 className="font-medium text-text-primary mb-2">{idea.name}</h4>
                      <p className="text-text-secondary text-sm">{idea.description}</p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            <button
              onClick={handleGenerateValidation}
              disabled={!selectedIdea || isGenerating}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? 'Generating Validation Tools...' : 'Generate Validation Questions'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">No ideas to validate</h4>
            <p className="text-text-secondary">Go to Problem Discovery to generate some ideas first</p>
          </div>
        )}
      </div>

      {/* Validation Questions */}
      {validationQuestions.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Validation Questions</h3>
          <div className="space-y-4">
            {validationQuestions.map((q, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-text-primary mb-2">{q.question}</h4>
                    <p className="text-text-secondary text-sm">{q.purpose}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {q.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(q.question)}
                    className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Survey Template */}
      {surveyTemplate && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Survey Template</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(surveyTemplate)}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </button>
              <button className="flex items-center px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4 mr-1" />
                Create Survey
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm text-text-primary">{surveyTemplate}</pre>
          </div>
        </div>
      )}

      {/* Validation Results */}
      {ideas.some(idea => idea.validation_data) && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Validation Results</h3>
          <div className="space-y-4">
            {ideas.filter(idea => idea.validation_data).map((idea) => (
              <div key={idea.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{idea.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    idea.validation_stage === 'validated' 
                      ? 'bg-green-100 text-green-800'
                      : idea.validation_stage === 'testing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {idea.validation_stage}
                  </span>
                </div>
                {idea.validation_data && (
                  <div className="text-sm text-text-secondary">
                    Responses: {idea.validation_data.responses || 0} | 
                    Interest Score: {idea.validation_data.interest_score || 'N/A'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Validation Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Validation Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">Target 10-20 responses</h4>
              <p className="text-text-secondary text-xs">Quality over quantity for initial validation</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">Ask open-ended questions</h4>
              <p className="text-text-secondary text-xs">Get deeper insights into user needs</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">Avoid leading questions</h4>
              <p className="text-text-secondary text-xs">Let users share honest feedback</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary text-sm">Follow up with interviews</h4>
              <p className="text-text-secondary text-xs">Dig deeper into interesting responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationTools;