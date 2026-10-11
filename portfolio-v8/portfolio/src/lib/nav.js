// Single source of truth for "where does a nav item scroll to".
export const NAV = ['projects', 'about', 'skills', 'read', 'play'];

export function navTarget(id) {
  if (id === 'projects') return 0;
  const el = document.getElementById(id);
  return el ? el.getBoundingClientRect().top + window.scrollY : null;
}
