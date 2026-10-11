// Brand marks bundled with the app (no CDN calls). Missing keys fall back to a glyph or monogram in <Logo>.
import { siPython, siTypescript, siJavascript, siNodedotjs, siGit, siDocker, siLinux, siScikitlearn, siSelenium, siFigma, siNvidia, siSap,
  siPalantir, siGoogle, siSnowflake, siDatabricks, siDataiku, siOdoo, siTechcrunch, siYcombinator } from 'simple-icons';
import { siOracle, siSalesforce, siVisualstudiocode, siVisualstudio } from 'si11'; // dropped from newer simple-icons releases

export const LOGOS = {
  python: siPython, typescript: siTypescript, javascript: siJavascript, nodejs: siNodedotjs, git: siGit, docker: siDocker, linux: siLinux,
  scikitlearn: siScikitlearn, selenium: siSelenium, figma: siFigma, nvidia: siNvidia, sap: siSap, palantir: siPalantir, google: siGoogle, snowflake: siSnowflake,
  databricks: siDatabricks, dataiku: siDataiku, odoo: siOdoo, techcrunch: siTechcrunch, ycombinator: siYcombinator, oracle: siOracle, salesforce: siSalesforce, vscode: siVisualstudiocode, visualstudio: siVisualstudio,
};
