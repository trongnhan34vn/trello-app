import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const BoardLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-bg-main text-white text-sm">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="h-full flex gap-2 overflow-scroll bg-bg-secondary">
        <Outlet />
      </div>
    </div>
  );
};

export default BoardLayout;
