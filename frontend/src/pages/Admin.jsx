import { generatePath } from 'react-router';
import { Button, Card, DataTable, Empty, Field, Filters, FormGrid, PageHead, Shortcut, Stats, TableEmpty } from '../components/UI';
import { adminCreatePaths, adminUserEditPath } from '../config/navigation';

export function AdminOverview(){return <>
  <PageHead title="Visão geral" description="Painel administrativo de gestão de estoque, fornecedores e usuários." />
  <Stats items={[{title:'Itens cadastrados',note:'Medicamentos, insumos e materiais em catálogo.'},{title:'Estoque baixo',note:'Itens abaixo do ponto de pedido.'},{title:'Movimentações recentes',note:'Entradas e saídas dos últimos 7 dias.'},{title:'Fornecedores',note:'Cadastrados e ativos.'}]}/>
  <div className="split-cards"><Card title="Movimentações recentes" description="Últimas operações administrativas e de estoque."><TableEmpty columns={['ITEM','TIPO DE MOVIMENTAÇÃO','QUANTIDADE','DATA']} title="Nenhuma movimentação registrada" description="Os registros serão exibidos aqui." /></Card>
  <Card title="Alertas de estoque" description="Reposição e validade dos produtos."><Empty title="Nenhum alerta disponível" description="Alertas de estoque serão exibidos aqui." /></Card></div>
  <Card title="Acesso rápido"><div className="shortcut-grid">
    <Shortcut title="Estoque" text="Consultar produtos e quantidades." icon="package" to="/admin/estoque"/>
    <Shortcut title="Movimentações" text="Entradas, saídas e transferências." icon="arrow-left-right" to="/admin/movimentacoes"/>
    <Shortcut title="Relatórios" text="Visualizar posição e consumo." icon="chart-no-axes-column" to="/admin/relatorios"/>
  </div></Card>
</>}
const formats={
  estoque:{title:'Estoque',description:'Consulta e gerenciamento dos itens armazenados na unidade.',section:'Posição de estoque',info:'Consulte a disponibilidade e a situação dos itens cadastrados.',search:'Buscar por produto ou código interno',filters:['Categoria ou tipo de item','Localização física','Situação do estoque','Período de validade'],columns:['PRODUTO','CATEGORIA','UNIDADE DE MEDIDA','QUANTIDADE DISPONÍVEL','ESTOQUE MÍNIMO','VALIDADE MAIS PRÓXIMA','SITUAÇÃO','AÇÕES'],empty:'Nenhum item encontrado',emptyDesc:'Os produtos cadastrados serão exibidos aqui.',action:'Novo item',stats:['Itens com estoque baixo','Próximos do vencimento','Itens bloqueados','Itens com saldo disponível']},
  movimentacoes:{title:'Movimentações',description:'Registro e acompanhamento das operações de estoque.',section:'Histórico de movimentações',info:'Consulte as entradas, saídas, transferências e ajustes registrados.',search:'Buscar por produto, código interno ou número do documento',filters:['Tipo de movimentação','Período','Situação','Origem / destino'],columns:['DATA E HORA','TIPO DE MOVIMENTAÇÃO','PRODUTO','QUANTIDADE','ORIGEM / DESTINO','SITUAÇÃO','AÇÕES'],empty:'Nenhuma movimentação encontrada',emptyDesc:'Os registros de entrada, saída, transferência e ajuste serão exibidos aqui.',action:'Nova movimentação',stats:['Entradas','Saídas','Transferências','Ajustes de estoque']},
  fornecedores:{title:'Fornecedores',description:'Cadastro e consulta de fornecedores de medicamentos, materiais e insumos.',section:'Fornecedores cadastrados',info:'Consulte os dados cadastrais e os contatos das empresas fornecedoras.',search:'Buscar por razão social, nome fantasia ou CNPJ',filters:['Situação cadastral','Município / UF'],columns:['RAZÃO SOCIAL / NOME FANTASIA','CNPJ','MUNICÍPIO / UF','SITUAÇÃO','AÇÕES'],empty:'Nenhum fornecedor cadastrado',emptyDesc:'Os fornecedores cadastrados serão exibidos aqui.',action:'Novo fornecedor'},
  usuarios:{title:'Usuários',description:'Gerenciamento de contas, perfis e acessos dos profissionais da unidade.',section:'Usuários cadastrados',info:'Consulte profissionais, perfis atribuídos e situação de acesso.',search:'Buscar por nome, usuário ou e-mail',filters:['Perfil de acesso','Unidade de vínculo','Situação do acesso'],columns:['PROFISSIONAL','USUÁRIO / E-MAIL','PERFIL','UNIDADE','SITUAÇÃO','AÇÕES'],empty:'Nenhum usuário cadastrado',emptyDesc:'Os usuários e seus perfis de acesso serão exibidos aqui.',action:'Novo usuário'},
};
export function AdminList({kind, users = []}){const p=formats[kind];return <>
  <PageHead title={p.title} description={p.description} action={import.meta.env.DEV && kind === 'usuarios' && (
    <Button variant="outline" to={generatePath(adminUserEditPath)}>Prévia da edição</Button>
  )}/>
  <Card title={p.section} description={p.info}><Filters search={p.search} fields={p.filters.map(label=>({label,placeholder:'Selecionar'}))} action={p.action} actionTo={adminCreatePaths[kind]}/>
  {kind === 'usuarios' && users.length > 0 ? (
    <DataTable columns={p.columns}>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.name}</td>
          <td>{user.email || user.username}</td>
          <td>{user.profile}</td>
          <td>{user.unit}</td>
          <td>{user.status}</td>
          <td><Button variant="outline" to={generatePath(adminUserEditPath, { userId: String(user.id) })}>Editar</Button></td>
        </tr>
      ))}
    </DataTable>
  ) : <TableEmpty columns={p.columns} title={p.empty} description={p.emptyDesc} />}</Card>
  {p.stats&&<Card title={kind==='estoque'?'Resumo do estoque':'Resumo das movimentações'}><Stats items={p.stats.map(title=>({title}))}/></Card>}
  {kind==='fornecedores'&&<Card title="Informações do cadastro" description="Dados disponíveis na visualização ou edição de cada fornecedor."><div className="small-chips"><span>Identificação</span><span>Contato</span><span>Endereço</span><span>Situação</span></div></Card>}
  {kind==='usuarios'&&<Card title="Perfis e permissões" description="Cada perfil possui acesso apenas às funções necessárias para sua atividade."><div className="small-chips"><span>Recepção</span><span>Enfermagem</span><span>Médico</span><span>Administração</span></div></Card>}
</>}
export function Reports(){return <>
  <PageHead title="Relatórios" description="Consulta de posição de estoque e movimentações da unidade."/>
  <Card title="Parâmetros da consulta" description="Selecione o tipo de relatório e informe os filtros aplicáveis.">
    <form onSubmit={e=>e.preventDefault()}><FormGrid columns={2}><Field label="Tipo de relatório" options={['Posição de estoque','Entradas e saídas']}/><Field label="Produto" placeholder="Buscar produto"/>
    <Field label="Data inicial" type="date"/><Field label="Data final" type="date"/><Field label="Localização física" placeholder="Selecionar localização"/></FormGrid>
    <div className="align-end"><Button variant="outline" type="reset">Limpar filtros</Button><Button disabled>Gerar relatório</Button></div></form>
  </Card>
  <Card title="Resultado do relatório" description="A visualização será exibida conforme os parâmetros selecionados." action={<Button variant="outline" disabled>Exportar relatório</Button>}>
    <Empty title="Nenhum relatório gerado" description="Selecione um tipo de relatório e defina os filtros." icon="chart-no-axes-column" />
  </Card>
</>}
