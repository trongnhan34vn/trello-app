import { useNavigate, useParams } from 'react-router-dom';
import Carousel from '../../components/Carousel';
import { useBuildCarouselBoards } from '../../hooks/useBuildCarouselBoards';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { useDetailWorkspaceQuery } from '../../services/workspace.service';
import type { Board } from '../../types/board.type';
import { buildRouteWithId, ROUTES } from '../../routes';

const WorkspaceBoardPage = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, index } = useParams();

  const { data: workspaceApiRes } = useDetailWorkspaceQuery(id);
  const workspace = workspaceApiRes ? workspaceApiRes.data : null;

  const { buildBoards, renderBoard } = useBuildCarouselBoards();

  const handleSelectBoard = (board: Board) => {
    navigate(buildRouteWithId(ROUTES.BOARD, board.id));
  };

  return (
    <WorkspaceLayout title="List your boards" index={index || '0'} name={workspace?.name || ''}>
      <Carousel onSelect={handleSelectBoard} items={buildBoards(workspace)} render={renderBoard} />
    </WorkspaceLayout>
  );
};

export default WorkspaceBoardPage;
