import { FaTable } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { FiPlus } from 'react-icons/fi';
import Button from './Button';

const SidebarComp = () => {
  return (
    <div className="bg-bg-secondary w-1/6 rounded h-full py-4">
      {/* Title */}
      <div className="flex mb-5  px-3  items-center justify-between">
        <p className="font-bold">Workspaces</p>
        <Button variant='text' className='p-2! hover:bg-bg-tertiary text-text-muted hover:text-white'>
          <FiPlus />
        </Button>
      </div>
      {/* List workspaces */}
      <Sidebar backgroundColor="#121212" className="w-full! border-none!">
        <Menu
          menuItemStyles={{
            button: {
              color: '#fff',
              backgroundColor: '#121212',
              transition: 'background-color 0.2s',
              padding: '8px 10px',
              '&:hover': {
                backgroundColor: '#282828',
              },
            },
            subMenuContent: {
              backgroundColor: '#121212',
            },
          }}
        >
          {/* Workspace item */}
          <SubMenu
            label={
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center font-bold">
                  W
                </div>
                <span className="font-semibold">Workspace 1</span>
              </div>
            }
          >
            <MenuItem style={{ paddingLeft: '18%' }}>
              <div className="flex items-center gap-2">
                <FaTable />
                <p>Board</p>
              </div>
            </MenuItem>
            <MenuItem style={{ paddingLeft: '18%' }}>
              <div className="flex items-center gap-2">
                <HiUserGroup />
                <p>Member</p>
              </div>
            </MenuItem>
          </SubMenu>

          <MenuItem>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white">
                T
              </div>
              <p className="font-semibold text-white">Workspace 2</p>
            </div>
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComp;
