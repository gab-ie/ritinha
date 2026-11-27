import { Button, Card, Field, Filters, FormActions, FormGrid, PageHead, RecordLabel, RecordStatus, RecordTable, SectionBlock, Shortcut, Stats } from '../components/UI';
import { attendanceMetrics as metrics, steps, todayAttendances } from '../mocks/attendance';
import { presentationStats } from '../mocks/presentation';

const overviewStats = presentationStats([
  ['Pacientes registrados', metrics.patients],
  ['Em fila de espera', metrics.waitingTriage + metrics.waitingConsultation],
  ['Finalizados hoje', metrics.completed],
]);

const flowStats = presentationStats([
  ['Chegadas hoje', metrics.arrivals],
  ['Aguardando triagem', metrics.waitingTriage],
  ['Atendimento médico', metrics.inConsultation],
  ['Concluídos', metrics.completed],
]);

export function ReceptionOverview(){return <>
  <PageHead title="Visão Geral" description="Bom dia! Confira o movimento da unidade hoje."/>
  <Stats items={overviewStats}/>
  <Card title="Movimentação do dia" description="Resumo das etapas acompanhadas."><Stats items={flowStats}/></Card>
  <Card title="Acesso rápido" description="Atalhos para ações frequentes da recepção."><div className="shortcut-grid">
    <Shortcut title="Novo cadastro" text="Registrar paciente no sistema." icon="user-round" to="/recepcao/pacientes/novo"/>
    <Shortcut title="Consultar pacientes" text="Buscar e visualizar atendimentos." icon="users" to="/recepcao/atendimentos"/>
    <Shortcut title="Acompanhar recepção" text="Monitorar fila e situação." icon="clipboard-list" to="/recepcao/atendimentos"/>
  </div></Card>
  <Card title="Últimas atualizações" description="Registros de chegada mais recentes.">
    <RecordTable columns={['CHEGADA','PACIENTE','ATENDIMENTO']} rows={todayAttendances.slice(0, 4).map(entry => ({
      id: entry.id, cells: [entry.arrival, <RecordLabel title={entry.patient} detail={entry.patientId}/>, entry.id],
    }))} title="Nenhuma atualização registrada" description="As atividades administrativas recentes serão exibidas aqui." />
  </Card>
</>}

export function ReceptionQueue(){return <>
  <PageHead title="Atendimento e recepção" description="Consulta de atendimentos e acompanhamento das chegadas." action={<Button to="/recepcao/pacientes/novo" icon="plus">Novo cadastro</Button>}/>
  <Card><Filters search="Buscar por nome ou CPF..." fields={[]} />
  <RecordTable columns={['PACIENTE','CPF','CHEGADA','SITUAÇÃO','ATENDIMENTO','AÇÃO']} rows={todayAttendances.map(entry => ({
    id: entry.id,
    cells: [<RecordLabel title={entry.patient} detail={entry.patientId}/>, null, entry.arrival,
      <RecordStatus tone={entry.step === steps.completed ? 'complete' : 'neutral'}>{entry.step}</RecordStatus>, entry.id, null],
  }))} title="Nenhum atendimento registrado" description="Os atendimentos da recepção serão exibidos aqui." /></Card>
</>}

export function PatientRegistration(){return <>
  <PageHead title="Cadastro de Paciente" description="Preencha os dados para registrar um novo paciente no sistema." />
  <p className="helper-banner">Campos marcados com * são obrigatórios. Os demais podem ser preenchidos posteriormente.</p>
  <form onSubmit={e=>e.preventDefault()}>
  <SectionBlock number="1" title="Dados pessoais" subtitle="Informações básicas do paciente para identificação e registro."><FormGrid>
    <Field label="Nome completo" required placeholder="Nome completo"/>
    <Field label="CPF" required placeholder="000.000.000-00"/>
    <Field label="Data de nascimento" type="date" required/>
    <Field label="Nome social" placeholder="Informe o nome social, se aplicável"/>
    <Field label="Sexo" options={['Feminino','Masculino','Não informado']} />
    <Field label="Estado civil" options={['Solteiro(a)','Casado(a)','Divorciado(a)','Viúvo(a)','Não informado']}/>
  </FormGrid></SectionBlock>
  <SectionBlock number="2" title="Informações de contato" subtitle="Dados para comunicação, localização e acompanhamento administrativo."><FormGrid>
    <Field label="Telefone" type="tel"/><Field label="E-mail" type="email" placeholder="Informe o e-mail"/><Field label="CEP"/>
    <Field label="Endereço"/><Field label="Número"/><Field label="Bairro"/><Field label="Cidade"/><Field label="Estado" options={['PE','AL','PB','BA','Outros']}/>
  </FormGrid></SectionBlock>
  <FormActions back="/recepcao/atendimentos" backLabel="Cancelar" submitLabel="Salvar cadastro"/>
  </form></>}
