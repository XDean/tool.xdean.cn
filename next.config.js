const withPlugins = require('next-compose-plugins');
const withMDX = require('@next/mdx');

module.exports = withPlugins([
  [withMDX({
      extension: /\.(md|mdx)$/,
      options: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    }
  )],
  {
    pageExtensions: ['tsx', 'mdx']
  }
])