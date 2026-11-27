export const sectors = {
  recepcao: {
    label: 'Recepção', role: 'Recepcionista', subtitle: 'Atendimento e recepção',
    start: '/recepcao',
  },
  enfermagem: {
    label: 'Enfermagem', role: 'Enfermeiro(a)', subtitle: 'Policlínica',
    start: '/enfermagem',
  },
  medico: {
    label: 'Área médica', role: 'Médico(a)', subtitle: 'Policlínica',
    start: '/medico',
  },
  admin: {
    label: 'Administração', role: 'Administrador', subtitle: 'Gestão administrativa',
    start: '/admin',
  },
};

export const adminListPaths = {
  estoque: '/admin/estoque',
  movimentacoes: '/admin/movimentacoes',
  fornecedores: '/admin/fornecedores',
  usuarios: '/admin/usuarios',
};

export const adminCreatePaths = {
  estoque: `${adminListPaths.estoque}/novo`,
  movimentacoes: `${adminListPaths.movimentacoes}/nova`,
  fornecedores: `${adminListPaths.fornecedores}/novo`,
  usuarios: `${adminListPaths.usuarios}/novo`,
};

export const adminUserEditPath = `${adminListPaths.usuarios}/:userId?/editar`;
