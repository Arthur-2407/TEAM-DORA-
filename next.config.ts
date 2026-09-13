import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '';
const basePath = repoName || '/TEAM-DORA-';

const nextConfig: NextConfig = {
  // Only apply static export and repository subpath when building for GitHub Pages
  ...(isGithubActions && {
    output: 'export',
    basePath: basePath,
    trailingSlash: true,
    env: {
      NEXT_PUBLIC_BASE_PATH: basePath,
    },
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

