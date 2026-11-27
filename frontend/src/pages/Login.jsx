import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Activity, LockKeyhole, UserRound } from 'lucide-react';
import { Button } from '../components/UI';
import { sectors } from '../config/navigation';

export default function Login() {
  const [profile,setProfile]=useState('recepcao');
  const navigate=useNavigate();
  return <main className="login-page"><div className="login-card"><header className="login-brand">
    <span className="login-mark"><Activity size={32}/></span><h1>Sistema Rita</h1>
    <p>Tecnologia a serviço do cuidado.</p>
  </header><form onSubmit={e=>e.preventDefault()} className="login-form">
      <label className="login-label">Usuário ou E-mail<span className="login-input"><UserRound size={19}/><input type="text" placeholder="Digite seu e-mail ou usuário" autoComplete="username" /></span></label>
      <label className="login-label">Senha<span className="login-input"><LockKeyhole size={19}/><input type="password" placeholder="Digite sua senha" autoComplete="current-password" /></span></label>
      <Button type="submit" className="login-button" disabled>Entrar</Button>
    </form>
    <p className="login-foot">Portal dos profissionais da policlínica.</p>
  </div>
  {import.meta.env.DEV&&<div className="preview-switch"><span>Prévia de desenvolvimento</span>
    <select value={profile} onChange={e=>setProfile(e.target.value)} aria-label="Selecionar perfil para prévia">
      {Object.entries(sectors).map(([key,s])=><option key={key} value={key}>{s.label}</option>)}
    </select><Button onClick={() => navigate(sectors[profile].start)}>Abrir setor</Button></div>}
  </main>;
}
