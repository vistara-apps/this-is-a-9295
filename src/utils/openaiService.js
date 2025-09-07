import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const generateIdeaFromKeywords = async (keywords, industry) => {
  try {
    const prompt = `As a micro-SaaS opportunity analyst, analyze the keywords "${keywords}" in the ${industry || 'general'} industry and identify 2-3 specific underserved problems that could become profitable micro-SaaS products.

For each opportunity, provide:
- A clear, specific product name
- 2-sentence problem description
- Problem category
- 3 key user pain points
- Estimated monthly revenue potential (realistic for micro-SaaS)
- Target user count

Format as JSON array with objects containing: name, description, problem_category, user_pain_points (array), validation_stage, revenue_potential (number), target_users (number).`;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateValidationQuestions = async (idea) => {
  try {
    const prompt = `Create 4-5 targeted validation questions for this micro-SaaS idea:

Name: ${idea.name}
Description: ${idea.description}
Category: ${idea.problem_category}

Generate questions that will help validate:
1. Problem existence and frequency
2. Current solution gaps
3. Willingness to pay
4. Feature priorities

Format as JSON array with objects containing: type, question, purpose.`;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateSurveyTemplate = async (idea, questions) => {
  try {
    const prompt = `Create a concise survey template for validating "${idea.name}".

Use these validation questions:
${questions.map(q => `- ${q.question}`).join('\n')}

Create a 5-7 question survey that:
- Starts with context/background questions
- Includes the validation questions
- Ends with demographic/contact info
- Uses clear, unbiased language
- Takes 3-5 minutes to complete

Format as plain text survey template.`;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateMonetizationStrategy = async (idea) => {
  try {
    const prompt = `Create a lean monetization strategy for this micro-SaaS:

Name: ${idea.name}
Description: ${idea.description}
Category: ${idea.problem_category}
Target Users: ${idea.target_users}

Provide:
1. Recommended pricing model (subscription/one-time/usage-based)
2. 3 pricing tiers with specific prices, features, and target segments
3. Value metrics to price on
4. Pricing psychology tactics
5. Revenue projections for months 1, 6, and 12

Format as JSON with: pricing_model, tiers (array with name, price, period, features, target_segment), value_metrics (array), pricing_psychology (array), revenue_projections (object with month_1, month_6, month_12).`;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateAcquisitionStrategy = async (idea) => {
  try {
    const prompt = `Create a guerilla acquisition strategy for this micro-SaaS to get the first 10-50 customers:

Name: ${idea.name}
Description: ${idea.description}
Category: ${idea.problem_category}
Target Users: ${idea.target_users}

Provide:
1. Primary, secondary, tertiary customer segments
2. 3-4 specific acquisition channels with platforms, approach, effort level, timeline, expected reach
3. 3 guerilla tactics with implementation details
4. 8-week timeline with weekly actions
5. Success metrics to track

Format as JSON with: target_customers (object with primary, secondary, tertiary), channels (array with name, platforms, approach, effort, timeline, expected_reach), tactics (array with title, description, implementation), timeline (object with week_1, week_2, etc.), success_metrics (array).`;

    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid JSON response');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};