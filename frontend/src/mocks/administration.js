import { dateFromToday, showPresentationData, today } from './presentation';

export const units = showPresentationData ? ['Policlínica — Unidade Central'] : [];
export const locations = showPresentationData ? ['Almoxarifado central', 'Depósito de apoio', 'Sala de procedimentos'] : [];

export const users = showPresentationData ? [
  { id: 'USR-101', name: 'Iara Lagoaestrela', email: 'iara.lagoaestrela@rita.invalid', username: 'iara.lagoaestrela', profile: 'Recepção', unit: units[0], status: 'Ativa' },
  { id: 'USR-102', name: 'Nina Luzcoral', email: 'nina.luzcoral@rita.invalid', username: 'nina.luzcoral', profile: 'Enfermagem', unit: units[0], status: 'Ativa' },
  { id: 'USR-103', name: 'Eva Nuvemleste', email: 'eva.nuvemleste@rita.invalid', username: 'eva.nuvemleste', profile: 'Médico', unit: units[0], status: 'Ativa' },
  { id: 'USR-104', name: 'Teo Arcoverde', email: 'teo.arcoverde@rita.invalid', username: 'teo.arcoverde', profile: 'Administração', unit: units[0], status: 'Ativa' },
  { id: 'USR-105', name: 'Lumi Brisasul', email: 'lumi.brisasul@rita.invalid', username: 'lumi.brisasul', profile: 'Recepção', unit: units[0], status: 'Inativa' },
] : [];

export const suppliers = showPresentationData ? [
  { id: 'FOR-101', name: 'Ipê Lunar Suprimentos', city: 'Recife / PE', status: 'Ativo' },
  { id: 'FOR-102', name: 'Maré de Âmbar Materiais', city: 'Olinda / PE', status: 'Ativo' },
  { id: 'FOR-103', name: 'Estuário Claro Distribuição', city: 'Paulista / PE', status: 'Inativo' },
] : [];

const catalog = [
  { id: 'EST-101', name: 'Luvas de procedimento M', category: 'Insumo', unit: 'Caixa', opening: 22, minimum: 12, expiryDays: 210 },
  { id: 'EST-102', name: 'Compressa de gaze', category: 'Insumo', unit: 'Pacote', opening: 18, minimum: 20, expiryDays: 24 },
  { id: 'EST-103', name: 'Papel para maca', category: 'Material', unit: 'Rolo', opening: 30, minimum: 10 },
  { id: 'EST-104', name: 'Máscara de procedimento', category: 'Insumo', unit: 'Caixa', opening: 32, minimum: 10, expiryDays: 160 },
  { id: 'EST-105', name: 'Etiquetas de identificação', category: 'Material', unit: 'Rolo', opening: 28, minimum: 8 },
];

const ledger = [
  { id: 'MOV-205', itemId: 'EST-101', type: 'Entrada', quantity: 24, delta: 24, day: 0, time: '09:10', supplierId: 'FOR-101', destination: 'Almoxarifado central' },
  { id: 'MOV-204', itemId: 'EST-102', type: 'Saída', quantity: 6, delta: -6, day: 0, time: '08:40', from: 'Almoxarifado central', destination: 'Sala de procedimentos' },
  { id: 'MOV-203', itemId: 'EST-103', type: 'Transferência', quantity: 8, delta: 0, day: -1, time: '15:20', from: 'Almoxarifado central', destination: 'Depósito de apoio' },
  { id: 'MOV-202', itemId: 'EST-104', type: 'Entrada', quantity: 12, delta: 12, day: -2, time: '10:15', supplierId: 'FOR-102', destination: 'Almoxarifado central' },
  { id: 'MOV-201', itemId: 'EST-105', type: 'Ajuste', quantity: 3, delta: -3, day: -3, time: '16:05', from: 'Almoxarifado central' },
];

export const movements = showPresentationData ? ledger.map(entry => ({
  ...entry,
  item: catalog.find(item => item.id === entry.itemId).name,
  date: dateFromToday(entry.day),
  origin: entry.from ?? suppliers.find(supplier => supplier.id === entry.supplierId)?.name,
  status: 'Concluída',
})) : [];

export const stock = showPresentationData ? catalog.map(item => {
  const balance = movements.filter(entry => entry.itemId === item.id)
    .reduce((total, entry) => total + entry.delta, item.opening);
  const expiry = item.expiryDays ? dateFromToday(item.expiryDays) : undefined;
  return { ...item, balance, expiry, status: balance < item.minimum ? 'Estoque baixo' : 'Regular' };
}) : [];

export const recentMovements = movements.filter(entry => entry.date >= dateFromToday(-6) && entry.date <= today);
export const lowStock = stock.filter(item => item.balance < item.minimum);
export const expiringStock = stock.filter(item => item.expiry && item.expiry <= dateFromToday(30));

export const adminMetrics = {
  lowStock: lowStock.length,
  expiring: expiringStock.length,
  blocked: stock.filter(item => item.status === 'Bloqueado').length,
  available: stock.filter(item => item.balance > 0 && item.status !== 'Bloqueado').length,
  entries: movements.filter(entry => entry.type === 'Entrada').length,
  exits: movements.filter(entry => entry.type === 'Saída').length,
  transfers: movements.filter(entry => entry.type === 'Transferência').length,
  adjustments: movements.filter(entry => entry.type === 'Ajuste').length,
};
