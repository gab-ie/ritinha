import { Navigate, useParams } from 'react-router';
import { Button, Card, Field, FormGrid, PageHead } from '../components/UI';
import { adminListPaths } from '../config/navigation';
import { locations, stock, suppliers, units, users } from '../mocks/administration';
import '../styles/admin-forms.css';

const profiles = ['Recepção', 'Enfermagem', 'Médico', 'Administração'];
const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

function AdminForm({ title, description, back, submitLabel = 'Salvar cadastro', children }) {
  return (
    <section className="admin-form-page">
      <PageHead title={title} description={description} />
      <form className="admin-form" onSubmit={event => event.preventDefault()} autoComplete="off">
        {children}
        <div className="form-actions">
          <Button to={back} variant="outline">Voltar à listagem</Button>
          <Button type="submit" disabled>{submitLabel}</Button>
        </div>
      </form>
    </section>
  );
}

export function UserForm({ editing = false, user }) {
  return (
    <AdminForm
      title={editing ? 'Editar usuário' : 'Cadastrar usuário'}
      description={editing ? 'Atualize os dados, o vínculo e as permissões da conta.' : 'Identificação, vínculo institucional e perfil de acesso.'}
      back={adminListPaths.usuarios}
      submitLabel={editing ? 'Salvar alterações' : 'Salvar cadastro'}
    >
      <Card title="Dados do usuário" description={editing ? 'Consulte e atualize as informações cadastrais.' : 'Identificação da conta individual.'}>
        <FormGrid columns={2}>
          <Field label="Nome completo" placeholder="Informar nome completo" defaultValue={user?.name} />
          <Field label="E-mail institucional" type="email" placeholder="Informar endereço de e-mail" defaultValue={user?.email} />
          <Field label="Identificação do usuário" placeholder="Informar identificador ou login" defaultValue={user?.username} />
          <Field label="Situação da conta" placeholder="Selecionar situação" options={['Ativa', 'Inativa']} defaultValue={user?.status} />
        </FormGrid>
      </Card>
      <Card title="Vínculo e permissões" description={editing ? 'Alterações de perfil modificam os acessos autorizados.' : 'O perfil define os módulos e as informações autorizadas.'}>
        <FormGrid columns={2}>
          <Field label="Unidade de saúde" placeholder="Selecionar unidade" options={units} disabled={!units.length} defaultValue={user?.unit} />
          <Field label="Perfil de acesso" placeholder="Selecionar: Recepção, Enfermagem, Médico ou Administração" options={profiles} defaultValue={user?.profile} />
          <Field label="Registro profissional (quando aplicável)" placeholder="Informar conselho e número" />
          <Field label="UF do registro (quando aplicável)" placeholder="Selecionar UF" options={states} />
        </FormGrid>
      </Card>
      {editing ? (
        <Card title="Segurança e acesso" description="Gerencie a recuperação de acesso sem visualizar senhas.">
          <p className="admin-form-note">A redefinição deve ser concluída pelo titular da conta, por um link seguro.</p>
          <div className="field">
            <span className="field-label">Redefinição de senha</span>
            <Button className="admin-form-account-action" variant="soft" disabled>Enviar link de redefinição</Button>
          </div>
        </Card>
      ) : (
        <Card title="Acesso à conta" description="Credenciais individuais e ativação segura.">
          <p className="admin-form-note">O usuário deverá definir sua própria senha em um fluxo seguro de ativação da conta.</p>
          <div className="field">
            <span className="field-label">Convite de ativação</span>
            <Button className="admin-form-account-action" variant="outline" disabled>Enviar convite após cadastrar</Button>
          </div>
        </Card>
      )}
    </AdminForm>
  );
}

export function EditUser() {
  const { userId } = useParams();

  if (!userId && !import.meta.env.DEV) {
    return <Navigate to={adminListPaths.usuarios} replace />;
  }

  const user = userId ? users.find(record => record.id === userId) : users[0];
  return <UserForm key={userId} editing user={user} />;
}

export function NewStockItem() {
  return (
    <AdminForm title="Cadastrar item de estoque" description="Dados do produto e parâmetros de controle." back={adminListPaths.estoque}>
      <Card title="Identificação do item" description="Dados do catálogo, independentes dos lotes recebidos.">
        <FormGrid columns={2}>
          <Field label="Nome ou descrição do item" placeholder="Informar nome do produto" />
          <Field label="Código interno" placeholder="Informar código de identificação" />
          <Field label="Categoria" placeholder="Selecionar categoria" options={['Medicamento', 'Insumo', 'Material']} />
          <Field label="Unidade de medida" placeholder="Informar unidade" />
        </FormGrid>
      </Card>
      <Card title="Controle de estoque" description="Parâmetros utilizados nos alertas e consultas.">
        <FormGrid columns={2}>
          <Field label="Estoque mínimo" type="number" min={0} step="any" placeholder="Informar quantidade mínima" />
          <Field label="Localização padrão" placeholder="Selecionar local de armazenamento" options={locations} disabled={!locations.length} />
        </FormGrid>
        <p className="admin-form-note">Lotes, validade e quantidade recebida serão registrados nas movimentações de entrada.</p>
      </Card>
    </AdminForm>
  );
}

export function NewSupplier() {
  return (
    <AdminForm title="Cadastrar fornecedor" description="Dados cadastrais e canais de contato da empresa." back={adminListPaths.fornecedores}>
      <Card title="Identificação da empresa" description="Informações para localizar e relacionar o fornecedor às entradas.">
        <FormGrid columns={2}>
          <Field label="Razão social" placeholder="Informar razão social" />
          <Field label="Nome fantasia" placeholder="Informar nome fantasia" />
          <Field label="CNPJ" placeholder="Informar CNPJ" />
          <Field label="Situação cadastral no Rita" placeholder="Selecionar situação" options={['Ativo', 'Inativo']} />
        </FormGrid>
      </Card>
      <Card title="Contato" description="Informações administrativas do fornecedor.">
        <FormGrid columns={2}>
          <Field label="E-mail" type="email" placeholder="Informar endereço de e-mail" />
          <Field label="Telefone" type="tel" placeholder="Informar telefone" />
        </FormGrid>
      </Card>
      <Card title="Endereço" description="Localização do estabelecimento.">
        <FormGrid columns={2}>
          <Field label="CEP" placeholder="Informar CEP" />
          <Field label="Logradouro" placeholder="Informar endereço" />
          <Field label="Número / complemento" placeholder="Informar número e complemento" />
          <Field label="Município / UF" placeholder="Informar município e UF" />
        </FormGrid>
      </Card>
    </AdminForm>
  );
}

export function NewMovement() {
  return (
    <AdminForm
      title="Registrar movimentação"
      description="Entrada, saída, transferência ou ajuste de estoque."
      back={adminListPaths.movimentacoes}
      submitLabel="Registrar movimentação"
    >
      <Card title="Tipo e identificação" description="Defina a operação e o item que será movimentado.">
        <FormGrid columns={2}>
          <Field label="Tipo de movimentação" placeholder="Selecionar tipo" options={['Entrada', 'Saída', 'Transferência', 'Ajuste']} />
          <Field label="Produto" placeholder="Selecionar item cadastrado" options={stock.map(item => item.name)} disabled={!stock.length} />
          <Field label="Quantidade" type="number" min={0} step="any" placeholder="Informar quantidade" />
          <Field label="Unidade / localização" placeholder="Informar local" />
        </FormGrid>
      </Card>
      <Card title="Informações da operação" description="Campos adicionais são aplicáveis conforme o tipo de movimentação.">
        <FormGrid columns={2}>
          <Field label="Fornecedor / origem (se entrada)" placeholder="Selecionar fornecedor ou origem" options={suppliers.length ? suppliers.filter(supplier => supplier.status === 'Ativo').map(supplier => supplier.name) : undefined} />
          <Field label="Destino (se saída ou transferência)" placeholder="Informar destino" />
          <Field label="Número do lote (se aplicável)" placeholder="Informar lote" />
          <Field label="Validade (se aplicável)" type="date" />
        </FormGrid>
      </Card>
      <Card title="Documento e registro" description="Informações para rastreabilidade da operação.">
        <FormGrid columns={2}>
          <Field label="Referência do documento (se houver)" placeholder="Informar número ou referência" />
          <Field label="Motivo (se ajuste)" placeholder="Descrever motivo" />
        </FormGrid>
        <p className="admin-form-note">Data, horário e usuário responsável serão registrados pelo sistema.</p>
      </Card>
    </AdminForm>
  );
}
