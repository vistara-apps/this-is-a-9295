import { supabase } from '../lib/supabase';

// Export ideas to JSON
export const exportIdeasToJSON = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        pain_points (*),
        validation_signals (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      ideas: data,
      summary: {
        total_ideas: data.length,
        validated_ideas: data.filter(idea => idea.validation_stage === 'validated').length,
        total_revenue_potential: data.reduce((sum, idea) => sum + (idea.revenue_potential || 0), 0),
        total_target_users: data.reduce((sum, idea) => sum + (idea.target_users || 0), 0)
      }
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting ideas:', error);
    throw error;
  }
};

// Download ideas as JSON file
export const downloadIdeasJSON = async (userId) => {
  try {
    const exportData = await exportIdeasToJSON(userId);
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `niche-navigator-ideas-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading ideas:', error);
    throw error;
  }
};

// Export ideas to CSV
export const exportIdeasToCSV = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // CSV headers
    const headers = [
      'Name',
      'Description',
      'Problem Category',
      'Validation Stage',
      'Revenue Potential',
      'Target Users',
      'Created At',
      'Updated At'
    ];

    // Convert data to CSV rows
    const rows = data.map(idea => [
      idea.name,
      idea.description,
      idea.problem_category,
      idea.validation_stage,
      idea.revenue_potential || 0,
      idea.target_users || 0,
      new Date(idea.created_at).toLocaleDateString(),
      new Date(idea.updated_at).toLocaleDateString()
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting ideas to CSV:', error);
    throw error;
  }
};

// Download ideas as CSV file
export const downloadIdeasCSV = async (userId) => {
  try {
    const csvContent = await exportIdeasToCSV(userId);
    
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `niche-navigator-ideas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
};

// Duplicate an idea
export const duplicateIdea = async (ideaId, userId) => {
  try {
    // Get the original idea
    const { data: originalIdea, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Create duplicate with modified name
    const duplicateData = {
      ...originalIdea,
      name: `${originalIdea.name} (Copy)`,
      validation_stage: 'initial',
      created_at: undefined,
      updated_at: undefined,
      id: undefined
    };

    const { data: newIdea, error: insertError } = await supabase
      .from('ideas')
      .insert([duplicateData])
      .select()
      .single();

    if (insertError) throw insertError;

    return newIdea;
  } catch (error) {
    console.error('Error duplicating idea:', error);
    throw error;
  }
};

// Get ideas statistics
export const getIdeasStatistics = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('ideas')
      .select(`
        *,
        validation_signals (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total_ideas: data.length,
      by_stage: {
        initial: data.filter(idea => idea.validation_stage === 'initial').length,
        testing: data.filter(idea => idea.validation_stage === 'testing').length,
        validated: data.filter(idea => idea.validation_stage === 'validated').length,
        rejected: data.filter(idea => idea.validation_stage === 'rejected').length
      },
      by_category: {},
      total_revenue_potential: data.reduce((sum, idea) => sum + (idea.revenue_potential || 0), 0),
      total_target_users: data.reduce((sum, idea) => sum + (idea.target_users || 0), 0),
      validation_signals: data.reduce((sum, idea) => sum + (idea.validation_signals?.length || 0), 0),
      average_revenue_per_idea: data.length > 0 
        ? data.reduce((sum, idea) => sum + (idea.revenue_potential || 0), 0) / data.length 
        : 0
    };

    // Calculate category distribution
    data.forEach(idea => {
      const category = idea.problem_category;
      stats.by_category[category] = (stats.by_category[category] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting ideas statistics:', error);
    throw error;
  }
};

// Search ideas
export const searchIdeas = async (userId, searchTerm, filters = {}) => {
  try {
    let query = supabase
      .from('ideas')
      .select(`
        *,
        pain_points (*),
        validation_signals (*)
      `)
      .eq('user_id', userId);

    // Apply text search
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply filters
    if (filters.category) {
      query = query.eq('problem_category', filters.category);
    }

    if (filters.stage) {
      query = query.eq('validation_stage', filters.stage);
    }

    if (filters.minRevenue) {
      query = query.gte('revenue_potential', filters.minRevenue);
    }

    if (filters.maxRevenue) {
      query = query.lte('revenue_potential', filters.maxRevenue);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching ideas:', error);
    throw error;
  }
};
