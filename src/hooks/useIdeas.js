import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch ideas from database
  const fetchIdeas = async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          pain_points (*),
          validation_signals (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new idea
  const createIdea = async (ideaData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([
          {
            ...ideaData,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Add to local state
      setIdeas(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update an existing idea
  const updateIdea = async (ideaId, updates) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', ideaId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, ...data } : idea
      ));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete an idea
  const deleteIdea = async (ideaId) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add pain points to an idea
  const addPainPoints = async (ideaId, painPoints) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const painPointsData = painPoints.map(pp => ({
        idea_id: ideaId,
        ...pp
      }));

      const { data, error } = await supabase
        .from('pain_points')
        .insert(painPointsData)
        .select();

      if (error) throw error;

      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, pain_points: [...(idea.pain_points || []), ...data] }
          : idea
      ));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Add validation signal to an idea
  const addValidationSignal = async (ideaId, signalData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('validation_signals')
        .insert([
          {
            idea_id: ideaId,
            ...signalData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId 
          ? { ...idea, validation_signals: [...(idea.validation_signals || []), data] }
          : idea
      ));

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get ideas by validation stage
  const getIdeasByStage = (stage) => {
    return ideas.filter(idea => idea.validation_stage === stage);
  };

  // Get ideas by category
  const getIdeasByCategory = (category) => {
    return ideas.filter(idea => idea.problem_category === category);
  };

  // Calculate total revenue potential
  const getTotalRevenuePotential = () => {
    return ideas.reduce((sum, idea) => sum + (idea.revenue_potential || 0), 0);
  };

  // Calculate total target users
  const getTotalTargetUsers = () => {
    return ideas.reduce((sum, idea) => sum + (idea.target_users || 0), 0);
  };

  // Fetch ideas when user changes
  useEffect(() => {
    fetchIdeas();
  }, [user]);

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    addPainPoints,
    addValidationSignal,
    getIdeasByStage,
    getIdeasByCategory,
    getTotalRevenuePotential,
    getTotalTargetUsers
  };
};
