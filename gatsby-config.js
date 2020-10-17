module.exports = {
  siteMetadata: {
    title: `Hic sunt dracones`,
    name: `Javier Zapata`,
    siteUrl: `https://javi.io`,
    description: `Divagando sobre mi vida explorando el mundo de la tecnología.`,
    hero: {
      heading: `Divagando sobre mi vida explorando el mundo de la tecnología.`,
      maxWidth: 652
    },
    social: [
      {
        name: `linkedin`,
        url: `https://www.linkedin.com/in/jzfgo`
      },
      {
        name: `github`,
        url: `https://github.com/jzfgo`
      },
      {
        name: `twitter`,
        url: `https://twitter.com/jzfgo`
      },
      {
        name: `instagram`,
        url: `https://instagram.com/jzfgo`
      },
    ]
  },
  plugins: [
    {
      resolve: '@narative/gatsby-theme-novela',
      options: {
        contentPosts: 'content/posts',
        contentAuthors: 'content/authors',
        basePath: '/',
        authorsPage: true,
        sources: {
          local: true
          // contentful: true,
        }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Hic sunt dracones`,
        short_name: `Dracones`,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: `src/assets/favicon.png`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-7695020-1',
        head: false,
        anonymize: true,
        respectDNT: true,
        exclude: [],
        pageTransitionDelay: 0,
        cookieDomain: 'javi.io'
      }
    }
  ]
};
