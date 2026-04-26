import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/SidebarComp';

const MainLayout = () => {
  return (
    <div className="h-screen min-h-screen max-h-screen flex flex-col overflow-hidden bg-bg-main text-white text-sm">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="h-full overflow-hidden max-h-screen flex gap-2 px-2 py-2">
        {/* Sidebar */}
        <Sidebar />
        {/* Boards */}
        <div className="bg-bg-secondary flex-1 w-full  overflow-scroll rounded h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
