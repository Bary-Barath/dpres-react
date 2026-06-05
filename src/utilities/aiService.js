/**
 * AI service for the DPRES AI Disaster Assistant.
 * Calls the OpenRouter API (OpenAI-compatible) using the user's API key.
 */

const SYSTEM_PROMPT = `You are DPRES AI Disaster Assistant.

You only answer questions related to:
- Disaster Preparedness
- Floods
- Cyclones
- Earthquakes
- Fire Safety
- First Aid
- CPR
- Emergency Kits
- Evacuation Procedures
- School and College Safety
- Emergency Response

Respond with clear, structured, actionable guidance. Use short paragraphs and bulleted steps where helpful. Always emphasize calling local emergency services for life-threatening situations.

If the question is unrelated to the topics above, politely respond exactly:

"I am the DPRES Disaster Assistant and can only assist with disaster preparedness and emergency safety topics."`;

const API_KEY = import.meta.env?.VITE_OPENROUTER_API_KEY || '';

const MODEL = 'openai/gpt-4o-mini';
const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export const isAIConfigured = () => Boolean(API_KEY);

/**
 * Send a chat history to OpenRouter and receive the assistant reply.
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 * @returns {Promise<string>}
 */
export async function askAI(history) {
  if (!API_KEY) {
    throw new Error(
      'Missing API key. Set VITE_OPENROUTER_API_KEY in a .env file at the project root.'
    );
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(({ role, content }) => ({ role, content }))
  ];

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'DPRES Disaster Assistant'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 1024
    })
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errJson = await res.json();
      detail = errJson?.error?.message || '';
    } catch (_) {
      detail = await res.text().catch(() => '');
    }
    throw new Error(
      `AI request failed (${res.status}). ${detail || 'Please verify your API key and quota.'}`
    );
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('AI returned an empty response. Please try again.');
  }
  return text;
}
