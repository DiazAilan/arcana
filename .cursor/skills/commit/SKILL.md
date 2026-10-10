---
name: commit
description: >-
  Create git commits in this repo using semantic commit messages
  (feature:, fix:, chore:, etc.). Use when the user asks to commit,
  save work, or write a commit message.
---

# Semantic commits (Arcana)

Follow this convention for every commit in this repository.

## Message format

```
<type>: <verb> + <result>
```

- **type** — lowercase, followed by a colon and a space.
- **verb + result** — imperative, concise, describes the outcome (not a file list).

### Types

| Type | When to use |
|------|-------------|
| `feature:` | New user-facing behavior or capability |
| `fix:` | Bug fix or incorrect behavior |
| `chore:` | Tooling, CI, deps, config, no product change |
| `refactor:` | Code change that is not a fix or feature |
| `test:` | Tests only |
| `docs:` | Documentation only |

`feat:` is acceptable as an alias for `feature:`; prefer **`feature:`** in this repo.

### Examples

```
feature: add deck viewer during combat
fix: prevent playing targeted cards without an enemy drop
chore: bump vite to 8.3
feature: show player debuffs and block in combat HUD
```

### Body (optional)

Add a blank line and short bullets when the change spans several areas:

```
feature: improve combat and run UX from playtest

Add power/block badges, grouped deck modal, drag-and-drop card play,
hit feedback, and pixel art for cards and enemies.
```

## Workflow

1. Run in parallel: `git status`, `git diff`, `git log -5 --oneline`.
2. Stage only relevant files (never `.env`, keys, or local secrets).
3. Write the message using the format above; focus on **why**, not every filename.
4. Commit with a HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
feature: verb + result

Optional body.

EOF
)"
```

5. Run `git status` to confirm a clean staged state.

## Rules

- Do **not** commit unless the user explicitly asked to commit.
- Do **not** amend, force-push, or change git config unless the user's rules allow it.
- Do **not** push unless the user asked to push.
- If a pre-commit hook fails, fix the issue and create a **new** commit (do not amend a failed commit).
