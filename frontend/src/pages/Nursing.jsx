import { Button, Card, Empty, Field, Filters, FormActions, FormGrid, PageHead, SectionBlock, Shortcut, Stats, TableEmpty } from '../components/UI';

export function NursingOverview(){return <>
  <PageHead title="Visão Geral" description="Bom dia! Confira as atividades da enfermagem hoje."/>
  <Stats items={[{title:'Pacientes aguardando triagem'},{title:'Triagens em andamento'},{title:'Triagens concluídas hoje'}]}/>
  <Card title="Atividades da Enfermagem" description="Resumo visual da movimentação do setor durante o dia.">
    <Stats items={['Entradas no setor','Triagens iniciadas','Encaminhamentos','Média de espera','Atendimentos concluídos','Equipe em atuação'].map(title=>({title}))}/></Card>
  <Card title="Acesso rápido" description="Atalhos para as principais funcionalidades do setor."><div className="shortcut-grid">
    <Shortcut title="Acessar fila de triagem" text="Gerenciar pacientes aguardando atendimento." icon="users" to="/enfermagem/fila"/>
    <Shortcut title="Consultar registros de triagem" text="Acompanhar histórico e evolução." icon="clipboard-list" to="/enfermagem/registros" cta="Consultar" />
    <Shortcut title="Visualizar pacientes aguardando" text="Verificar demanda pendente do setor." icon="house" to="/enfermagem/fila"/>
  </div></Card>
  <Card title="Últimas atividades" description="Registros recentes da equipe de enfermagem."><Empty title="Nenhuma atividade registrada" description="Os registros recentes serão exibidos aqui." /></Card>
</>}
export function TriageQueue(){return <>
  <PageHead title="Painel de Enfermagem" description="Classificação de risco e organização da fila de triagem." />
  <Stats items={[{title:'Aguardando triagem'},{title:'Em triagem'},{title:'Triagens concluídas hoje'}]}/>
  <Card title="Fila de triagem" description="Pacientes encaminhados à enfermagem." action={<Button to="/enfermagem/ficha" icon="plus">Abrir ficha de triagem</Button>}>
    <TableEmpty columns={['NOME DO PACIENTE','HORÁRIO DE CHEGADA','ETAPA','AÇÃO']} title="Nenhum paciente na fila de triagem" description="Os pacientes encaminhados à enfermagem serão exibidos aqui." />
  </Card>
</>}
export function TriageForm(){return <>
  <PageHead title="Ficha de Triagem" description="Registro de avaliação de enfermagem."/>
  <form onSubmit={e=>e.preventDefault()}>
    <SectionBlock number="1" title="Identificação do paciente" subtitle="Dados existentes no cadastro; somente leitura.">
      <FormGrid><Field label="Nome completo" readOnly/><Field label="Prontuário" readOnly/><Field label="Data de nascimento / idade" readOnly/><Field label="Data de chegada" readOnly/><Field label="Horário de chegada" readOnly/></FormGrid>
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
      <FormGrid columns={2}><Field label="Destino" options={['Sala de espera','Atendimento médico','Encaminhamento externo']}/><Field label="Comportamento previsto do fluxo" /></FormGrid>
    </SectionBlock>
    <SectionBlock number="6" title="Responsável e finalização" subtitle="Registro profissional e estado da ficha."><FormGrid>
      <Field label="Profissional responsável"/><Field label="Data/hora do registro" type="datetime-local"/><Field label="Data/hora da finalização" type="datetime-local"/>
    </FormGrid></SectionBlock>
    <FormActions back="/enfermagem/fila" backLabel="Retornar à fila de triagem" submitLabel="Salvar rascunho"/>
  </form>
</>}
export function TriageHistory(){return <>
  <PageHead title="Registros de Triagem" description="Consulte as avaliações realizadas pela equipe de enfermagem."/>
  <Card title="Filtros de busca" description="Localize registros anteriores por paciente, período, profissional ou identificador.">
    <Filters search="Buscar paciente ou identificador" fields={[{label:'Data inicial',type:'date'},{label:'Data final',type:'date'},{label:'Profissional responsável',placeholder:'Todos os profissionais'}]}/></Card>
  <Card title="Registros de triagem" description="Registros encontrados: —"><TableEmpty columns={['PACIENTE','DATA DA TRIAGEM','HORÁRIO','PROFISSIONAL','DIRECIONAMENTO INTERNO','AÇÃO']} title="Nenhum registro encontrado" description="Ajuste os filtros de busca, período ou profissional para localizar registros anteriores." /></Card>
</>}
