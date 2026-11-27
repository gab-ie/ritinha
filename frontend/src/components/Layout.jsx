import { Link, useLocation } from 'react-router';
import { Activity, PanelLeft, CircleUserRound } from 'lucide-react';
import { useState } from 'react';
import { sectors } from '../config/navigation';
import { Glyph } from './UI';

export function Layout({ sector, items, activePath, children }) {
  const cfg = sectors[sector];
  const [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  return <div className="app-shell">
    {mobileMenu && <div className="scrim" onClick={()=>setMobileMenu(false)} />}
    <aside className={`sidebar ${mobileMenu?'sidebar--open':''}`}>
      <Link to={cfg.start} className="brand" onClick={()=>setMobileMenu(false)}>
        <span className="brand-mark"><Activity size={23} strokeWidth={1.8} /></span>
        <span className="brand-words"><strong>Sistema Rita</strong><small>{cfg.subtitle}</small></span>
      </Link>
      <nav id="sector-navigation" className="nav" aria-label={`Navegação - ${cfg.label}`}>
        {items.map(item=><Link onClick={()=>setMobileMenu(false)} key={item.path} to={item.path} aria-current={item.path === activePath ? 'page' : undefined}
          className={`nav-link ${item.path === activePath ? 'is-active' : ''}`}>
          <Glyph name={item.menu.icon} size={18}/><span>{item.menu.label}</span>
        </Link>)}
        {import.meta.env.DEV && <Link className="nav-link" to="/">Trocar setor da prévia</Link>}
      </nav>
      <div className="sidebar-foot"><span className="sidebar-foot-dot"/>Tecnologia a serviço do cuidado.</div>
    </aside>
    <div className="page-column">
      <header className="topbar"><button onClick={()=>setMobileMenu(!mobileMenu)} className="menu-trigger" aria-expanded={mobileMenu} aria-controls="sector-navigation" aria-label={mobileMenu ? 'Fechar navegação' : 'Abrir navegação'}><PanelLeft size={22}/></button>
        <span className="topbar-section">{cfg.label}</span>
        <div className="topbar-user"><CircleUserRound size={24}/><span>{cfg.role}<small>{cfg.subtitle}</small></span></div>
      </header>
      <main className="page-content" key={location.pathname}>{children}</main>
    </div>
  </div>;
}
