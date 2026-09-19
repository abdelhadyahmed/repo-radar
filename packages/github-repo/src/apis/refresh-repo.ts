import type { GitHubCommit, GitHubRepo, RepositoryRef, RepositorySnapshot } from "@repo-radar/types";
import { client } from "../github-client";

/** Re-reads a tracked repository: its current stats plus its latest commit. */
export async function refresh(
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
