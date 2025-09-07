import { useState } from 'react';
import { generateValidationQuestions, generateSurveyTemplate } from '../utils/openaiService';
import { useIdeas } from './useIdeas';

export const useValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addValidationSignal } = useIdeas();

  // Generate validation questions for an idea
  const generateQuestions = async (idea) => {
    try {
      setLoading(true);
      setError(null);
      
      const questions = await generateValidationQuestions(idea);
      
      // Save validation signal
      await addValidationSignal(idea.id, {
        type: 'survey',
        result: {
          action: 'questions_generated',
          questions: questions,
          timestamp: new Date().toISOString()
        }
      });

      return questions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Generate survey template
  const generateSurvey = async (idea, questions) => {
    try {
      setLoading(true);
      setError(null);
      
      const surveyTemplate = await generateSurveyTemplate(idea, questions);
      
      // Save validation signal
      await addValidationSignal(idea.id, {
        type: 'survey',
        result: {
          action: 'survey_generated',
          template: surveyTemplate,
          questions: questions,
          timestamp: new Date().toISOString()
        }
      });

      return surveyTemplate;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record survey results
  const recordSurveyResults = async (ideaId, results) => {
    try {
      setLoading(true);
      setError(null);
      
      await addValidationSignal(ideaId, {
        type: 'survey',
        result: {
          action: 'survey_results',
          responses: results.responses,
          summary: results.summary,
          insights: results.insights,
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record interview results
  const recordInterviewResults = async (ideaId, interviewData) => {
    try {
      setLoading(true);
      setError(null);
      
      await addValidationSignal(ideaId, {
        type: 'interview',
        result: {
          action: 'interview_completed',
          participant: interviewData.participant,
          duration: interviewData.duration,
          key_insights: interviewData.insights,
          pain_points_confirmed: interviewData.painPointsConfirmed,
          willingness_to_pay: interviewData.willingnessToPay,
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record landing page test results
  const recordLandingPageResults = async (ideaId, landingPageData) => {
    try {
      setLoading(true);
      setError(null);
      
      await addValidationSignal(ideaId, {
        type: 'landing_page',
        result: {
          action: 'landing_page_test',
          url: landingPageData.url,
          visitors: landingPageData.visitors,
          signups: landingPageData.signups,
          conversion_rate: landingPageData.conversionRate,
          traffic_sources: landingPageData.trafficSources,
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record prototype feedback
  const recordPrototypeResults = async (ideaId, prototypeData) => {
    try {
      setLoading(true);
      setError(null);
      
      await addValidationSignal(ideaId, {
        type: 'prototype',
        result: {
          action: 'prototype_feedback',
          prototype_type: prototypeData.type,
          users_tested: prototypeData.usersTested,
          feedback: prototypeData.feedback,
          usability_score: prototypeData.usabilityScore,
          feature_requests: prototypeData.featureRequests,
          timestamp: new Date().toISOString()
        }
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Analyze validation signals for an idea
  const analyzeValidationSignals = (idea) => {
    if (!idea.validation_signals || idea.validation_signals.length === 0) {
      return {
        score: 0,
        confidence: 'low',
        recommendations: ['Start with basic validation surveys', 'Conduct user interviews'],
        signals: []
      };
    }

    const signals = idea.validation_signals;
    let score = 0;
    const recommendations = [];

    // Analyze different types of signals
    const surveySignals = signals.filter(s => s.type === 'survey');
    const interviewSignals = signals.filter(s => s.type === 'interview');
    const landingPageSignals = signals.filter(s => s.type === 'landing_page');
    const prototypeSignals = signals.filter(s => s.type === 'prototype');

    // Score based on signal types and quality
    if (surveySignals.length > 0) score += 20;
    if (interviewSignals.length >= 3) score += 30;
    if (landingPageSignals.length > 0) score += 25;
    if (prototypeSignals.length > 0) score += 25;

    // Analyze landing page conversion rates
    landingPageSignals.forEach(signal => {
      const conversionRate = signal.result.conversion_rate || 0;
      if (conversionRate > 0.05) score += 10; // 5%+ conversion is good
      if (conversionRate > 0.10) score += 10; // 10%+ is excellent
    });

    // Generate recommendations based on current state
    if (surveySignals.length === 0) {
      recommendations.push('Create and distribute validation surveys');
    }
    if (interviewSignals.length < 3) {
      recommendations.push('Conduct more user interviews (target: 5-10)');
    }
    if (landingPageSignals.length === 0) {
      recommendations.push('Create a landing page to test demand');
    }
    if (prototypeSignals.length === 0 && score > 40) {
      recommendations.push('Build a simple prototype for user testing');
    }

    // Determine confidence level
    let confidence = 'low';
    if (score >= 30) confidence = 'medium';
    if (score >= 60) confidence = 'high';
    if (score >= 80) confidence = 'very high';

    return {
      score: Math.min(score, 100),
      confidence,
      recommendations,
      signals: {
        surveys: surveySignals.length,
        interviews: interviewSignals.length,
        landingPages: landingPageSignals.length,
        prototypes: prototypeSignals.length
      }
    };
  };

  return {
    loading,
    error,
    generateQuestions,
    generateSurvey,
    recordSurveyResults,
    recordInterviewResults,
    recordLandingPageResults,
    recordPrototypeResults,
    analyzeValidationSignals
  };
};
