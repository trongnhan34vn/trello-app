import { FaTable } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';
import Button from '../../components/Button';

import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel';
import WorkspaceThumbnail from '../../components/WorkspaceThumbnail';
import { BoardConst } from '../../constants';
import { useBuildCarouselBoards } from '../../hooks/useBuildCarouselBoards';
import { useCreateWorkspaceForm } from '../../hooks/useCreateWorkspaceForm';
import { useCreateWorkspaceModal } from '../../hooks/useCreateWorkspaceModal';
import CreateWorkspaceModal from '../../modals/workspace/CreateWorkspaceModal';
import { buildRouteWithId, ROUTES } from '../../routes';
import { useListWorkspaceQuery } from '../../services/workspace.service';
import type { Board } from '../../types/board.type';
import type { Workspace } from '../../types/workspace.type';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    open: openCreateWorkspaceModal,
    close: closeCreateWorkspaceModal,
    isOpen: isOpenCreateWorkspaceModal,
  } = useCreateWorkspaceModal();
  const { data: workspaceRes } = useListWorkspaceQuery('');
  const workspaces = workspaceRes ? workspaceRes.data : [];

  const { buildBoards, renderBoard } = useBuildCarouselBoards();

  const { defaultValues, onSubmit } = useCreateWorkspaceForm();

  const handleSelectBoard = (board: Board) => {
    if (board.id == BoardConst.DEFAULT_ID) return;
    navigate(buildRouteWithId(ROUTES.BOARD, board.id));
  };

  const handleNavigate = (w: Workspace, type: string, index: number) => {
    if (type == 'board') {
      navigate(buildRouteWithId(ROUTES.WORKSPACE_BOARDS, w.id, index));
    } else {
      navigate(buildRouteWithId(ROUTES.WORKSPACE_MEMBERS, w.id, index));
    }
  };

  return (
    <div className="w-full flex-1">
      {/* List workspaces */}
      {/* Workspace item */}
      <div className="w-full relative">
        {/* title */}
        <p className="px-3 font-bold py-4 text-xl mb-5 sticky z-50 bg-bg-secondary top-0">
          {t('dashboard:content.title')}
        </p>
        {workspaces.length == 0 && (
          <div className='p-3'>
            <p className="text-text-muted mb-5">{t('dashboard:content.no_workspace_data')}</p>
            <Button
              className="flex items-center gap-1 whitespace-nowrap px-3!"
              onClick={openCreateWorkspaceModal}
              variant="contained"
            >
              <FiPlus />
              <span>{t('dashboard:content.create_workspace_btn')}</span>
            </Button>
          </div>
        )}
        {workspaces.map((w, index) => {
          const boards = buildBoards(w);
          return (
            <div key={w.id} className="mb-10 px-3">
              <div className="font-bold w-full mb-2 flex items-center justify-between">
                <WorkspaceThumbnail index={index} name={w.name} />
                <div className="flex gap-2">
                  <Button onClick={() => handleNavigate(w, 'board', index)} className="bg-bg-tertiary! text-white border-0">
                    <div className="flex items-center gap-2">
                      <FaTable />
                      <span>{t('dashboard:content.board')}</span>
                    </div>
                  </Button>
                  <Button onClick={() => handleNavigate(w, 'member', index)} className="bg-bg-tertiary! text-white border-0">
                    <div className="flex items-center gap-2">
                      <HiUserGroup />
                      <p>{t('dashboard:content.member')}</p>
                    </div>
                  </Button>
                </div>
              </div>
              {/* boards */}
              <div className="relative">
                <Carousel
                  workspace={w}
                  onSelect={handleSelectBoard}
                  items={boards}
                  render={renderBoard}
                />
              </div>
            </div>
          );
        })}
      </div>
      <CreateWorkspaceModal
        open={isOpenCreateWorkspaceModal}
        onClose={closeCreateWorkspaceModal}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default Dashboard;
