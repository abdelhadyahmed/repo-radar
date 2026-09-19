import type { GitHubRepo, GitHubSearchResponse, SearchSort } from "@repo-radar/types";
import { client } from "../github-client";

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
