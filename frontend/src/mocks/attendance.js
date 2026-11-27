import { dateFromToday, showPresentationData, today } from './presentation';

const patients = {
  'PAC-101': 'Lia Valeclaro',
  'PAC-102': 'Ravi Solnorte',
  'PAC-103': 'Ina Brisavale',
  'PAC-104': 'Caio Rioalto',
  'PAC-105': 'Nara Ventoclaro',
  'PAC-106': 'Bela Camposol',
  'PAC-107': 'Noa Serramar',
  'PAC-108': 'Mila Ponteazul',
};

// Horários e etapas operacionais. O conjunto não contém dados de avaliação clínica.
const schedule = [
  { id: 'AT-2408', patientId: 'PAC-108', day: 0, arrival: '09:42' },
  { id: 'AT-2407', patientId: 'PAC-107', day: 0, arrival: '09:35' },
  { id: 'AT-2406', patientId: 'PAC-106', day: 0, arrival: '09:25', triageStart: '09:38' },
  { id: 'AT-2405', patientId: 'PAC-105', day: 0, arrival: '09:12', triageStart: '09:19', triageEnd: '09:28' },
  { id: 'AT-2404', patientId: 'PAC-104', day: 0, arrival: '08:58', triageStart: '09:08', triageEnd: '09:17' },
  { id: 'AT-2403', patientId: 'PAC-103', day: 0, arrival: '08:41', triageStart: '08:50', triageEnd: '09:00', consultationStart: '09:21' },
  { id: 'AT-2402', patientId: 'PAC-102', day: 0, arrival: '08:20', triageStart: '08:30', triageEnd: '08:39', consultationStart: '08:55', consultationEnd: '09:14' },
  { id: 'AT-2401', patientId: 'PAC-101', day: 0, arrival: '08:05', triageStart: '08:13', triageEnd: '08:22', consultationStart: '08:35', consultationEnd: '08:54' },
  { id: 'AT-2396', patientId: 'PAC-105', day: -1, arrival: '14:10', triageStart: '14:22', triageEnd: '14:31', consultationStart: '14:48', consultationEnd: '15:04' },
  { id: 'AT-2389', patientId: 'PAC-102', day: -2, arrival: '10:05', triageStart: '10:13', triageEnd: '10:20', consultationStart: '10:43', consultationEnd: '11:02' },
];

export const steps = {
  waitingTriage: 'Aguardando triagem',
  inTriage: 'Em triagem',
  waitingConsultation: 'Aguardando consulta',
  inConsultation: 'Em consulta',
  completed: 'Concluído',
};

function currentStep(entry) {
  if (entry.consultationEnd) return steps.completed;
  if (entry.consultationStart) return steps.inConsultation;
  if (entry.triageEnd) return steps.waitingConsultation;
  if (entry.triageStart) return steps.inTriage;
  return steps.waitingTriage;
}

export const attendances = showPresentationData ? schedule.map(entry => ({
  ...entry,
  patient: patients[entry.patientId],
  date: dateFromToday(entry.day),
  step: currentStep(entry),
  triageStaff: entry.triageStart ? 'Nina Luzcoral' : undefined,
  consultationStaff: entry.consultationStart ? 'Eva Nuvemleste' : undefined,
  destination: entry.triageEnd ? 'Atendimento médico' : undefined,
})) : [];

export const todayAttendances = attendances.filter(entry => entry.date === today);
export const triageQueue = todayAttendances.filter(entry => !entry.triageEnd)
  .sort((first, second) => first.arrival.localeCompare(second.arrival));
export const triageHistory = attendances.filter(entry => entry.triageEnd);
export const medicalQueue = todayAttendances.filter(entry => entry.triageEnd && !entry.consultationEnd)
  .sort((first, second) => first.triageEnd.localeCompare(second.triageEnd));
export const medicalHistory = attendances.filter(entry => entry.consultationEnd);

const count = step => todayAttendances.filter(entry => entry.step === step).length;
const started = todayAttendances.filter(entry => entry.triageStart);
const toMinutes = time => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const waitingMinutes = started.reduce(
  (total, entry) => total + toMinutes(entry.triageStart) - toMinutes(entry.arrival), 0,
);

export const attendanceMetrics = {
  patients: new Set(attendances.map(entry => entry.patientId)).size,
  arrivals: todayAttendances.length,
  waitingTriage: count(steps.waitingTriage),
  inTriage: count(steps.inTriage),
  triageStarted: started.length,
  triaged: todayAttendances.filter(entry => entry.triageEnd).length,
  meanTriageWait: started.length ? `${Math.round(waitingMinutes / started.length)} min` : undefined,
  triageTeam: new Set(started.map(entry => entry.triageStaff)).size,
  waitingConsultation: count(steps.waitingConsultation),
  inConsultation: count(steps.inConsultation),
  completed: count(steps.completed),
  emergency: todayAttendances.filter(entry => entry.destination === 'Emergência').length,
};

export function attendancePath(path, entry) {
  return entry ? `${path}?atendimento=${encodeURIComponent(entry.id)}` : path;
}

export function selectedAttendance(records, searchParams) {
  const id = searchParams.get('atendimento');
  return id === null ? records[0] : records.find(entry => entry.id === id);
}
