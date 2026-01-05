import { moduleName } from './settings.js';
import { pushHistory } from './history.js';
import { fetchWithRetry, convertToHtml, getAuthHeader } from './api-client.js';

/**
 * Call OpenAI Chat Completions API
 * @param {string} query - User query
 * @returns {Promise<string>} - Response text
 */
async function callGptApi(query) {
	const apiKey = game.settings.get(moduleName, 'apiKey');
	const modelVersion = game.settings.get(moduleName, 'modelVersion');
	const gamePrompt = game.settings.get(moduleName, 'gamePrompt');
	const contextLength = game.settings.get(moduleName, 'contextLength');

	// Build messages array with system prompt and history
	const messages = [
		{ role: 'system', content: gamePrompt }
	];

	// Add conversation history if context length > 0
	if (contextLength > 0) {
		const history = game.settings.get(moduleName, 'history') || [];
		const recentHistory = history.slice(-contextLength);
		messages.push(...recentHistory);
	}

	// Add current user query
	messages.push({ role: 'user', content: query });

	const apiUrl = 'https://api.openai.com/v1/chat/completions';

	const requestBody = {
		model: modelVersion,
		messages: messages,
		temperature: 0.7,
	};

	const requestOptions = {
		method: 'POST',
		headers: getAuthHeader(apiKey),
		body: JSON.stringify(requestBody),
	};

	try {
		const data = await fetchWithRetry(apiUrl, requestOptions, 'ChatCompletions');

		if (!data.choices || data.choices.length === 0) {
			throw new Error('No response from OpenAI API');
		}

		const reply = data.choices[0].message.content;

		// Save to history
		pushHistory(query, reply);

		return reply;
	} catch (error) {
		console.error(`${moduleName} | callGptApi failed:`, error);
		throw error;
	}
}

/**
 * Get response from Chat Completions API formatted as HTML
 * @param {string} query - User query
 * @returns {Promise<string>} - Response formatted as HTML
 */
export async function getGptReplyAsHtml(query) {
	const reply = await callGptApi(query);
	return convertToHtml(reply);
}
