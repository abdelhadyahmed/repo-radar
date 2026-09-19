import axios from 'axios';

export const client = axios.create({
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
