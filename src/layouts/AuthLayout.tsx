import logo from '../assets/vite.svg';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <section className="w-full max-h-screen pt-18 h-screen bg-bg-main">
      <div className="mx-auto w-1/4 rounded py-10 drop-shadow-2xl bg-bg-secondary">
        <div className="flex items-center pt-10 gap-5 justify-center">
          <img src={logo} />
          <h1 className="font-bold text-white text-4xl">Trello</h1>
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default AuthLayout;
