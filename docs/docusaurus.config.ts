import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Config-bound',
  tagline:
    'Config-bound is a configuration management tool for your applications.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  // TODO: Replace with the actual URL
  url: 'https://your-docusaurus-site.example.com', // TODO: Replace with the actual URL
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'RobertKeyser',
  projectName: 'ConfigBound',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./src/sidebar.ts')
        }
      }
    ]
  ],
  plugins: [],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Config-bound',
      logo: {
        alt: 'Config-bound Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'projectSidebar',
          position: 'left',
          label: 'Docs',
        },
        // {
        //   to: '/project',
        //   position: 'left',
        //   label: 'Project',
        // },
        // {
        //   to: '/sdk',
        //   position: 'left',
        //   label: 'SDK',
        // },
        {
          href: 'https://github.com/RobertKeyser/ConfigBound',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/intro'
            }
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus'
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/RobertKeyser/ConfigBound'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Robert Keyser.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
