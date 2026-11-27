import Login from '../pages/Login';
import { ReceptionOverview, ReceptionQueue, PatientRegistration } from '../pages/Reception';
import { NursingOverview, TriageQueue, TriageForm, TriageHistory } from '../pages/Nursing';
import { MedicalOverview, MedicalQueue, MedicalRecord, MedicalHistory } from '../pages/Medical';
import { AdminOverview, AdminList, Reports } from '../pages/Admin';
import { EditUser, NewMovement, NewStockItem, NewSupplier, UserForm } from '../pages/AdminForms';
import { adminCreatePaths, adminListPaths, adminUserEditPath } from './navigation';

export const routes = [
  { path: '/', profile: null, render: () => <Login /> },
  { path: '/recepcao', profile: 'recepcao', render: () => <ReceptionOverview />, menu: { label: 'Visão geral', icon: 'house' } },
  { path: '/recepcao/atendimentos', profile: 'recepcao', render: () => <ReceptionQueue />, menu: { label: 'Atendimentos', icon: 'users' } },
  { path: '/recepcao/pacientes/novo', profile: 'recepcao', render: () => <PatientRegistration />, menu: { label: 'Pacientes', icon: 'user-round' } },
  { path: '/enfermagem', profile: 'enfermagem', render: () => <NursingOverview />, menu: { label: 'Visão geral', icon: 'house' } },
  { path: '/enfermagem/fila', profile: 'enfermagem', render: () => <TriageQueue />, menu: { label: 'Fila de triagem', icon: 'users' } },
  { path: '/enfermagem/ficha', profile: 'enfermagem', render: () => <TriageForm />, activePath: '/enfermagem/fila' },
  { path: '/enfermagem/registros', profile: 'enfermagem', render: () => <TriageHistory />, menu: { label: 'Registros de triagem', icon: 'clipboard-list' } },
  { path: '/medico', profile: 'medico', render: () => <MedicalOverview />, menu: { label: 'Visão geral', icon: 'house' } },
  { path: '/medico/fila', profile: 'medico', render: () => <MedicalQueue />, menu: { label: 'Fila de atendimento', icon: 'users' } },
  { path: '/medico/atendimento', profile: 'medico', render: () => <MedicalRecord />, activePath: '/medico/fila' },
  { path: '/medico/historico', profile: 'medico', render: () => <MedicalHistory />, menu: { label: 'Histórico de atendimentos', icon: 'file-text' } },
  { path: '/medico/registro', profile: 'medico', render: () => <MedicalRecord readOnly />, activePath: '/medico/historico' },
  { path: '/admin', profile: 'admin', render: () => <AdminOverview />, menu: { label: 'Visão geral', icon: 'layout-dashboard' } },
  { path: adminListPaths.estoque, profile: 'admin', render: () => <AdminList kind="estoque" />, menu: { label: 'Estoque', icon: 'package' } },
  { path: adminListPaths.movimentacoes, profile: 'admin', render: () => <AdminList kind="movimentacoes" />, menu: { label: 'Movimentações', icon: 'arrow-left-right' } },
  { path: adminListPaths.fornecedores, profile: 'admin', render: () => <AdminList kind="fornecedores" />, menu: { label: 'Fornecedores', icon: 'truck' } },
  { path: adminListPaths.usuarios, profile: 'admin', render: () => <AdminList kind="usuarios" />, menu: { label: 'Usuários', icon: 'users' } },
  { path: '/admin/relatorios', profile: 'admin', render: () => <Reports />, menu: { label: 'Relatórios', icon: 'chart-no-axes-column' } },
  { path: adminCreatePaths.usuarios, profile: 'admin', activePath: adminListPaths.usuarios, render: () => <UserForm /> },
  { path: adminUserEditPath, profile: 'admin', activePath: adminListPaths.usuarios, render: () => <EditUser /> },
  { path: adminCreatePaths.estoque, profile: 'admin', activePath: adminListPaths.estoque, render: () => <NewStockItem /> },
  { path: adminCreatePaths.fornecedores, profile: 'admin', activePath: adminListPaths.fornecedores, render: () => <NewSupplier /> },
  { path: adminCreatePaths.movimentacoes, profile: 'admin', activePath: adminListPaths.movimentacoes, render: () => <NewMovement /> },
];
