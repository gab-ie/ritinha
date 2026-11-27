import { generatePath } from 'react-router';
import { Button, Card, Field, Filters, FormGrid, PageHead, RecordLabel, RecordStatus, RecordTable, Shortcut, Stats } from '../components/UI';
import { adminCreatePaths, adminUserEditPath } from '../config/navigation';
import { adminMetrics, expiringStock, lowStock, movements, recentMovements, stock, suppliers, users } from '../mocks/administration';
import { formatDate, presentationStats, showPresentationData, today } from '../mocks/presentation';

const overviewStats = presentationStats([
  ['Itens cadastrados', stock.length, 'Medicamentos, insumos e materiais em catálogo.'],
  ['Estoque baixo', adminMetrics.lowStock, 'Itens abaixo do ponto de pedido.'],
  ['Movimentações recentes', recentMovements.length, 'Operações dos últimos 7 dias.'],
  ['Fornecedores', suppliers.filter(supplier => supplier.status === 'Ativo').length, 'Cadastrados e ativos.'],
]);

const listStats = {
  estoque: presentationStats([
    ['Itens com estoque baixo', adminMetrics.lowStock], ['Próximos do vencimento', adminMetrics.expiring],
    ['Itens bloqueados', adminMetrics.blocked], ['Itens com saldo disponível', adminMetrics.available],
  ]),
  movimentacoes: presentationStats([
    ['Entradas', adminMetrics.entries], ['Saídas', adminMetrics.exits],
    ['Transferências', adminMetrics.transfers], ['Ajustes de estoque', adminMetrics.adjustments],
  ]),
};

const stockAlerts = [...new Map([...lowStock, ...expiringStock].map(item => [item.id, item])).values()];
const itemLabel = item => <RecordLabel title={item.name} detail={item.id}/>;
const itemStatus = item => <RecordStatus tone={item.status === 'Regular' ? 'complete' : 'progress'}>{item.status}</RecordStatus>;

export function AdminOverview(){return <>
  <PageHead title="Visão geral" description="Painel administrativo de gestão de estoque, fornecedores e usuários." />
  <Stats items={overviewStats}/>
  <div className="split-cards">
    <Card title="Movimentações recentes" description="Últimas operações administrativas e de estoque.">
      <RecordTable columns={['ITEM','TIPO DE MOVIMENTAÇÃO','QUANTIDADE','DATA']} rows={recentMovements.map(entry => ({
        id: entry.id, cells: [entry.item, entry.type, entry.quantity, formatDate(entry.date)],
      }))} title="Nenhuma movimentação registrada" description="Os registros serão exibidos aqui." />
    </Card>
    <Card title="Alertas de estoque" description="Reposição e validade dos produtos." className="stock-alerts">
      <RecordTable columns={['ITEM','REPOSIÇÃO','VALIDADE']} rows={stockAlerts.map(item => ({
        id: item.id, cells: [itemLabel(item), item.balance < item.minimum ? itemStatus(item) : null, formatDate(item.expiry)],
      }))} title="Nenhum alerta disponível" description="Alertas de estoque serão exibidos aqui." />
    </Card>
  </div>
  <Card title="Acesso rápido"><div className="shortcut-grid">
    <Shortcut title="Estoque" text="Consultar produtos e quantidades." icon="package" to="/admin/estoque"/>
    <Shortcut title="Movimentações" text="Entradas, saídas e transferências." icon="arrow-left-right" to="/admin/movimentacoes"/>
    <Shortcut title="Relatórios" text="Visualizar posição e consumo." icon="chart-no-axes-column" to="/admin/relatorios"/>
  </div></Card>
</>}
const formats={
  estoque:{title:'Estoque',description:'Consulta e gerenciamento dos itens armazenados na unidade.',section:'Posição de estoque',info:'Consulte a disponibilidade e a situação dos itens cadastrados.',search:'Buscar por produto ou código interno',filters:['Categoria ou tipo de item','Localização física','Situação do estoque','Período de validade'],columns:['PRODUTO','CATEGORIA','UNIDADE DE MEDIDA','QUANTIDADE DISPONÍVEL','ESTOQUE MÍNIMO','VALIDADE MAIS PRÓXIMA','SITUAÇÃO','AÇÕES'],empty:'Nenhum item encontrado',emptyDesc:'Os produtos cadastrados serão exibidos aqui.',action:'Novo item'},
  movimentacoes:{title:'Movimentações',description:'Registro e acompanhamento das operações de estoque.',section:'Histórico de movimentações',info:'Consulte as entradas, saídas, transferências e ajustes registrados.',search:'Buscar por produto, código interno ou número do documento',filters:['Tipo de movimentação','Período','Situação','Origem / destino'],columns:['DATA E HORA','TIPO DE MOVIMENTAÇÃO','PRODUTO','QUANTIDADE','ORIGEM / DESTINO','SITUAÇÃO','AÇÕES'],empty:'Nenhuma movimentação encontrada',emptyDesc:'Os registros de entrada, saída, transferência e ajuste serão exibidos aqui.',action:'Nova movimentação'},
  fornecedores:{title:'Fornecedores',description:'Cadastro e consulta de fornecedores de medicamentos, materiais e insumos.',section:'Fornecedores cadastrados',info:'Consulte os dados cadastrais e os contatos das empresas fornecedoras.',search:'Buscar por razão social, nome fantasia ou CNPJ',filters:['Situação cadastral','Município / UF'],columns:['RAZÃO SOCIAL / NOME FANTASIA','CNPJ','MUNICÍPIO / UF','SITUAÇÃO','AÇÕES'],empty:'Nenhum fornecedor cadastrado',emptyDesc:'Os fornecedores cadastrados serão exibidos aqui.',action:'Novo fornecedor'},
  usuarios:{title:'Usuários',description:'Gerenciamento de contas, perfis e acessos dos profissionais da unidade.',section:'Usuários cadastrados',info:'Consulte profissionais, perfis atribuídos e situação de acesso.',search:'Buscar por nome, usuário ou e-mail',filters:['Perfil de acesso','Unidade de vínculo','Situação do acesso'],columns:['PROFISSIONAL','USUÁRIO / E-MAIL','PERFIL','UNIDADE','SITUAÇÃO','AÇÕES'],empty:'Nenhum usuário cadastrado',emptyDesc:'Os usuários e seus perfis de acesso serão exibidos aqui.',action:'Novo usuário'},
};
const listRows = {
  estoque: stock.map(item => ({
    id: item.id, cells: [itemLabel(item), item.category, item.unit, item.balance, item.minimum, formatDate(item.expiry), itemStatus(item), null],
  })),
  movimentacoes: movements.map(entry => ({
    id: entry.id, cells: [`${formatDate(entry.date)} · ${entry.time}`, <RecordLabel title={entry.type} detail={entry.id}/>,
      <RecordLabel title={entry.item} detail={entry.itemId}/>, entry.quantity, [entry.origin, entry.destination].filter(Boolean).join(' → '),
      <RecordStatus tone="complete">{entry.status}</RecordStatus>, null],
  })),
  fornecedores: suppliers.map(supplier => ({
    id: supplier.id, cells: [<RecordLabel title={supplier.name} detail={supplier.id}/>, null, supplier.city,
      <RecordStatus tone={supplier.status === 'Ativo' ? 'complete' : 'neutral'}>{supplier.status}</RecordStatus>, null],
  })),
};
export function AdminList({kind}){const p=formats[kind];return <>
  <PageHead title={p.title} description={p.description} action={import.meta.env.DEV && kind === 'usuarios' && (
    <Button variant="outline" to={generatePath(adminUserEditPath)}>Prévia da edição</Button>
  )}/>
  <Card title={p.section} description={p.info}><Filters search={p.search} fields={p.filters.map(label=>({label,placeholder:'Selecionar'}))} action={p.action} actionTo={adminCreatePaths[kind]}/>
  <RecordTable columns={p.columns} rows={kind === 'usuarios' ? users.map(user => ({
    id: user.id,
    cells: [<RecordLabel title={user.name} detail={user.id}/>, <RecordLabel title={user.email} detail={user.username}/>, user.profile, user.unit,
      <RecordStatus tone={user.status === 'Ativa' ? 'complete' : 'neutral'}>{user.status}</RecordStatus>,
      <Button variant="outline" to={generatePath(adminUserEditPath, { userId: user.id })}>Editar</Button>],
  })) : listRows[kind]} title={p.empty} description={p.emptyDesc} /></Card>
  {listStats[kind]&&<Card title={kind==='estoque'?'Resumo do estoque':'Resumo das movimentações'}><Stats items={listStats[kind]}/></Card>}
  {kind==='fornecedores'&&<Card title="Informações do cadastro" description="Dados disponíveis na visualização ou edição de cada fornecedor."><div className="small-chips"><span>Identificação</span><span>Contato</span><span>Endereço</span><span>Situação</span></div></Card>}
  {kind==='usuarios'&&<Card title="Perfis e permissões" description="Cada perfil possui acesso apenas às funções necessárias para sua atividade."><div className="small-chips"><span>Recepção</span><span>Enfermagem</span><span>Médico</span><span>Administração</span></div></Card>}
</>}
export function Reports(){return <>
  <PageHead title="Relatórios" description="Consulta de posição de estoque e movimentações da unidade."/>
  <Card title="Parâmetros da consulta" description="Selecione o tipo de relatório e informe os filtros aplicáveis.">
    <form onSubmit={e=>e.preventDefault()}><FormGrid columns={2}><Field label="Tipo de relatório" options={['Posição de estoque','Entradas e saídas']} defaultValue={showPresentationData ? 'Posição de estoque' : ''}/><Field label="Produto" placeholder="Buscar produto"/>
    <Field label="Data inicial" type="date"/><Field label="Data final" type="date"/><Field label="Localização física" placeholder="Selecionar localização"/></FormGrid>
    <div className="align-end"><Button variant="outline" type="reset">Limpar filtros</Button><Button disabled>Gerar relatório</Button></div></form>
  </Card>
  <Card title="Resultado do relatório" description={showPresentationData ? `Posição consolidada de estoque · ${formatDate(today)}` : 'A visualização será exibida conforme os parâmetros selecionados.'} action={<Button variant="outline" disabled>Exportar relatório</Button>}>
    <RecordTable columns={['PRODUTO','UNIDADE','SALDO DISPONÍVEL','ESTOQUE MÍNIMO','SITUAÇÃO']} rows={stock.map(item => ({
      id: item.id, cells: [itemLabel(item), item.unit, item.balance, item.minimum, itemStatus(item)],
    }))} title="Nenhum relatório gerado" description="Selecione um tipo de relatório e defina os filtros." icon="chart-no-axes-column" />
  </Card>
</>}
