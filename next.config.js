const withMDX = require('@next/mdx')({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx']
});

module.exports = nextConfig;