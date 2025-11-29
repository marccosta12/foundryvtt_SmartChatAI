export const moduleName = 'askGPT';

export const gameSystems = (() => {
	const genericPrompt = "I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Keep responses as short as possible. Stick to the rules as much as possible.";
	const formatPrompt = "Always format each answer as HTML code without CSS, including lists and tables. Never use Markdown.";
	//const formatPrompt = "Use clear, structured formatting: lists, bullet points, or numbered steps when explaining rules or procedures.";
	return {
		'generic': {
			name: 'Generic tabletop RPG',
			prompt: `You are a game master for a tabletop roleplaying game. ${genericPrompt} ${formatPrompt}`,
		},
		'dnd5e': {
			name: 'Dungeons & Dragons 5th Edition',
			prompt: `You are a dungeon master for a Dungeons & Dragons 5th Edition game. ${genericPrompt} Properly format spells, monsters, conditions, and so on. ${formatPrompt}`,
		},
		'pf2e': {
			name: 'Pathfinder Second Edition',
			prompt: `You are a game master for a Pathfinder 2nd Edition game. ${genericPrompt} Properly format spells, monsters, conditions, and so on. ${formatPrompt}`,
		},
	};
})();

export const registerSettings = () => {
	// 'world' scope settings are available only to GMs

	// Primary configuration mode selector
	game.settings.register(moduleName, 'configMode', {
		name: 'Configuration Mode',
		hint: 'Choose how you want to use the module. Personal: use your own OpenAI API. Premium: managed service with pre-configured Assistants (coming soon).',
		scope: 'world',
		config: true,
		type: String,
		default: 'personal',
		choices: {
			'personal': 'Personal (Use your own API)',
			'premium': 'Premium (Managed service - Coming Soon)'
		},
		onChange: () => {
			// Force settings menu refresh to show/hide relevant options
			if (game.settings.sheet?.rendered) {
				game.settings.sheet.render(true);
			}
		}
	});

	// PERSONAL MODE SETTINGS >>>

	game.settings.register(moduleName, 'apiKey', {
		name: 'OpenAI API key',
		hint: 'Required to connect with OpenAI. Generate your key at https://platform.openai.com/account/api-keys .',
		scope: 'world',
		config: true,
		type: String,
		default: '',
	});

	// <<< PERSONAL MODE SETTINGS

	// PREMIUM MODE SETTINGS >>>

	game.settings.register(moduleName, 'licenseCode', {
		name: 'Premium License Code',
		hint: 'Enter your premium license code to unlock managed Assistants.',
		scope: 'world',
		config: true,
		type: String,
		default: '',
	});

	// <<< PREMIUM MODE SETTINGS

	// COMMON SETTINGS >>>

	game.settings.register(moduleName, 'gameSystem', {
		name: 'Game system',
		hint: 'Select your game system to optimize rules and responses.',
		scope: 'world',
		config: true,
		type: String,
		default: game.system.id in gameSystems ? game.system.id : 'generic',
		choices: Object.fromEntries(
			Object.entries(gameSystems).map(([id, desc]) => [id, desc.name])
		),
		onChange: id => console.log(`${moduleName} | Game system changed to '${id}',`,
			'ChatGPT prompt now is:', getGamePromptSetting()),
	});

	//<<< COMMON SETTINGS

	// PERSONAL MODE SETTINGS >>>

	game.settings.register(moduleName, 'gamePrompt', {
		name: 'Custom prompt',
		hint: 'Optional. Replaces the Game system prompt. Use to customize ChatGPT behavior.',
		scope: 'world',
		config: true,
		type: String,
		default: gameSystems[game.settings.get(moduleName, 'gameSystem')].prompt,
		onChange: () => console.log(`${moduleName} | ChatGPT prompt now is:`, getGamePromptSetting()),
	});

	game.settings.register(moduleName, 'modelVersion', {
		name: 'GPT Model version',
		hint: 'Choose the OpenAI model. Higher versions give better results but cost more.',
		scope: 'world',
		config: true,
		type: String,
		default: 'gpt-4o-mini',
		choices: {
			'gpt-4o': 'GPT-4o (Best Quality, Higher Cost)',
			'gpt-4o-mini': 'GPT-4o Mini (Balanced - Recommended)',
			'gpt-3.5-turbo': 'GPT-3.5 Turbo (Economy)',
		},
	});

	game.settings.register(moduleName, 'contextLength', {
		name: 'Context length',
		hint: 'Number of recent messages ChatGPT remembers in each request. Higher values improve continuity but increase API cost. Context is per-user and resets when the page reloads.',
		scope: 'world',
		config: true,
		type: Number,
		default: 5,
		range: {min: 0, max: 50},
	});

	game.settings.register(moduleName, 'assistantId', {
		name: 'OpenAI Assistant ID',
		hint: 'Advanced. Uses your OpenAI Assistant and ignores model, system, and prompt settings.',
		scope: 'world',
		config: true,
		type: String,
		default: '',
		onChange: (id) => {
			if (id) {
				console.log(`${moduleName} | Assistant ID set: ${id}. Using Assistant API.`);
			} else {
				console.log(`${moduleName} | Assistant ID cleared. Using Chat Completions API.`);
			}
		},
	});

	// <<< PERSONAL MODE SETTINGS

	// Hook to dynamically show/hide settings based on mode
	Hooks.on('renderSettingsConfig', (_settingsConfig, element, _data) => {
		const mode = game.settings.get(moduleName, 'configMode');
		
		// Make API key input a password field
		let apiKeyInput = element.find(`input[name='${moduleName}.apiKey']`)[0];
		if (apiKeyInput) {
			apiKeyInput.type = 'password';
			apiKeyInput.autocomplete = 'one-time-code';
		}

		// Make license code input a password field
		let licenseInput = element.find(`input[name='${moduleName}.licenseCode']`)[0];
		if (licenseInput) {
			licenseInput.type = 'password';
			licenseInput.autocomplete = 'one-time-code';
		}
		
		// Hide settings based on mode
		if (mode === 'premium') {
			// Hide Personal mode settings
			element.find(`[name="${moduleName}.apiKey"]`).closest('.form-group').hide();
			element.find(`[name="${moduleName}.modelVersion"]`).closest('.form-group').hide();
			element.find(`[name="${moduleName}.assistantId"]`).closest('.form-group').hide();
			element.find(`[name="${moduleName}.gamePrompt"]`).closest('.form-group').hide();
			element.find(`[name="${moduleName}.contextLength"]`).closest('.form-group').hide();
		} else {
			// Hide Premium mode settings
			element.find(`[name="${moduleName}.licenseCode"]`).closest('.form-group').hide();
		}
	});
}

export const getGamePromptSetting = () => {
	return game.settings.get(moduleName, 'gamePrompt').trim() ||
		gameSystems[game.settings.get(moduleName, 'gameSystem')].prompt;
}
