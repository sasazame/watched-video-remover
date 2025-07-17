# Contributing to Watched Video Remover

Thank you for your interest in contributing to Watched Video Remover! This document provides guidelines for contributing to the project.

## 🎯 Project Philosophy

Before contributing, please understand that this extension has a **single, focused purpose**: hiding watched videos from YouTube lists. We intentionally do NOT implement features for:
- Automatic video skipping
- Autoplay modifications
- Navigation between videos
- Playback control

If you're looking to add such features, this might not be the right project. We maintain this focus to keep the extension simple, reliable, and easy to maintain.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/watched-video-remover.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Create a Pull Request

## 💻 Development Setup

1. Install the extension in Chrome Developer Mode (see README.md)
2. Make changes to the source files
3. Reload the extension in Chrome to test changes
4. Test on various YouTube pages (home, search, watch, etc.)

## 📝 Code Style Guidelines

- Use consistent indentation (2 spaces)
- Use descriptive variable and function names
- Comment complex logic
- Keep functions focused and small
- Follow existing code patterns

## 🧪 Testing

Before submitting a PR, please test:
- [ ] Extension loads without errors
- [ ] Videos are hidden correctly on the home page
- [ ] Videos are hidden correctly on search results
- [ ] Videos are hidden correctly in related videos
- [ ] Settings are saved and applied properly
- [ ] Extension can be toggled on/off
- [ ] No console errors on YouTube pages

## 🐛 Reporting Issues

When reporting issues, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors if any

## 💡 Suggesting Features

We welcome feature suggestions that align with our core purpose. When suggesting features:
- Explain the use case clearly
- Ensure it's about hiding/filtering watched content
- Consider the impact on performance
- Provide mockups if applicable

## 📋 Pull Request Process

1. Ensure your code follows the style guidelines
2. Update the README.md if needed
3. Test thoroughly on different YouTube pages
4. Write a clear PR description explaining:
   - What the change does
   - Why it's needed
   - How it was tested
5. Link any related issues

## ⚠️ What We Won't Accept

PRs that add the following features will be rejected:
- Auto-skip functionality
- Autoplay modifications
- Video navigation features
- External API integrations
- Features unrelated to hiding watched videos

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make this extension better for everyone. We appreciate your time and effort!