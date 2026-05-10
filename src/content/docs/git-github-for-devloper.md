---

title: "Git & GitHub Command Reference"
description: "Operational reference for core Git commands, workflows, and execution contexts."
pubDate: 2026-02-22
category: "Foundations"
tags: ["Git", "Commands", "Branching", "Version Control"]
draft: false
featured: false
---------------

This document defines the practical command surface of Git and where each command operates in the repository lifecycle.

## Problem Context

Git workflows often fail due to misuse of commands across different repository zones.

Common issues:

* Committing unintended changes
* Losing work during resets
* Confusion between local and remote state
* Improper branch handling

Understanding command scope and execution context is required for safe operation.

## Architecture Overview

Git operates across three primary zones:

* Working Directory — file edits
* Staging Area — change preparation
* Local Repository — committed history
* Remote Repository — shared state

Each command affects one or more of these zones.

## Lifecycle Flow

<div class="mermaid">
flowchart LR
  A[Working Directory] --> B[Staging Area]
  B --> C[Local Repository]
  C --> D[Remote Repository]
  D --> E[Pull Sync]
  E --> A
</div>

---

## Core Commands by Zone

### Repository Initialization

#### `git init`

Initializes a new local repository.

```bash
git init
```

**Where it operates**

* Creates `.git` directory
* Does NOT track files automatically
* Affects local repository only

**Typical use**

* Starting a new project
* Converting an existing folder into a repo

---

### Cloning

#### `git clone`

Creates a full local copy of a remote repository.

```bash
git clone <repo-url>
```

**Where it operates**

* Creates working directory
* Creates local repository
* Configures remote origin

**Typical use**

* Onboarding to an existing project
* Creating distributed copies

---

### Staging Changes

#### `git add`

Moves changes from working directory to staging area.

```bash
git add <file>
```

Add all files:

```bash
git add .
```

**Where it operates**

* Working Directory → Staging Area
* Does NOT create commits

**Typical use**

* Preparing specific files for commit
* Building atomic commits

---

### Checking Status

#### `git status`

Shows current repository state.

```bash
git status
```

**Where it operates**

* Read-only inspection
* Shows:

  * Untracked files
  * Modified files
  * Staged files

**Typical use**

* Before committing
* During conflict resolution

---

### Creating Commits

#### `git commit`

Creates an immutable snapshot from staged changes.

```bash
git commit -m "message"
```

**Where it operates**

* Staging Area → Local Repository
* Generates SHA-1 commit

**Typical use**

* Recording logical changes
* Creating history checkpoints

---

### Branch Management

#### List branches

```bash
git branch
```

#### Create branch

```bash
git branch <branch-name>
```

#### Switch branch

```bash
git checkout <branch-name>
```

Create and switch:

```bash
git checkout -b <branch-name>
```

#### Delete branch

```bash
git branch -d <branch-name>
```

**Where it operates**

* Local repository metadata
* Working directory context

**Typical use**

* Feature isolation
* Parallel development

---

### Remote Configuration

#### View remote

```bash
git remote -v
```

#### Add remote

```bash
git remote add origin <repo-url>
```

#### Remove remote

```bash
git remote remove origin
```

**Where it operates**

* Local repository config
* Does not move code

---

### Fetching

#### `git fetch`

Downloads remote changes without merging.

```bash
git fetch
```

**Where it operates**

* Remote → Local repository
* Working directory unchanged

**Typical use**

* Safe remote inspection
* Pre-merge review

---

### Pulling

#### `git pull`

Fetches and merges remote changes.

```bash
git pull
```

**Where it operates**

* Remote → Local repository
* Local repository → Working Directory

**Typical use**

* Synchronizing with team
* Updating local branch

---

### Pushing

#### `git push`

Uploads local commits to remote.

```bash
git push origin <branch>
```

**Where it operates**

* Local repository → Remote repository

**Typical use**

* Sharing changes
* Triggering CI/CD

---

## Conflict Resolution Commands

### Inspect merge conflicts

```bash
git log --merge
```

```bash
git diff
```

### Abort merge

```bash
git merge --abort
```

### Reset conflicted files

```bash
git reset
```

**Operational note**

Conflicts must be manually resolved before committing.

---

## Stash Workflow

Temporary storage for unfinished work.

### Stash changes

```bash
git stash
```

### List stashes

```bash
git stash list
```

### Apply stash

```bash
git stash apply
```

### Pop stash

```bash
git stash pop
```

### Drop stash

```bash
git stash drop
```

---

### Stash Flow

<div class="mermaid">
flowchart LR
  A[Working Changes] --> B[git stash]
  B --> C[Stash Stack]
  C --> D[git stash apply/pop]
  D --> E[Working Directory]
</div>

---

## History Manipulation

### Cherry Pick

Apply a specific commit to current branch.

```bash
git cherry-pick <commit-hash>
```

**Use carefully**

* Creates new commit hash
* Can duplicate history

---

### Rebase

Replay commits on a new base.

```bash
git rebase <branch>
```

**Primary goal**

* Maintain linear history

**Risk**

* Rewriting shared history

---

### Squash via Interactive Rebase

```bash
git rebase -i HEAD~n
```

**Use case**

* Combine multiple commits
* Clean PR history

---

## Implementation Notes

* Always review `git status` before commit
* Prefer `fetch` before `pull` in critical systems
* Avoid force push on shared branches
* Keep commits small and atomic
* Use branches per feature

---

## Operational Considerations

### Failure Modes

* Hard reset can destroy uncommitted work
* Force push rewrites shared history
* Stash is local only (not backed up)
* Long-lived branches increase conflicts

### Scaling Notes

* Enable branch protection
* Use CI on push
* Periodically prune stale branches
* Avoid committing large binaries

### Data Safety

* Remote is not a true backup
* Protect main branch
* Use meaningful commit messages
* Tag release points

---

## Conclusion

Git reliability depends on correct command usage within the repository lifecycle.
Understanding command scope prevents data loss and maintains clean collaborative history.
