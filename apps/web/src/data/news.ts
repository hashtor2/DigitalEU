// Sample news articles for homepage rotation
// Format: ISO date string, title, and source link

export const SAMPLE_NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'EU Tightens Digital Sovereignty Rules for Tech Companies',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://ec.europa.eu/commission/presscorner',
  },
  {
    id: 'news-2',
    title: 'Proton Mail Expands End-to-End Encryption to Calendar Services',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://proton.me/blog',
  },
  {
    id: 'news-3',
    title: 'GDPR Enforcement Actions Reach Record High Across Europe',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    link: 'https://www.iabhub.eu',
  },
];
