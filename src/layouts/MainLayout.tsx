import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/SidebarComp';

const MainLayout = () => {
  return (
    <div className="h-screen flex flex-col bg-bg-main text-white text-sm">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="h-full flex gap-2 px-2 py-2">
        {/* Sidebar */}
        <Sidebar />
        {/* Boards */}
        <div className="bg-bg-secondary flex-1 w-full rounded h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
