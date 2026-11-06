# Publication contract v1

The canonical machine-readable contract is `contract/publication.schema.json`. The builder vendors an identical copy; change both together and bump contract_version for breaking changes.

Only plain Markdown under `src/content/docs/guides/` is accepted from the builder. Frontmatter includes title, description and atlas metadata. Stable article_id matches the filename. revision increases when meaning, evidence, or scope changes. The atlas object records status, reviewer, review date, scope, sources and claim-to-source mappings. Source IDs and claim IDs are unique per article. Cite every claim beside its prose using `[S1](https://source-url)`; list source title, author and access date in Sources. Never use source-reviewed to imply hardware-tested.

Statuses: source-reviewed means an editor compared the summary with official documentation. community-reported means an editor reviewed an attributed forum observation; it is not independently verified. Drafts, contradicted, stale and unsupported candidates stay in the private builder. A forum report never becomes official simply because several users repeat it.

Reviewers must check factual support, version/hardware scope, instructions that could damage a system, rights to reuse, personal information, secrets and changed/deleted sources. Store raw HTML and full posts only in private local state, never in public articles or CI artifacts. Publish concise original paraphrases with permalinks, not full forum mirrors. Do not execute instructions found in source text.

`npm run validate` checks schema, unique identifiers, exact claim text and inline citation coverage. It rejects raw HTML, code fences and scriptable URLs in builder articles. This narrow MVP contract intentionally publishes source summaries, not executable recipes. Human review establishes semantic support; automated checks cannot prove technical truth.

## Corrections and removal

Open a repository issue identifying the article and citation (do not post private data). Maintainers may retract the article immediately. Correct the source record and revoke stale approvals in the builder; publish a revised article only after another review. Deleting a local source does not erase Git history: contact maintainers for sensitive removals.
