import { moduleName } from './settings.js';

/**
 * Get reply from Premium service
 * @param {string} question - The question to ask
 * @param {string} licenseCode - Premium license code
 * @returns {Promise<{status: string, respons: string}>} Response from premium service
 */
export async function getPremiumReply(question, licenseCode) {
	console.debug(`${moduleName} | Calling Premium API`);

	const url = 'http://localhost:5000/api/chat';
	
	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				licenseCode: licenseCode,
				question: question,
			}),
		});

		if (!response.ok) {
			throw new Error(`Premium API HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		
		// Validate response structure
		if (!data.status || !data.respons) {
			throw new Error('Invalid response format from Premium API');
		}

		return data;
	} catch (error) {
		console.error(`${moduleName} | Premium API error:`, error);
		throw error;
	}
}

/**
 * Get reply from Premium service formatted as HTML
 * @param {string} question - The question to ask
 * @param {string} licenseCode - Premium license code
 * @returns {Promise<string>} HTML formatted response
 */
export async function getPremiumReplyAsHtml(question, licenseCode) {
	const data = await getPremiumReply(question, licenseCode);
	
	if (data.status === 'error') {
		throw new Error(data.respons);
	}
	
	return data.respons;
}
