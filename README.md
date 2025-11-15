# Ask ChatGPT - Enhanced Edition

Bring AI to your Foundry VTT table with powerful OpenAI integration. Whether you prefer simple Chat Completions or sophisticated Assistants with custom knowledge bases, this module adapts to your needs.

![Foundry VTT 10](https://img.shields.io/badge/Foundry_VTT-v10-informational?style=flat-square) ![GitHub all releases downloads](https://img.shields.io/github/downloads/marccosta12/foundryvtt_askGPT/total?label=downloads%40total&style=flat-square) ![GitHub latest release downloads](https://img.shields.io/github/downloads/marccosta12/foundryvtt_askGPT/latest/total?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/marccosta12/foundryvtt_askGPT/ci.yml?label=ci&logo=github&style=flat-square)

## Quick Start

1. **Get your API key** from [OpenAI](https://platform.openai.com/account/api-keys)
2. **Install the module** using: `https://github.com/marccosta12/foundryvtt_askGPT/releases/latest/download/module.json`
3. **Configure settings** with your API key and preferred AI engine
4. **Start asking!** Use `/?` or `/w gpt` in chat

## Usage Examples

### Public Questions (Visible to Everyone)
```
/? what's the cost of standing up from prone?
```
**Response:** Standing up from prone costs half of your movement speed.

### Private Whispers (DM & Sender Only)
```
/w [gpt, gm] time to don and doff armor
```
**Response:** According to the rules in the Player's Handbook, donning and doffing armor takes:

| Armor Type   | Donning Time | Doffing Time |
| ------------ | ------------ | ------------ |
| Light Armor  | 1 minute     | 1 minute     |
| Medium Armor | 5 minutes    | 1 minute     |
| Heavy Armor  | 10 minutes   | 5 minutes    |
| Shield       | 1 action     | 1 action     |

## Features

### Two AI Modes
- **Chat Completions API** - Fast, lightweight, great for quick rules lookups and inspiration
- **Assistants API** - Powerful, with custom knowledge bases and persistent context (bring your own Assistant ID)

### Game System Support
Built-in support for D&D 5e, Pathfinder 2e, Ironsworn, and generic systems. Customize prompts for any ruleset.

### Context Management
Maintain conversation history across multiple turns. Adjust context window size to balance memory and token usage.

### Flexible Configuration
- Choose your AI engine (Chat or Assistants)
- Select model version (GPT-4 or GPT-3.5)
- Customize system prompts for your campaign
- Configure context length for conversation memory

## How It Works

The module intercepts `/?` and `/w gpt` commands in Foundry VTT chat and sends them to your chosen OpenAI API. Responses are formatted with proper Markdown support and integrated into your game's chat log.

Your custom prompts determine how the AI behaves—whether it acts as a knowledgeable GM assistant, rules adjudicator, or creative inspiration engine. The AI understands rulesets for popular game systems but always benefits from additional context in custom prompts.

> **Security Note:** Due to how Foundry VTT modules work, your OpenAI API key is accessible to all players. Use a separate API key or org-level controls if this is a concern. Assistants API users should validate Assistant IDs are appropriate for shared play.

## Settings Guide

| Setting | Description | Default |
|---------|-------------|---------|
| **API Key** | Your OpenAI API key (required) | - |
| **AI Engine** | Chat Completions or Assistants API | Chat Completions |
| **Model** | gpt-4 or gpt-3.5-turbo (Chat) / Assistant ID (Assistants) | gpt-3.5-turbo |
| **Game System** | Auto-detect or choose: dnd5e, pf2e, ironsworn, generic | Auto-detect |
| **System Prompt** | Custom prompt for AI behavior (optional) | System default |
| **Context Length** | Number of previous messages to include (0-50) | 5 |

### Using Assistants

Don't have an Assistant? Create one on [OpenAI Platform](https://platform.openai.com/assistants):
1. Upload your rulebooks, campaign notes, or custom knowledge
2. Configure instructions for AI behavior
3. Copy the Assistant ID
4. Paste it in module settings under "Assistant ID"

That's it! Your Assistant is now available to your party.

## Acknowledgements

**Original Creator:** [Nikolay Vizovitin](https://github.com/vizovitin) - Built the foundation that makes this all possible.

**Current Maintainer:** [Marc Costa](https://github.com/marccosta12) - Added Assistants API support, refactored architecture, and ongoing development.

Special thanks to [OpenAI](https://openai.com) for incredible AI tools and to the [Foundry VTT](https://foundryvtt.com) community for the amazing platform.
