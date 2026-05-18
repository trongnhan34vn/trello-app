import { useTranslation } from 'react-i18next';
import { FaTable } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { HiUserGroup } from 'react-icons/hi';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { useCreateWorkspaceForm } from '../hooks/useCreateWorkspaceForm';
import { useCreateWorkspaceModal } from '../hooks/useCreateWorkspaceModal';
import CreateWorkspaceModal from '../modals/workspace/CreateWorkspaceModal';
import { buildRouteWithId, ROUTES } from '../routes';
import { useListWorkspaceQuery } from '../services/workspace.service';
import Button from './Button';
import WorkspaceThumbnail from './WorkspaceThumbnail';

const SidebarComp = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const {
    open: openCreateWorkspaceModal,
    close: closeCreateWorkspaceModal,
    isOpen: isOpenCreateWorkspaceModal,
  } = useCreateWorkspaceModal();

  const { defaultValues, onSubmit } = useCreateWorkspaceForm();

  const { data: res } = useListWorkspaceQuery('');

  const workspaces = res ? res.data : [];

  const checkActive = (path: string) => {
    if (pathname == path) {
      return true;
    }
    return false;
  };

  return (
    <div className="bg-bg-secondary w-1/6 flex flex-col rounded h-full py-4">
      {/* Title */}
      <div className="flex mb-5 w-full px-3 items-center justify-between">
        <p className="font-bold">{t("dashboard:sidebar.title")}</p>
        <Button
          onClick={openCreateWorkspaceModal}
          variant="text"
          className="p-2! hover:bg-bg-tertiary text-text-muted hover:text-white"
        >
          <FiPlus />
        </Button>
      </div>
      {/* List workspaces */}
      <Sidebar backgroundColor="#121212" className="border-none! min-w-full! w-full! flex-1 overflow-scroll">
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
          {workspaces.length == 0 && (
            <div className="p-3">
              <p className="text-text-muted mb-5">
                {t("dashboard:sidebar.no_workspace_data")}
              </p>
              <Button
                className="flex items-center gap-1 whitespace-nowrap px-3!"
                onClick={openCreateWorkspaceModal}
                variant="contained"
              >
                <FiPlus />
                <span>{t("dashboard:sidebar.create_workspace_btn")}</span>
              </Button>
            </div>
          )}
          {workspaces.map((w, index) => {
            const boardPath = buildRouteWithId(ROUTES.WORKSPACE_BOARDS, w.id, index);
            const memberPath = buildRouteWithId(ROUTES.WORKSPACE_MEMBERS, w.id, index);
            const isParentActive = checkActive(boardPath) || checkActive(memberPath);
            return (
              <SubMenu
                style={{
                  backgroundColor: isParentActive ? '#282828' : '',
                  fontWeight: isParentActive ? 700 : 400,
                }}
                key={w.id}
                label={<WorkspaceThumbnail index={index} name={w.name} />}
              >
                <MenuItem
                  component={<Link to={boardPath} />}
                  style={{
                    paddingLeft: '18%',
                    backgroundColor: checkActive(boardPath) ? '#282828' : '',
                    fontWeight: checkActive(boardPath) ? 700 : 400,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FaTable />
                    <span>{t('dashboard:sidebar.board')}</span>
                  </div>
                </MenuItem>
                <MenuItem
                  component={<Link to={memberPath} />}
                  style={{
                    paddingLeft: '18%',
                    backgroundColor: checkActive(memberPath) ? '#282828' : '',
                    fontWeight: checkActive(memberPath) ? 700 : 400,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <HiUserGroup />
                    <p>{t('dashboard:sidebar.member')}</p>
                  </div>
                </MenuItem>

              </SubMenu>
            );
          })}
        </Menu>
      </Sidebar>

      <CreateWorkspaceModal
        open={isOpenCreateWorkspaceModal}
        onClose={closeCreateWorkspaceModal}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default SidebarComp;
