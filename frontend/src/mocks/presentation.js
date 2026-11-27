const presentationFlag = import.meta.env.VITE_RITA_DADOS_SINTETICOS;
export const showPresentationData = presentationFlag === undefined ? import.meta.env.DEV : presentationFlag === 'true';

export const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

export function dateFromToday(offset) {
  const date = new Date(today + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function formatDate(date) {
  return date ? date.split('-').reverse().join('/') : '—';
}

export function presentationStats(items) {
  return items.map(([title, value, note]) => ({ title, value: showPresentationData ? value : undefined, note }));
}
