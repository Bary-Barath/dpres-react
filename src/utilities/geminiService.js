/**
 * Gemini AI service for the DPRES AI Disaster Assistant.
 * Calls the Google Generative Language API using the user's API key.
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

const API_KEY =
  import.meta.env?.VITE_GEMINI_API_KEY ||
  import.meta.env?.REACT_APP_GEMINI_API_KEY ||
  '';

const MODEL = 'gemini-2.0-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export const isGeminiConfigured = () => Boolean(API_KEY);

/**
 * Send a chat history to Gemini and receive the assistant reply.
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 * @returns {Promise<string>}
 */
export async function askGemini(history) {
  if (!API_KEY) {
    throw new Error(
      'Missing Gemini API key. Set VITE_GEMINI_API_KEY in a .env file at the project root.'
    );
  }

  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      maxOutputTokens: 1024
    }
  };

  const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
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
      `Gemini request failed (${res.status}). ${detail || 'Please verify your API key and quota.'}`
    );
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();
  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }
  return text;
}
