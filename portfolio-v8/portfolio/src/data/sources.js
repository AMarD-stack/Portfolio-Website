// "Read with me": ordered for a founder's point of view, one theme per row of five:
//   1 venture & startups  2 data & AI platforms  3 enterprise software & analysts  4 strategy & markets  5 policy, impact & independent voices
// `k` = bundled brand mark (lib/logos.js); `img` = your own logo file in /public/logos (wide wordmarks get a wider chip). Tiles without one load the site's own icon at runtime and fall back to a text badge `b`.
export const SOURCES = [
  // 1 — venture & startups
  { n: 'Y Combinator', u: 'https://www.ycombinator.com', k: 'ycombinator', b: 'YC' },
  { n: 'a16z', u: 'https://a16z.com', b: 'a16z' },
  { n: 'Index Ventures', u: 'https://www.indexventures.com', b: 'IV' },
  { n: 'East Ventures', u: 'https://east.vc', b: 'EV' },
  { n: 'AlphaJWC', u: 'https://alphajwc.com', b: 'AJ' },
  // 2 — data & AI platforms
  { n: 'Palantir', u: 'https://www.palantir.com', k: 'palantir', b: 'PL' },
  { n: 'Databricks', u: 'https://www.databricks.com', k: 'databricks', b: 'DB' },
  { n: 'Snowflake', u: 'https://www.snowflake.com', k: 'snowflake', b: 'SF' },
  { n: 'Dataiku', u: 'https://www.dataiku.com', k: 'dataiku', b: 'DK' },
  { n: 'SAP', u: 'https://www.sap.com', k: 'sap', b: 'SAP' },
  // 3 — enterprise software & analysts
  { n: 'Salesforce', u: 'https://www.salesforce.com', k: 'salesforce', b: 'SF' },
  { n: 'Oracle', u: 'https://www.oracle.com', k: 'oracle', b: 'OR' },
  { n: 'Odoo', u: 'https://www.odoo.com', k: 'odoo', b: 'OD' },
  { n: 'Mekari', u: 'https://www.mekari.com', b: 'MK' },
  { n: 'Gartner', u: 'https://www.gartner.com', b: 'GT' },
  // 4 — strategy & markets
  { n: 'McKinsey', u: 'https://www.mckinsey.com', b: 'McK' },
  { n: 'BCG', u: 'https://www.bcg.com', b: 'BCG' },
  { n: 'PwC', u: 'https://www.pwc.com', b: 'PwC' },
  { n: 'EY', u: 'https://www.ey.com', b: 'EY' },
  { n: 'Bloomberg', u: 'https://www.bloomberg.com', b: 'Bb' },
  // 5 — policy, impact & independent voices
  { n: 'World Economic Forum', u: 'https://www.weforum.org', b: 'WEF' },
  { n: 'Teach For Indonesia', u: 'https://www.teachforindonesia.org', img: '/logos/tfi.png', b: 'TFI' },
  { n: 'Happy Hearts Indonesia', u: 'https://happyheartsindonesia.org', b: 'HHI' },
  { n: 'thewokesalaryman', sub: 'blog', u: 'https://thewokesalaryman.substack.com', b: 'WS' },
];
