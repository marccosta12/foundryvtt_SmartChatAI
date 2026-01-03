# Changelog

All notable changes to the project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.5.0] - 2026-01-03

### Added

- **Premium Mode** - New premium license system that connects to Smart Chat AI premium service
- **Premium API Integration** - New `premium-api.js` module for premium service communication via POST requests to `http://localhost:5000/api/chat`
- **Premium License Setting** - New password-protected setting to configure premium license code
- **Welcome Message** - First-time user onboarding message explaining commands and premium upgrade options
- **Smart Fallback System** - Automatic fallback from premium to free mode if premium service fails (when API key is configured)
- **Loading Indicator for Premium** - Spinner with "Thinking..." message now also displayed for premium API calls

### Changed

- **Priority-Based API Selection** - New logic prioritizes Premium → Assistant API → Chat Completions API
- **Enhanced Error Handling** - User notifications when premium service fails with automatic fallback to free mode
- **Improved Settings UI** - Premium license field styled as password input with autocomplete protection

### Technical

- Created `scripts/premium-api.js` with `getPremiumReply()` and `getPremiumReplyAsHtml()` functions
- Added `premiumLicense` setting in `settings.js` with change tracking
- Added `welcomeShown` hidden setting to track first-time user experience
- Refactored `respondTo()` function in `module.js` with three-tier mode priority system
- Premium API expects JSON: `{licenseCode, question}` and returns: `{status, respons}`

## [0.4.1] - 2025-12-18

### Changed

- **Branding Consistency** - Updated package name from `foundry-smart-chat` to `smart-chat-ai` in package.json
- **CSS Class Naming** - Renamed CSS classes from `ask-chatgpt-*` to `smart-chat-*` for consistent branding (affects module.css and module.js)
- **Improved Documentation** - Enhanced README Usage Examples section with clearer command explanations and visibility indicators
- **Better UX Guidance** - Improved Context Length setting hint with concise, scannable format showing practical value ranges
- **Automated Versioning** - Module.json now uses placeholders (#{VERSION}#, #{URL}#, etc.) for automatic updates via GitHub Actions workflow

### Added

- **Ko-fi Support** - Added Ko-fi donation button to README for community support
- **Enhanced Command Documentation** - Added detailed explanations of public (`/?`) vs private (`/w gpt`) commands with visibility clarifications

### Fixed

- **Chat Message Branding** - Updated chat messages to display "To: Smart Chat AI" instead of "To: Smart Chat" for consistency

## [0.4.0] - 2025-12-07

### Added

- **Visual Progress Indicator** - Spinner icon with "Thinking..." message while waiting for Assistants API responses
- **Thread Persistence System** - New `thread-manager.js` module that caches and reuses threads for better performance

### Changed

- **Adaptive Polling Optimization** - Assistants API now uses progressive delays (250ms → 3s) instead of fixed 1s intervals for 40-50% faster responses
- **Thread Reuse** - Assistants API reuses existing threads instead of creating new ones each time, reducing overhead by ~600ms per request
- **Improved Response Time** - Assistants API expected response time reduced from ~30s to ~15-20s for first question, ~14-19s for subsequent questions
- **Context Length Default** - Increased default context length setting for better conversation memory

### Fixed

- **Spinner Cleanup** - Spinner message is properly removed after response or on error, preventing orphaned messages
- **Thread Management** - History clear now also clears all cached threads to prevent stale thread issues

### Technical

- Created `scripts/thread-manager.js` with Map-based thread caching system
- Implemented `getOrCreateThread()`, `clearThread()`, and `clearAllThreads()` functions
- Updated `assistant-api.js` with `waitForRunCompletion()` using delays array [250ms, 250ms, 500ms, 500ms, 1s×4, 2s×3, 3s]
- Enhanced `history.js` with `clearHistory()` function that integrates with thread management
- Added comprehensive error handling for spinner lifecycle

## [0.3.0] - 2025-12-06

### Added

- **Updated Branding** - Unified module name to "Smart Chat AI" across all files and UI elements
- **Improved Model Descriptions** - Clearer naming for GPT models (GPT-4o, GPT-4o Mini, GPT-3.5 Turbo)
- **Enhanced Security Documentation** - Friendlier security tip about API key visibility with practical solutions

### Changed

- **Simplified Configuration** - Removed Premium Mode infrastructure for cleaner, focused user experience
- **Module ID Updated** - Changed from `foundry-smart-chat` to `SmartChatAI` for better consistency
- **Streamlined Settings** - Removed dual-mode complexity, now single Personal Mode only
- **Updated Module Name** - Changed internal `moduleName` from `askGPT` to `Smart Chat AI`
- **Refined UI Text** - Chat messages now show "To: Smart Chat" instead of "To: GPT"
- **Updated Compatibility** - Verified compatibility updated to Foundry VTT v13.351

### Removed

- **Premium Mode** - Removed Configuration Mode selector, License Code setting, and all Premium-related infrastructure
- **Ironsworn Support** - Removed game system (not widely requested)
- **Duplicate Settings** - Fixed bug where settings were registered twice
- **Original Co-author** - Moved Nikolay Vizovitin to Special Thanks section in acknowledgements

### Fixed

- **Settings Hook Simplified** - Removed unnecessary Premium Mode logic from renderSettingsConfig hook
- **API Key Validation** - Enhanced validation with `.trim()` check in both module.js and assistant-api.js
- **Copyright Attribution** - Clarified original codebase copyright while maintaining proper attribution
- **GitHub Actions** - Updated checkout action from v3 to v6

### Technical

- Cleaned up all Premium Mode remnants from codebase
- Simplified routing logic in `module.js` by removing mode checks
- Reduced settings.js complexity by ~50 lines
- Improved code maintainability with single-responsibility pattern

## [0.2.0] - 2025-11-19

### Added

- **Dual Configuration Modes** - New `Configuration Mode` setting to choose between Personal (free) and Premium (managed service)
- **Premium Mode Foundation** - Infrastructure for future Premium managed service with pre-configured Assistants
- **License Code Support** - New setting for Premium license validation (backend integration coming soon)
- **Dynamic Settings UI** - Settings now show/hide automatically based on selected configuration mode
- **Enhanced Security** - Both API keys and license codes are now password-masked in settings interface
- **Improved Validation** - Added comprehensive checks for API key presence and configuration validity

### Changed

- Refactored `module.js` with unified routing logic for both Personal and Premium modes
- Restructured `settings.js` for better organization and conditional visibility
- Improved settings order and grouping for better user experience
- Enhanced error messages and user notifications for configuration issues

### Technical

- Prepared infrastructure for future Premium backend integration
- Maintained 100% backward compatibility with existing Personal mode workflows
- Variables now properly scoped in routing logic to prevent conflicts
- Added validation layer to prevent execution without proper credentials

## [0.1.0] - 2025-11-15

### Added

- **Optional OpenAI Assistants API support** - Users can now provide their own existing Assistant ID to use Assistants API instead of Chat Completions
- **Refactored API client layer** - Centralized HTTP client with retry logic, error handling, and header management
- **Consistent history management** - Both Chat API and Assistants API now track conversation history
- **Automatic retries for Assistants API** - Same retry logic as Chat API (5 attempts with exponential backoff)
- **Comprehensive documentation** - Multiple guides including quick reference, implementation details, and refactoring analysis

- **Correct errors** - Remove unused functions and scripts

### Changed

- Reorganized API code into cleaner architecture: `api-client.js` for shared utilities
- Simplified `gpt-api.js` by removing retry logic duplication
- Refactored `assistant-api.js` to use centralized HTTP client
- Both APIs now follow identical patterns for consistency

### Fixed

- HTML conversion now centralized and consistent across APIs
- Error handling now uniform across Chat and Assistants APIs

## [0.1.1] - 2023-04-26

### Added

- Initial implementation.
- Public `/?` and whispered `/w gpt` messages to ChatGPT.
- Hide OpenAI API key value in settings.
- ChatGPT model version selection.
- Conversation support by preserving ChatGPT messages context.
  Customizable context length for API usage cost optimization.
- Basic game systems support for D&D 5e, Pathfinder 2e, and Ironsworn.
  Automatic game system detection.
- Customizable ChatGPT prompt.
- HTML formatted ChatGPT responses in the chat log with selectable text.
- Proper OpenAI API error handling and reporting.

[0.1.1]: https://github.com/vizovitin/foundryvtt-ask-chatgpt/releases/tag/0.1.1
