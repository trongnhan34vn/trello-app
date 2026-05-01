import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';
import PopoverBox, { PopoverAnchor, PopoverSize } from '../components/PopoverBox';
import { BoardConst } from '../constants';
import CreateBoardForm from '../forms/board/CreateBoardForm';
import { useListImageQuery } from '../services/image.service';
import type { Board } from '../types/board.type';
import type { Workspace } from '../types/workspace.type';

export const useBuildCarouselBoards = () => {
  const { t } = useTranslation();
  const { data: imageRes, refetch } = useListImageQuery();
  const images = imageRes ? imageRes.data : [];

  useEffect(() => {
    if (images == null || images.length == 0) refetch();
  }, [images]);

  const buildBoards = (workspace: Workspace | null) => {
    if (!workspace) return [];
    const boards = workspace.boards;
    const base: Board = {
      id: BoardConst.DEFAULT_ID,
      name: '',
      backgroundUrl: '',
    };
    if (!boards) return [base];
    return [base, ...boards];
  };

  const renderBoard = (item: Board, w?: any) => {
    if (item.id == BoardConst.DEFAULT_ID) {
      return (
        <PopoverBox className="w-full">
          <PopoverBox.Button className="w-full!">
            <div className="relative w-full opacity-85 hover:opacity-100 bg-bg-card text-text-secondary hover:text-white justify-center flex gap-2 items-center rounded h-28 font-semibold cursor-pointer hover:scale-105 transition duration-150 ease-in">
              <FaPlus />
              <p>{t('dashboard:content.create_board_btn')}</p>
            </div>
          </PopoverBox.Button>
          <PopoverBox.Panel size={PopoverSize.LG} anchor={PopoverAnchor.RIGHT}>
            <PopoverBox.Header>{t('dashboard:board_create_form.title')}</PopoverBox.Header>
            <PopoverBox.Body>
              <CreateBoardForm defaultWorkspace={w} images={images} />
            </PopoverBox.Body>
          </PopoverBox.Panel>
        </PopoverBox>
      );
    }
    return (
      <div className="relative rounded overflow-hidden h-28 font-semibold cursor-pointer hover:scale-105 transition-all duration-150 ease-in">
        <img className="w-full h-full object-cover" src={item.backgroundUrl} />
        <div className="absolute bottom-0 w-full bg-black/50 text-white px-2 py-1">{item.name}</div>
      </div>
    );
  };

	return {
		renderBoard,
		buildBoards
	}
};
