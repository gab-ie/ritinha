import { useSearchParams } from 'react-router';
import { Button, Card, Field, Filters, FormActions, FormGrid, PageHead, RecordLabel, RecordStatus, RecordTable, SectionBlock, Shortcut, Stats } from '../components/UI';
import { attendanceMetrics as metrics, attendancePath, selectedAttendance, triageHistory, triageQueue } from '../mocks/attendance';
import { formatDate, presentationStats, showPresentationData } from '../mocks/presentation';

const activityStats = presentationStats([
  ['Entradas no setor', metrics.arrivals], ['Triagens iniciadas', metrics.triageStarted],
  ['Encaminhamentos', metrics.triaged], ['Média de espera', metrics.meanTriageWait],
  ['Atendimentos concluídos', metrics.completed], ['Equipe em atuação', metrics.triageTeam],
]);

const queueStats = presentationStats([
  ['Aguardando triagem', metrics.waitingTriage], ['Em triagem', metrics.inTriage],
  ['Triagens concluídas hoje', metrics.triaged],
]);

export function NursingOverview(){return <>
  <PageHead title="Visão Geral" description="Bom dia! Confira as atividades da enfermagem hoje."/>
  <Stats items={queueStats}/>
  <Card title="Atividades da Enfermagem" description="Resumo visual da movimentação do setor durante o dia.">
    <Stats items={activityStats}/></Card>
  <Card title="Acesso rápido" description="Atalhos para as principais funcionalidades do setor."><div className="shortcut-grid">
    <Shortcut title="Acessar fila de triagem" text="Gerenciar pacientes aguardando atendimento." icon="users" to="/enfermagem/fila"/>
    <Shortcut title="Consultar registros de triagem" text="Acompanhar histórico e evolução." icon="clipboard-list" to="/enfermagem/registros" cta="Consultar" />
    <Shortcut title="Visualizar pacientes aguardando" text="Verificar demanda pendente do setor." icon="house" to="/enfermagem/fila"/>
  </div></Card>
  <Card title="Últimas atividades" description="Registros recentes da equipe de enfermagem.">
    <RecordTable columns={['PACIENTE','ATENDIMENTO','FINALIZAÇÃO','DIRECIONAMENTO']} rows={triageHistory.slice(0, 4).map(entry => ({
      id: entry.id, cells: [entry.patient, entry.id, `${formatDate(entry.date)} · ${entry.triageEnd}`, entry.destination],
    }))} title="Nenhuma atividade registrada" description="Os registros recentes serão exibidos aqui."/>
  </Card>
</>}
export function TriageQueue(){return <>
  <PageHead title="Painel de Enfermagem" description="Classificação de risco e organização da fila de triagem." />
  <Stats items={queueStats}/>
  <Card title="Fila de triagem" description="Pacientes encaminhados à enfermagem." action={<Button to={attendancePath('/enfermagem/ficha', triageQueue[0])} icon="plus">Abrir ficha de triagem</Button>}>
    <RecordTable columns={['NOME DO PACIENTE','HORÁRIO DE CHEGADA','ETAPA','AÇÃO']} rows={triageQueue.map(entry => ({
      id: entry.id,
      cells: [<RecordLabel title={entry.patient} detail={`${entry.patientId} · ${entry.id}`}/>, entry.arrival,
        <RecordStatus tone={entry.triageStart ? 'progress' : 'neutral'}>{entry.step}</RecordStatus>,
        <Button to={attendancePath('/enfermagem/ficha', entry)} variant="outline">Abrir ficha</Button>],
    }))} title="Nenhum paciente na fila de triagem" description="Os pacientes encaminhados à enfermagem serão exibidos aqui." />
  </Card>
</>}
export function TriageForm(){
  const [searchParams] = useSearchParams();
  const historyEntry = searchParams.has('atendimento') ? selectedAttendance(triageHistory, searchParams) : undefined;
  const entry = historyEntry ?? selectedAttendance(triageQueue, searchParams);

  return <>
  <PageHead title="Ficha de Triagem" description={entry ? `Atendimento ${entry.id}` : 'Registro de avaliação de enfermagem.'}/>
  <form key={entry?.id} onSubmit={e=>e.preventDefault()}>
    <fieldset className="record-fields" disabled={Boolean(historyEntry)} aria-label="Dados da triagem">
    <SectionBlock number="1" title="Identificação do paciente" subtitle="Dados existentes no cadastro; somente leitura.">
      <FormGrid><Field label="Nome completo" readOnly defaultValue={entry?.patient}/><Field label="Prontuário" readOnly defaultValue={entry?.patientId}/><Field label="Data de nascimento / idade" readOnly/><Field label="Data de chegada" readOnly defaultValue={entry && formatDate(entry.date)}/><Field label="Horário de chegada" readOnly defaultValue={entry?.arrival}/></FormGrid>
    </SectionBlock>
    <SectionBlock number="2" title="Motivo do atendimento" subtitle="Queixa principal, relato subjetivo e observações do profissional.">
      <FormGrid columns={2}><Field label="Queixa principal" multi placeholder="Descrever a queixa principal relatada" />
      <Field label="Informações complementares" multi placeholder="Observações do profissional"/><Field label="Início dos sintomas"/><Field label="Duração dos sintomas"/></FormGrid>
    </SectionBlock>
    <SectionBlock number="3" title="Avaliação e medições" subtitle="Sinais vitais aferidos pela equipe de enfermagem.">
      <FormGrid columns={4}>{['Pressão arterial','Frequência cardíaca','Frequência respiratória','Temperatura','Saturação O2','Peso','Altura','Glicemia capilar'].map(label=><Field key={label} label={label} />)}</FormGrid>
      <Field label="Observações das medições" multi />
    </SectionBlock>
    <SectionBlock number="4" title="Classificação de risco/vulnerabilidade" subtitle="Registro realizado por profissional habilitado, conforme protocolo institucional.">
      <FormGrid columns={2}><Field label="Protocolo institucional utilizado" placeholder="Conforme protocolo configurado" />
        <Field label="Classificação feita pelo profissional" placeholder="Registro da classificação" /></FormGrid>
      <Field label="Observações complementares" multi />
    </SectionBlock>
    <SectionBlock number="5" title="Direcionamento interno" subtitle="Definição do fluxo de atendimento após a triagem.">
      <FormGrid columns={2}><Field label="Destino" options={['Sala de espera','Atendimento médico','Encaminhamento externo']} defaultValue={entry?.destination}/><Field label="Comportamento previsto do fluxo" /></FormGrid>
    </SectionBlock>
    <SectionBlock number="6" title="Responsável e finalização" subtitle="Registro profissional e estado da ficha."><FormGrid>
      <Field label="Profissional responsável" defaultValue={entry?.triageStaff}/><Field label="Data/hora do registro" type="datetime-local" defaultValue={entry?.triageStart && `${entry.date}T${entry.triageStart}`}/><Field label="Data/hora da finalização" type="datetime-local" defaultValue={entry?.triageEnd && `${entry.date}T${entry.triageEnd}`}/>
    </FormGrid></SectionBlock>
    </fieldset>
    <FormActions back={historyEntry ? '/enfermagem/registros' : '/enfermagem/fila'} backLabel={historyEntry ? 'Voltar aos registros' : 'Retornar à fila de triagem'} submitLabel="Salvar rascunho"/>
  </form>
</>}
export function TriageHistory(){return <>
  <PageHead title="Registros de Triagem" description="Consulte as avaliações realizadas pela equipe de enfermagem."/>
  <Card title="Filtros de busca" description="Localize registros anteriores por paciente, período, profissional ou identificador.">
    <Filters search="Buscar paciente ou identificador" fields={[{label:'Data inicial',type:'date'},{label:'Data final',type:'date'},{label:'Profissional responsável',placeholder:'Todos os profissionais'}]}/></Card>
  <Card title="Registros de triagem" description={`Registros encontrados: ${showPresentationData ? triageHistory.length : '—'}`}>
    <RecordTable columns={['PACIENTE','DATA DA TRIAGEM','HORÁRIO','PROFISSIONAL','DIRECIONAMENTO INTERNO','AÇÃO']} rows={triageHistory.map(entry => ({
      id: entry.id,
      cells: [<RecordLabel title={entry.patient} detail={`${entry.patientId} · ${entry.id}`}/>, formatDate(entry.date), entry.triageEnd,
        entry.triageStaff, entry.destination, <Button to={attendancePath('/enfermagem/ficha', entry)} variant="outline">Ver ficha</Button>],
    }))} title="Nenhum registro encontrado" description="Ajuste os filtros de busca, período ou profissional para localizar registros anteriores." />
  </Card>
</>}
