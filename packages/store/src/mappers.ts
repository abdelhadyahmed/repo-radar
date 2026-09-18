import type {
    CommitSummary,
    GitHubCommit,
    GitHubRepo,
    Repository,
    RepositoryId,
    RepositoryRef,
} from '@repo-radar/types';

/** GitHub treats owner/name case-insensitively, so the key must too. */
export function repoId(ref: RepositoryRef): RepositoryId {
    return `${ref.owner}/${ref.name}`.toLowerCase();
}

/** `full_name` is already "owner/name", so this agrees with `repoId` by construction. */
export function repoIdFromFullName(fullName: string): RepositoryId {
    return fullName.toLowerCase();
}

/** Turns a GitHub payload into the domain model the app stores and renders. */
export function mapRepo(repo: GitHubRepo): Repository {
    const [owner, name] = repo.full_name.split('/');
    const ref: RepositoryRef = { owner, name };

    return {
        id: repoId(ref),
        ref,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        homepage: repo.homepage,
        ownerAvatarUrl: repo.owner?.avatar_url ?? '',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        watchers: repo.watchers_count,
        language: repo.language,
        topics: repo.topics ?? [],
        license: repo.license?.spdx_id ?? null,
        isArchived: repo.archived,
        isFork: repo.fork,
        defaultBranch: repo.default_branch,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
    };
}

/** Turns a GitHub commit payload into the summary a card can render. */
export function mapCommit(commit: GitHubCommit): CommitSummary {
    const author = commit.commit.author;

    return {
        sha: commit.sha,
        shortSha: commit.sha.slice(0, 7),
        message: commit.commit.message.split('\n')[0],
        date: author?.date ?? null,
        authorName: author?.name ?? commit.author?.login ?? null,
        htmlUrl: commit.html_url,
    };
}
