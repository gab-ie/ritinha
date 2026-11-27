import { Button, Card, Field, Filters, FormActions, FormGrid, PageHead, SectionBlock, Shortcut, Stats, TableEmpty } from '../components/UI';
export function MedicalOverview(){return <>
  <PageHead title="Visão Geral" description="Bem-vindo(a)! Confira a movimentação dos atendimentos hoje."/>
  <Stats items={[{title:'Pacientes aguardando consulta'},{title:'Atendimentos em andamento'},{title:'Consultas concluídas hoje'},{title:'Pacientes direcionados à emergência'}]}/>
  <Card title="Movimentação dos atendimentos" description="Resumo de hoje • consultas da fila médica"><Stats items={['Aguardando','Em atendimento','Consulta finalizada'].map(title=>({title}))}/></Card>
  <Card title="Acesso rápido" description="Atalhos para suas principais atividades."><div className="shortcut-grid">
    <Shortcut title="Acessar fila de atendimento" text="Visualizar pacientes encaminhados para consulta." icon="users" to="/medico/fila" cta="Abrir fila"/>
    <Shortcut title="Consultar histórico de atendimentos" text="Acesso clínico conforme suas permissões." icon="file-text" to="/medico/historico" cta="Consultar"/>
    <Shortcut title="Visualizar pacientes aguardando consulta" text="Acompanhar a movimentação da fila médica." icon="house" to="/medico/fila"/>
  </div></Card>
  <Card title="Últimos atendimentos" description="Identificação, horário e situação • sem diagnósticos ou detalhes clínicos.">
    <TableEmpty columns={['PACIENTE','HORÁRIO','SITUAÇÃO DO ATENDIMENTO']} title="Nenhum atendimento registrado" description="Os atendimentos recentes serão exibidos aqui." />
  </Card>
</>}
export function MedicalQueue(){return <>
  <PageHead title="Fila de Atendimento" description="Acompanhamento dos pacientes encaminhados para consulta médica."/>
  <Stats items={[{title:'Aguardando atendimento'},{title:'Em consulta'},{title:'Atendimentos concluídos'}]}/>
  <Card title="Pacientes" description="Registros: —" action={<Button to="/medico/atendimento">Abrir ficha de atendimento</Button>}>
    <Filters search="Nome ou identificação do paciente" fields={[{label:'Classificação de risco',placeholder:'Todas as classificações'},{label:'Status do atendimento',placeholder:'Todos os status'}]}/>
    <TableEmpty columns={['PACIENTE','HORÁRIO DE CHEGADA','CLASSIFICAÇÃO','STATUS','AÇÃO']} title="Nenhum paciente na fila de atendimento" description="Os pacientes encaminhados para consulta serão exibidos aqui." />
  </Card>
  <Card title="Registro da enfermagem" description="Resumo de triagem disponível quando um paciente for selecionado.">
    <div className="blank-summary"><p>Queixa principal: —</p><p>Sinais vitais aferidos: —</p><p>Direcionamento: —</p></div>
  </Card>
</>}
const subjective=['Motivo da consulta','História da doença atual','Sintomas relatados','Antecedentes pessoais relevantes','Antecedentes familiares relevantes','Medicamentos em uso','Alergias e reações adversas'];
const objective=['Data e hora','PAS (mmHg)','PAD (mmHg)','FC (bpm)','FR (irpm)','SpO₂ (%)','Temp. (°C)','Peso (kg)','Altura (cm)'];
const assessment=['Problemas e condições identificados','Hipóteses diagnósticas','Diagnóstico estabelecido, quando houver','Classificação diagnóstica'];
const plan=['Conduta médica','Orientações ao paciente'];
export function MedicalRecord({readOnly=false}){return <>
  <PageHead title="Atendimento Médico" description={readOnly?'Registro clínico • Atendimento: — • Somente leitura':'Prontuário eletrônico • consulta médica'}/>
  <Card title="Identificação" description="Paciente: —"><FormGrid>
    <Field readOnly label="Paciente"/><Field readOnly label="Nascimento / idade"/><Field readOnly label="Prontuário"/>
    <Field readOnly label="Data e horário do atendimento"/><Field readOnly label="Médica responsável"/>
  </FormGrid></Card>
  <Card title="Resumo da triagem" description="Nenhuma triagem registrada"><FormGrid columns={2}>
    <Field readOnly label="Queixa principal"/><Field readOnly label="Classificação de risco"/><Field readOnly label="Sinais vitais registrados"/><Field readOnly label="Direcionamento interno"/>
  </FormGrid></Card>
  <form onSubmit={e=>e.preventDefault()}>
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
  <Card title="Atendimentos" description="Mais recentes primeiro" action={<Button to="/medico/registro" variant="outline">Visualizar modelo de registro</Button>}>
    <TableEmpty columns={['DATA E HORA','PACIENTE','PRONTUÁRIO','PROFISSIONAL RESPONSÁVEL','SITUAÇÃO','AÇÕES']} title="Nenhum atendimento encontrado" description="Os atendimentos registrados serão exibidos aqui." />
  </Card>
</>}
