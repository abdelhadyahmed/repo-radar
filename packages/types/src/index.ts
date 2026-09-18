export type SearchSort = 'best-match' | 'stars' | 'forks' | 'updated';

/** The subset of GitHub's repository payload this app actually reads. */
export interface GitHubRepo {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  license: { spdx_id: string | null } | null;
  archived: boolean;
  fork: boolean;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  owner: { login: string; avatar_url: string } | null;
}

/** Response shape of GET /search/repositories. */
export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

/** Minimal identity of a repository: everything needed to address its endpoints. */
export interface RepositoryRef {
  owner: string;
  name: string;
}

/** The subset of GitHub's commit payload this app actually reads. */
export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    /** Absent on commits with unparseable git metadata. */
    author: { name: string; email: string; date: string } | null;
  };
  /** Null when the git author has no matching GitHub account. */
  author: { login: string; avatar_url: string } | null;
}

/** A repository plus its latest commit, read together as of one moment. */
export interface RepositorySnapshot {
  repository: GitHubRepo;
  lastCommit: GitHubCommit | null;
}
export type RepositoryId = string;
export interface Repository {
  id: RepositoryId;
  ref: RepositoryRef;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  ownerAvatarUrl: string;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  language: string | null;
  topics: string[];
  license: string | null;
  isArchived: boolean;
  isFork: boolean;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
}

export interface CommitSummary {
  sha: string;
  shortSha: string;
  message: string;
  date: string | null;
  authorName: string | null;
  htmlUrl: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
