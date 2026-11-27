import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { routes } from './config/routes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, profile, render, activePath }) => (
          <Route key={path} path={path} element={profile ? (
            <Layout
              sector={profile}
              items={routes.filter(route => route.profile === profile && route.menu)}
              activePath={activePath ?? path}
            >
              {render()}
            </Layout>
          ) : render()} />
        ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
