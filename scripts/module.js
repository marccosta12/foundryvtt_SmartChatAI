import { registerSettings, moduleName } from './settings.js';
import { getGptReplyAsHtml } from './gpt-api.js';

// Track users who have already seen the welcome message in this session
// Resets when Foundry is closed and reopened
const usersWhoSawWelcome = new Set();

Hooks.once('init', () => {
	console.log(`${moduleName} | Initialization`);
	registerSettings();
});

Hooks.on('ready', () => {
	// Show welcome message once per user per session
	const userId = game.user.id;
	
	if (!usersWhoSawWelcome.has(userId)) {
		showWelcomeMessage();
		usersWhoSawWelcome.add(userId);
		console.log(`${moduleName} | Welcome message shown to user ${game.user.name}`);
	}
});

function showWelcomeMessage() {
	const content = `
		<div style="font-family: sans-serif; line-height: 1.6;">
			<h2 style="margin-top: 0; color: #4a9eff;">Welcome to Smart Chat AI!</h2>
			<p><strong>How to use:</strong></p>
			<ul>
				<li><strong>/w gpt &lt;question&gt;</strong> - Private whisper to the AI (only you see the response)</li>
				<li><strong>/? &lt;question&gt;</strong> - Public message (everyone in chat sees the response)</li>
			</ul>
			<p><strong>Example:</strong> <code>/w gpt What is a gelatinous cube?</code></p>
			<hr style="margin: 15px 0; border: none; border-top: 1px solid #ccc;">
			<p><strong>🚀 Want more features?</strong></p>
			<p>Upgrade to <strong>Premium</strong> for enhanced AI capabilities, faster responses, and priority support!</p>
			<p>👉 <a href="https://smartchatai-premium.com" target="_blank" style="color: #4a9eff; text-decoration: underline;">Get Premium License</a></p>
		</div>
	`;

	ChatMessage.create({
		user: game.user.id,
		content: content,
		whisper: [game.user.id],
	});
}


Hooks.on('chatMessage', (chatLog, message, chatData) => {
	const echoChatMessage = async (chatData, question) => {
		const toGptHtml = '<span class="smart-chat-to">To: Smart Chat AI</span><br>';
		chatData.content = `${toGptHtml}${question.replace(/\n/g, "<br>")}`;
		await ChatMessage.create(chatData);
	};

	let match;

	const reWhisper = new RegExp(/^(\/w(?:hisper)?\s)(\[(?:[^\]]+)\]|(?:[^\s]+))\s*([^]*)/, "i");
	match = message.match(reWhisper);
	if (match) {
		const gpt = 'gpt';
		const userAliases = match[2].replace(/[[\]]/g, "").split(",").map(n => n.trim());
		const question = match[3].trim();
		if (userAliases.some(u => u.toLowerCase() === gpt)) {
			const users = userAliases
				.filter(n => n.toLowerCase() !== gpt)
				.reduce((arr, n) => arr.concat(ChatMessage.getWhisperRecipients(n)), [game.user]);

			// same error logic as in Foundry
			if (!users.length) throw new Error(game.i18n.localize("ERROR.NoTargetUsersForWhisper"));
			if (users.some(u => !u.isGM && u.id != game.user.id) && !game.user.can("MESSAGE_WHISPER")) {
				throw new Error(game.i18n.localize("ERROR.CantWhisper"));
			}

			chatData.type = CONST.CHAT_MESSAGE_TYPES.WHISPER;
			chatData.whisper = users.map(u => u.id);
			chatData.sound = CONFIG.sounds.notification;
			echoChatMessage(chatData, question);

			respondTo(question, users);

			// prevent further processing, since an unknown whisper target would trigger an error
			return false;
		}
	}

	const rePublic = new RegExp(/^(\/\?\s)\s*([^]*)/, "i");
	match = message.match(rePublic);
	if (match) {
		const question = match[2].trim();
		echoChatMessage(chatData, question);

		respondTo(question, []);

		// prevent further processing, since an unknown command would trigger an error
		return false;
	}

	return true;
});

async function respondTo(question, users) {
	console.debug(`${moduleName} | respondTo(question = "${question}", users =`, users, ')');
	let spinnerMessageId = null;
	
	try {
		// Get configuration
		const premiumLicense = game.settings.get(moduleName, 'premiumLicense');
		const apiKey = game.settings.get(moduleName, 'apiKey');
		const assistantId = game.settings.get(moduleName, 'assistantId');

		let reply;
		let usedPremium = false;

		// Priority 1: Try Premium Mode if license is configured
		if (premiumLicense && premiumLicense.trim()) {
			console.debug(`${moduleName} | Using Premium Mode`);
			
			// Show spinner for Premium API
			const spinnerMessage = await ChatMessage.create({
				user: game.user.id,
				speaker: ChatMessage.getSpeaker({alias: 'GPT'}),
				content: '<i class="fas fa-spinner fa-spin"></i> Thinking...',
				whisper: users.map(u => u.id),
			});
			spinnerMessageId = spinnerMessage.id;
			
			try {
				const { getPremiumReplyAsHtml } = await import('./premium-api.js');
				reply = await getPremiumReplyAsHtml(question, premiumLicense.trim());
				usedPremium = true;
			} catch (premiumError) {
				console.warn(`${moduleName} | Premium API failed:`, premiumError);
				
				// Fallback to free mode if API key is available
				if (apiKey && apiKey.trim()) {
					ui.notifications.warn(
						`Premium service unavailable: ${premiumError.message}. Using free mode instead.`,
						{permanent: false}
					);
					
					// Continue to free mode logic below
					console.debug(`${moduleName} | Falling back to Free Mode`);
					// usedPremium remains false, will continue to free mode
				} else {
					// No API key available for fallback
					throw new Error(`Premium service failed and no API key configured for fallback. Error: ${premiumError.message}`);
				}
			}
		}

		// Priority 2 & 3: Free Mode (if premium wasn't used or failed with fallback)
		if (!usedPremium) {
			// Validate that API key is configured
			if (!apiKey || !apiKey.trim()) {
				ui.notifications.error('Please configure your OpenAI API key or Premium license in module settings');
				return;
			}
			
			// If spinner wasn't created yet (direct free mode), create it now
			if (!spinnerMessageId) {
				const spinnerMessage = await ChatMessage.create({
					user: game.user.id,
					speaker: ChatMessage.getSpeaker({alias: 'GPT'}),
					content: '<i class="fas fa-spinner fa-spin"></i> Thinking...',
					whisper: users.map(u => u.id),
				});
				spinnerMessageId = spinnerMessage.id;
			}

			// Try Assistant API first if configured
			if (assistantId && assistantId.trim()) {
				console.debug(`${moduleName} | Using Assistant API with ID: ${assistantId}`);
				try {
					const { getAssistantReplyAsHtml } = await import('./assistant-api.js');
					reply = await getAssistantReplyAsHtml(question, assistantId, apiKey);
				} catch (assistantError) {
					console.warn(`${moduleName} | Assistant API failed:`, assistantError);
					ui.notifications.warn(
						`Assistant API unavailable: ${assistantError.message}. Using Chat Completions API instead.`,
						{permanent: false}
					);
					// Fallback to Chat Completions
					console.debug(`${moduleName} | Falling back to Chat Completions API`);
					reply = await getGptReplyAsHtml(question);
				}
			} else {
				// Use Chat Completions API directly
				console.debug(`${moduleName} | Using Chat Completions API`);
				reply = await getGptReplyAsHtml(question);
			}
		}

		// Remove spinner
		if (spinnerMessageId) {
			const spinnerMsg = game.messages.get(spinnerMessageId);
			if (spinnerMsg) await spinnerMsg.delete();
		}

		// Send final response
		const abbr = "By ChatGPT. Statements may be false";
		await ChatMessage.create({
			user: game.user.id,
			speaker: ChatMessage.getSpeaker({alias: 'GPT'}),
			content: `<abbr title="${abbr}" class="smart-chat-to fa-solid fa-microchip-ai"></abbr>
				<span class="smart-chat-reply">${reply}</span>`,
			whisper: users.map(u => u.id),
			sound: CONFIG.sounds.notification,
		});
	} catch (e) {
		console.error(`${moduleName} | Failed to provide response.`, e);
		ui.notifications.error(e.message, {permanent: true, console: false});
		
		// Remove spinner if it exists
		if (spinnerMessageId) {
			const spinnerMsg = game.messages.get(spinnerMessageId);
			if (spinnerMsg) await spinnerMsg.delete();
		}
	}
}
