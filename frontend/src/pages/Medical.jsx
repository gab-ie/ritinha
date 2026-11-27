import { useSearchParams } from 'react-router';
import { Button, Card, Field, Filters, FormActions, FormGrid, PageHead, RecordLabel, RecordStatus, RecordTable, SectionBlock, Shortcut, Stats } from '../components/UI';
import { attendanceMetrics as metrics, attendancePath, medicalHistory, medicalQueue, selectedAttendance, steps, todayAttendances } from '../mocks/attendance';
import { formatDate, presentationStats, showPresentationData } from '../mocks/presentation';

const queueStats = presentationStats([
  ['Aguardando atendimento', metrics.waitingConsultation],
  ['Em consulta', metrics.inConsultation],
  ['Atendimentos concluídos', metrics.completed],
]);

const dailyStats = presentationStats([
  ['Pacientes aguardando consulta', metrics.waitingConsultation],
  ['Atendimentos em andamento', metrics.inConsultation],
  ['Consultas concluídas hoje', metrics.completed],
  ['Pacientes direcionados à emergência', metrics.emergency],
]);

const flowStats = presentationStats([
  ['Aguardando', metrics.waitingConsultation],
  ['Em atendimento', metrics.inConsultation],
  ['Consulta finalizada', metrics.completed],
]);

export function MedicalOverview(){return <>
  <PageHead title="Visão Geral" description="Bem-vindo(a)! Confira a movimentação dos atendimentos hoje."/>
  <Stats items={dailyStats}/>
  <Card title="Movimentação dos atendimentos" description="Resumo de hoje • consultas da fila médica"><Stats items={flowStats}/></Card>
  <Card title="Acesso rápido" description="Atalhos para suas principais atividades."><div className="shortcut-grid">
    <Shortcut title="Acessar fila de atendimento" text="Visualizar pacientes encaminhados para consulta." icon="users" to="/medico/fila" cta="Abrir fila"/>
    <Shortcut title="Consultar histórico de atendimentos" text="Acesso clínico conforme suas permissões." icon="file-text" to="/medico/historico" cta="Consultar"/>
    <Shortcut title="Visualizar pacientes aguardando consulta" text="Acompanhar a movimentação da fila médica." icon="house" to="/medico/fila"/>
  </div></Card>
  <Card title="Últimos atendimentos" description="Identificação, horário e situação • sem diagnósticos ou detalhes clínicos.">
    <RecordTable columns={['PACIENTE','HORÁRIO','SITUAÇÃO DO ATENDIMENTO']} rows={todayAttendances
      .filter(entry => entry.consultationStart)
      .sort((first, second) => (second.consultationEnd ?? second.consultationStart).localeCompare(first.consultationEnd ?? first.consultationStart))
      .map(entry => ({
        id: entry.id, cells: [<RecordLabel title={entry.patient} detail={entry.id}/>, entry.consultationEnd ?? entry.consultationStart,
          <RecordStatus tone={entry.consultationEnd ? 'complete' : 'progress'}>{entry.step}</RecordStatus>],
      }))} title="Nenhum atendimento registrado" description="Os atendimentos recentes serão exibidos aqui." />
  </Card>
</>}
export function MedicalQueue(){return <>
  <PageHead title="Fila de Atendimento" description="Acompanhamento dos pacientes encaminhados para consulta médica."/>
  <Stats items={queueStats}/>
  <Card title="Pacientes" description={`Registros: ${showPresentationData ? medicalQueue.length : '—'}`} action={<Button to={attendancePath('/medico/atendimento', medicalQueue[0])}>Abrir ficha de atendimento</Button>}>
    <Filters search="Nome ou identificação do paciente" fields={[{label:'Classificação de risco',placeholder:'Todas as classificações'},{label:'Status do atendimento',placeholder:'Todos os status'}]}/>
    <RecordTable columns={['PACIENTE','HORÁRIO DE CHEGADA','CLASSIFICAÇÃO','STATUS','AÇÃO']} rows={medicalQueue.map(entry => ({
      id: entry.id, cells: [<RecordLabel title={entry.patient} detail={`${entry.patientId} · ${entry.id}`}/>, entry.arrival, null,
        <RecordStatus tone={entry.consultationStart ? 'progress' : 'neutral'}>{entry.step}</RecordStatus>,
        <Button to={attendancePath('/medico/atendimento', entry)} variant="outline">Abrir ficha</Button>],
    }))} title="Nenhum paciente na fila de atendimento" description="Os pacientes encaminhados para consulta serão exibidos aqui." />
  </Card>
  <Card title="Registro da enfermagem" description={medicalQueue[0] ? `${medicalQueue[0].patient} · ${medicalQueue[0].id}` : 'Resumo de triagem disponível quando um paciente for selecionado.'}>
    <div className="blank-summary"><p>Queixa principal: —</p><p>Sinais vitais aferidos: —</p><p>Direcionamento: {medicalQueue[0]?.destination ?? '—'}</p></div>
  </Card>
</>}
const subjective=['Motivo da consulta','História da doença atual','Sintomas relatados','Antecedentes pessoais relevantes','Antecedentes familiares relevantes','Medicamentos em uso','Alergias e reações adversas'];
const objective=['Data e hora','PAS (mmHg)','PAD (mmHg)','FC (bpm)','FR (irpm)','SpO₂ (%)','Temp. (°C)','Peso (kg)','Altura (cm)'];
const assessment=['Problemas e condições identificados','Hipóteses diagnósticas','Diagnóstico estabelecido, quando houver','Classificação diagnóstica'];
const plan=['Conduta médica','Orientações ao paciente'];
export function MedicalRecord({readOnly=false}){
  const [searchParams] = useSearchParams();
  const entry = selectedAttendance(readOnly ? medicalHistory : medicalQueue, searchParams);
  const consultationDate = entry?.consultationStart && `${formatDate(entry.date)} · ${entry.consultationStart}`;
  return <>
  <PageHead title="Atendimento Médico" description={readOnly ? `Registro clínico • Atendimento: ${entry?.id ?? '—'} • Somente leitura` : entry ? `Prontuário eletrônico • Atendimento: ${entry.id}` : 'Prontuário eletrônico • consulta médica'}/>
  <Card key={`identificacao-${entry?.id}`} title="Identificação" description={`Paciente: ${entry?.patient ?? '—'}`}><FormGrid>
    <Field readOnly label="Paciente" defaultValue={entry?.patient}/><Field readOnly label="Nascimento / idade"/><Field readOnly label="Prontuário" defaultValue={entry?.patientId}/>
    <Field readOnly label="Data e horário do atendimento" defaultValue={consultationDate}/><Field readOnly label="Médica responsável" defaultValue={entry?.consultationStaff}/>
  </FormGrid></Card>
  <Card key={`triagem-${entry?.id}`} title="Resumo da triagem" description={entry?.triageEnd ? `Triagem concluída às ${entry.triageEnd} · ${entry.triageStaff}` : 'Nenhuma triagem registrada'}><FormGrid columns={2}>
    <Field readOnly label="Queixa principal"/><Field readOnly label="Classificação de risco"/><Field readOnly label="Sinais vitais registrados"/><Field readOnly label="Direcionamento interno" defaultValue={entry?.destination}/>
  </FormGrid></Card>
  <form key={entry?.id} onSubmit={e=>e.preventDefault()}>
    <SectionBlock number="1" title="Subjetivo • Anamnese" subtitle="Relato do paciente e antecedentes relevantes para a consulta."><FormGrid columns={2}>
      {subjective.map(label=><Field readOnly={readOnly} key={label} label={label} multi/>)}</FormGrid>
    </SectionBlock>
    <SectionBlock number="2" title="Objetivo • Exame físico" subtitle="Medições, achados observados e exames complementares.">
      <h3 className="subheading">{readOnly?'Aferições do atendimento':'Nova aferição'}</h3><FormGrid columns={4}>
      {objective.map(label=><Field readOnly={readOnly} key={label} label={label} type={label==='Data e hora'?'datetime-local':'text'}/>)}</FormGrid>
      <FormGrid columns={2}><Field readOnly={readOnly} label="Exame físico" multi/><Field readOnly={readOnly} label="Exames complementares e resultados" multi/></FormGrid>
    </SectionBlock>
    <SectionBlock number="3" title="Avaliação médica" subtitle="Problemas, hipóteses e classificação diagnóstica da consulta.">
      <FormGrid columns={2}>{assessment.map(label=><Field readOnly={readOnly} key={label} label={label} multi />)}</FormGrid>
    </SectionBlock>
    <SectionBlock number="4" title="Plano e conduta" subtitle="Decisões, prescrições, solicitações e acompanhamento."><FormGrid columns={2}>
      {plan.map(label=><Field readOnly={readOnly} key={label} label={label} multi/>)}</FormGrid></SectionBlock>
    <SectionBlock number="5" title="Finalização do atendimento" subtitle="Registro profissional e validação."><FormGrid>
      <Field readOnly label="Registro profissional"/><Field readOnly label="Data e hora do registro"/><Field readOnly label="Assinatura / validação profissional"/>
    </FormGrid></SectionBlock>
    {readOnly ? <div className="form-actions"><Button to="/medico/historico" variant="outline" icon="arrow-left">Voltar ao histórico</Button></div> : <FormActions back="/medico/fila" backLabel="Voltar para fila" submitLabel="Salvar rascunho" />}
  </form>
</>}
export function MedicalHistory(){return <>
  <PageHead title="Histórico de Atendimentos" description="Consulta de registros médicos anteriores."/>
  <Card><Filters search="Buscar por nome ou número do prontuário" fields={[{label:'Data inicial',type:'date'},{label:'Data final',type:'date'},{label:'Profissional responsável',placeholder:'Selecionar profissional'},{label:'Situação do registro',placeholder:'Selecionar situação'}]}/>
    <label className="check-field"><input type="checkbox"/> Somente meus atendimentos</label>
  </Card>
  <Card title="Atendimentos" description="Mais recentes primeiro" action={<Button to={attendancePath('/medico/registro', medicalHistory[0])} variant="outline">{medicalHistory.length ? 'Abrir último registro' : 'Visualizar modelo de registro'}</Button>}>
    <RecordTable columns={['DATA E HORA','PACIENTE','PRONTUÁRIO','PROFISSIONAL RESPONSÁVEL','SITUAÇÃO','AÇÕES']} rows={medicalHistory.map(entry => ({
      id: entry.id, cells: [`${formatDate(entry.date)} · ${entry.consultationEnd}`, <RecordLabel title={entry.patient} detail={entry.id}/>,
        entry.patientId, entry.consultationStaff, <RecordStatus tone="complete">{steps.completed}</RecordStatus>,
        <Button to={attendancePath('/medico/registro', entry)} variant="outline">Ver registro</Button>],
    }))} title="Nenhum atendimento encontrado" description="Os atendimentos registrados serão exibidos aqui." />
  </Card>
</>}
