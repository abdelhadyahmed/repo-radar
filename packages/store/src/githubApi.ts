import axios from 'axios';
import type {
  GitHubCommit,
  GitHubRepo,
  GitHubSearchResponse,
  RepositoryRef,
  RepositorySnapshot,
  SearchSort,
} from '@repo-radar/types';

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github+json' },
});

/** Axios says "Request failed with status code 403"; a user needs better. */
function toFriendlyError(error: unknown): Error {
  if (!axios.isAxiosError(error)) {
    return new Error('GitHub request failed.');
  }

  if (!error.response) {
    return new Error('Could not reach GitHub. Check your connection.');
  }

  const status = error.response.status;

  // Unauthenticated GitHub allows 60 requests an hour, so a 403 is virtually
  // always that ceiling rather than a permissions problem.
  if (status === 403) {
    return new Error('GitHub rate limit reached. Try again in a few minutes.');
  }

  if (status === 404) {
    return new Error('Not found on GitHub.');
  }

  return new Error(`GitHub request failed (${status}).`);
}

// Runs on every failed response, so the functions below can stay free of
// error handling.
client.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }
  return Promise.reject(toFriendlyError(error));
});

export async function searchRepos(
  query: string,
  sort: SearchSort,
  signal?: AbortSignal,
): Promise<GitHubRepo[]> {
  const params: Record<string, string> = { q: query, per_page: '20' };

  // Every sort but 'best-match' is named the same in the API; 'best-match' is
  // GitHub's default and is expressed by omitting the param entirely.
  if (sort !== 'best-match') {
    params.sort = sort;
    params.order = 'desc';
  }

  const response = await client.get<GitHubSearchResponse>('/search/repositories', {
    params,
    signal,
  });

  return response.data.items;
}

/** Re-reads a tracked repository: its current stats plus its latest commit. */
export async function getSnapshot(
  ref: RepositoryRef,
  signal?: AbortSignal,
): Promise<RepositorySnapshot> {
  const path = `/repos/${encodeURIComponent(ref.owner)}/${encodeURIComponent(ref.name)}`;

  const repoRequest = client.get<GitHubRepo>(path, { signal });

  const commitRequest = client
    .get<GitHubCommit[]>(`${path}/commits`, { params: { per_page: '1' }, signal })
    .catch(() => null);

  const [repoResponse, commitResponse] = await Promise.all([repoRequest, commitRequest]);

  let lastCommit: GitHubCommit | null = null;
  if (commitResponse && commitResponse.data.length > 0) {
    lastCommit = commitResponse.data[0];
  }

  return { repository: repoResponse.data, lastCommit };
}
