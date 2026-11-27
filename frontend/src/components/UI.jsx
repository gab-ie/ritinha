import { Link } from 'react-router';
import { useId } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, ArrowLeftRight, CalendarDays,
  ChartNoAxesColumn, ChevronDown, ClipboardList, FileText, House,
  LayoutDashboard, Package, Plus, Search, ShieldCheck, Truck,
  UserRound, Users, Inbox, Check, Save, Download, Filter,
} from 'lucide-react';

const iconMap = { activity: Activity, 'arrow-left': ArrowLeft, 'arrow-right': ArrowRight,
  'arrow-left-right': ArrowLeftRight, calendar: CalendarDays,
  'chart-no-axes-column': ChartNoAxesColumn, 'chevron-down': ChevronDown,
  'clipboard-list': ClipboardList, 'file-text': FileText,
  house: House, 'layout-dashboard': LayoutDashboard, package: Package,
  plus: Plus, search: Search, 'shield-check': ShieldCheck, truck: Truck,
  'user-round': UserRound, users: Users, inbox: Inbox, check: Check,
  save: Save, download: Download, filter: Filter };

export function Glyph({ name = 'activity', size = 18, ...props }) {
  const Icon = iconMap[name] || Activity;
  return <Icon size={size} strokeWidth={1.85} aria-hidden="true" {...props} />;
}
export function Button({ children, icon, variant = 'primary', to, type = 'button', className = '', ...props }) {
  const cls = `button button--${variant} ${className}`.trim();
  const content = <>{icon && <Glyph name={icon} size={16} />}{children}</>;
  return to ? <Link className={cls} to={to} {...props}>{content}</Link>
    : <button type={type} className={cls} {...props}>{content}</button>;
}
export function PageHead({ title, description, action, kicker }) {
  return <div className="page-head">
    <div><div className="page-kicker">{kicker || 'Sistema Rita'}</div>
      <h1>{title}</h1>{description && <p>{description}</p>}</div>
    {action && <div className="page-action">{action}</div>}
  </div>;
}
export function Card({ title, description, children, action, className = '' }) {
  return <section className={`card ${className}`}>
    {(title || description || action) && <div className="card-head">
      <div>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>
      {action && <div>{action}</div>}
    </div>}
    {children}
  </section>;
}
export function Stats({ items }) {
  return <div className="stats-grid">{items.map((it) => <div className="stat" key={it.title}>
    <div className="stat-label">{it.title}</div><div className="stat-value">—</div>
    {it.note && <div className="stat-note">{it.note}</div>}
  </div>)}</div>;
}
export function Empty({ title, description, icon = 'inbox' }) {
  return <div className="empty-state"><span className="empty-icon"><Glyph name={icon} size={27} /></span>
    <strong>{title}</strong><p>{description}</p></div>;
}
export function DataTable({ columns, children, empty }) {
  return <div className="table-scroll">
    <table className="data-table">
      <thead><tr>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
      {children && <tbody>{children}</tbody>}
    </table>
    {empty}
  </div>;
}
export function TableEmpty({ columns, title, description, icon }) {
  return <DataTable columns={columns} empty={<Empty title={title} description={description} icon={icon}/>} />;
}
export function Field({ label, placeholder, type = 'text', options, required = false, multi = false, readOnly = false, disabled = false, min, step }) {
  const id = useId();
  const common = { id, name: label, required, disabled: disabled || readOnly };
  return <label className="field" htmlFor={id}><span className="field-label">{label}{required && <em> *</em>}</span>
    {multi ? <textarea {...common} rows={4} placeholder={placeholder || ''} />
    : options ? <span className="select-wrap"><select {...common} defaultValue=""><option value="">{placeholder || 'Selecionar'}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select><Glyph name="chevron-down" size={15}/></span>
    : <input {...common} type={type} min={min} step={step} placeholder={placeholder || ''} />}
  </label>;
}
export function Filters({ fields, search, action, actionTo }) {
  return <form className="filters" onSubmit={e=>e.preventDefault()}>
    {search && <div className="filter-search"><Glyph name="search" size={17}/><input aria-label="Buscar" placeholder={search} /></div>}
    <div className="filter-grid">{fields.map((f,i)=><Field key={i} {...f} suffix={`filter-${i}`}/>)}</div>
    {action && <div className="filter-actions"><Button to={actionTo} disabled={!actionTo} icon="plus">{action}</Button></div>}
  </form>;
}
export function Shortcut({ title, text, icon, to, cta = 'Abrir' }) {
  return <div className="shortcut"><span className="shortcut-icon"><Glyph name={icon} size={21}/></span>
    <strong>{title}</strong><p>{text}</p><Button to={to} variant="soft">{cta} <Glyph name="arrow-right" size={14}/></Button></div>;
}
export function SectionBlock({ number, title, subtitle, children }) {
  return <Card className="form-section" title={`${number}. ${title}`} description={subtitle}>{children}</Card>;
}
export function FormGrid({ children, columns = 3 }) {
  return <div className={`form-grid form-grid-${columns}`}>{children}</div>;
}
export function FormActions({ back, backLabel='Voltar', submitLabel='Salvar rascunho' }) {
  return <div className="form-actions"><Button to={back} variant="outline" icon="arrow-left">{backLabel}</Button>
    <div className="form-actions-right"><Button type="submit" icon="save" disabled>{submitLabel}</Button></div></div>;
}
