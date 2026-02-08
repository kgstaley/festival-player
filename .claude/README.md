# Claude Session Management

This directory contains session state and implementation plans for the Festival Player project.

## Directory Structure

```
.claude/
├── plans/
│   ├── complete/       # Completed plans (implemented and verified)
│   ├── in-progress/    # Currently being implemented
│   ├── not-started/    # Planned but not yet started
│   └── dead/           # Abandoned or superseded plans
├── session-state/      # Session-specific state and context
└── README.md           # This file
```

## Plans Directory

### complete/
Plans that have been fully implemented, tested, and merged. These serve as historical documentation of major changes.

### in-progress/
Plans currently being worked on. Move plans here when implementation starts.

### not-started/
Plans that have been written and reviewed but haven't been started yet. These are ready for implementation.

### dead/
Plans that were abandoned, deemed unnecessary, or superseded by other approaches. Keep these for historical reference.

## Session State

The `session-state/` directory contains version-controlled session information:
- Session metadata and context
- Session notes and findings
- Work-in-progress documentation
- Session-specific variables and configuration
- Conversation history and decision logs

All session state is tracked in git to maintain complete project history and enable collaboration across sessions.

## Workflow

1. **Planning**: Create plan in `not-started/`
2. **Start Work**: Move to `in-progress/` when beginning implementation
3. **Completion**: Move to `complete/` after successful implementation and testing
4. **Abandonment**: Move to `dead/` if plan is no longer relevant

## Naming Convention

Plans should be named descriptively:
- `YYYY-MM-DD-feature-name.md` - Feature implementations
- `YYYY-MM-DD-bugfix-issue-name.md` - Bug fixes
- `YYYY-MM-DD-refactor-area.md` - Refactoring work
- `YYYY-MM-DD-docs-update.md` - Documentation updates

Examples:
- `2026-02-08-docs-update-pr-1-2.md`
- `2026-02-10-add-festival-api-integration.md`
- `2026-02-15-refactor-playlist-generation.md`
