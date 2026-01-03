import { moduleName } from './settings.js';

/**
 * Call Premium Chat API
 * @param {string} query - User query
 * @returns {Promise<string>} - Response text
 */
async function callGptApi(query) {
	const licenseCode = game.settings.get(moduleName, 'premiumLicense');
	const apiUrl = 'http://localhost:5000/api/chat';

	const requestBody = {
		licenseCode: licenseCode,
		question: query,
	};

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody),
	};

	try {
		const response = await fetch(apiUrl, requestOptions);

		if (!response.ok) {
			throw new Error(`API HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Check response status
		if (data.status === 'error') {
			throw new Error(data.respons || 'API returned error status');
		}

		if (data.status !== 'success') {
			throw new Error(`Unexpected API status: ${data.status}`);
		}

		return data.respons;
	} catch (error) {
		console.error(`${moduleName} | callGptApi failed:`, error);
		throw error;
	}
}

/**
 * Get response from Chat API formatted as HTML
 * @param {string} query - User query
 * @returns {Promise<string>} - Response formatted as HTML
 */
export async function getGptReplyAsHtml(query) {
	return await callGptApi(query);
}
