// Contact links used by the About section, the fixed dock and the certification links.
export const EMAIL = 'axel.djatmiko@gmail.com';
export const LINKS = [
  { key: 'mail', label: 'Email', href: `mailto:${EMAIL}` },
  { key: 'github', label: 'GitHub', href: 'https://github.com/AMarD-stack' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/axel-marvio-djatmiko-b69810193/' },
];
export const LINKEDIN = LINKS[2].href;
export const isExternal = (href) => /^https?:/.test(href);
export const extProps = (href) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
