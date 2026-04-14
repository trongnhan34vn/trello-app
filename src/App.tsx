import { Route, Routes } from 'react-router-dom';
import './App.css';
import { routes } from './routes';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const layouts = [...new Set(routes.map((r) => r.layout))];

  return (
    <>
      <Routes>
        {layouts.map((l, index) => {
          const Layout = l;
          return (
            <Route key={index} element={<Layout />}>
              {routes
                .filter((r) => r.layout == l)
                .map((r) => {
                  const Component = r.component;
                  const element = r.isPrivate ? (
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Component />
                  );
                  return <Route key={r.path} element={element} path={r.path} />;
                })}
            </Route>
          );
        })}
      </Routes>
    </>
  );
}

export default App;
