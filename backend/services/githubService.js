const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  }
});

/**
 * Fetches interesting GitHub metrics for the user's dashboard.
 */
const getProjectSummary = async () => {
  if (!GITHUB_TOKEN) return null;

  try {
    const [user, repos] = await Promise.all([
      githubClient.get('/user'),
      githubClient.get('/user/repos?sort=updated&per_page=5')
    ]);

    return {
      username: user.data.login,
      name: user.data.name,
      avatar: user.data.avatar_url,
      public_repos: user.data.public_repos,
      latest_activity: repos.data.map(repo => ({
        name: repo.name,
        description: repo.description,
        updated_at: repo.updated_at,
        stars: repo.stargazers_count,
        url: repo.html_url
      }))
    };
  } catch (error) {
    console.error('[GITHUB-SERVICE] Error fetching data:', error.message);
    return null;
  }
};

module.exports = {
  getProjectSummary
};
