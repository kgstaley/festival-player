# Claude Code Project Guidelines

This file contains guidelines for Claude Code when working on this project.

## Git Commit Guidelines

### Co-Authored-By Lines

**DO NOT** include `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>` or similar attribution lines in commit messages.

Commits should follow standard Git commit message format without AI attribution:

```
Short summary (imperative mood, max 72 chars)

Longer description explaining what and why, not how.
Can span multiple paragraphs if needed.

- Bullet points are fine
- Keep lines under 72 characters
```

### Good Commit Message Examples

```
Add graceful shutdown for server and client

Implements signal handlers for SIGTERM/SIGINT to ensure clean shutdown.
Server properly closes HTTP connections and releases port binding.
Client cleans up performance entries and handles HMR disposal.
```

```
Fix port conflict on server restart

Server now captures the HTTP server instance and properly closes it on
shutdown, releasing the port binding so restarts don't fail with
"address already in use" errors.
```

### Commit Message Format

- Use imperative mood ("Add feature" not "Added feature")
- First line is a summary (max 72 characters)
- Separate body with blank line
- Body explains what and why, not how
- Reference issues/PRs when relevant (#123)

## Testing

- Write tests for new features and bug fixes
- Run `./script/test` before committing
- Ensure both server and client tests pass
- Add test coverage for critical paths

## Code Style

- Follow existing code patterns in the project
- TypeScript strict mode is enabled - respect type safety
- ESLint auto-fix is run on server code during build
- Client uses react-scripts linting configuration

## Documentation

- Update README.md for new features or configuration changes
- Update CHANGELOG.md following Keep a Changelog format
- Document environment variables in README if added
- Keep docs in sync with code changes
