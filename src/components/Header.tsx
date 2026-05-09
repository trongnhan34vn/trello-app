import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoHomeOutline, IoHomeSharp, IoSearchSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import user from '../assets/user.png';
import logo from '../assets/vite.svg';
import CreateBoardForm from '../forms/board/CreateBoardForm';
import { buildRouteWithId, ROUTES } from '../routes';
import { useListImageQuery } from '../services/image.service';
import Button from './Button';
import PopoverBox, { PopoverAnchor, PopoverSize } from './PopoverBox';
import Select from './Select';
import { BOARD_ENDPOINT, http } from '../services';
import type { Board } from '../types/board.type';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data: res, refetch } = useListImageQuery();
  const images = res ? res.data : [];

  const isHome = pathname == ROUTES.DASHBOARD;

  useEffect(() => {
    if (images == null || images.length == 0) refetch();
  }, [images]);

  const [selectedBoardId, setSelectedBoardId] = useState<any>(null);

  const buildSearchOption = (board: Board) => {
    return (
      <div
        onClick={() => navigate(buildRouteWithId(ROUTES.BOARD, board.id))}
        key={board.id}
        className="flex items center gap-2"
      >
        <div className="h-10 w-10 rounded overflow-hidden">
          <img src={board.backgroundUrl} className="w-full h-full rounded object-contain" alt="" />
        </div>
        <div>
          <p className="text-white text-sm font-bold">{board.name}</p>
          <p className="text-xs text-text-secondary">{board.workspaceName}</p>
        </div>
      </div>
    );
  };

  const fetchBoards = async (search: string) => {
    try {
      const response = await http().get(
        `${BOARD_ENDPOINT.LIST}${search ? `?search=${search}` : ''}`,
      );
      const boards: Board[] = response.data.data || [];
      const options = boards.map((b) => {
        return {
          value: b.id,
          label: buildSearchOption(b)
        };
      });

      return options;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <div className="p-3 flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <img className="w-8 h-8" src={logo} alt="" />
        <p className="text-xl font-bold">Nello</p>
      </div>
      <div className="w-1/2 z-auto relative flex items-center gap-5">
        <Button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          variant="text"
          className="text-white hover:bg-bg-tertiary p-2! rounded-full"
        >
          {isHome ? (
            <IoHomeSharp size={24} />
          ) : (
            <IoHomeOutline className="text-text-muted" size={24} />
          )}
        </Button>
        <Select
          value={selectedBoardId}
          onChange={(option: any) => {
            setSelectedBoardId(option);

            navigate(
              buildRouteWithId(
                ROUTES.BOARD,
                option.value
              )
            );
          }}
          containerClassName="w-full!"
          isHiddenDropdownIcon
          options={fetchBoards}
          name="search"
          startIcon={<IoSearchSharp className="text-text-muted" size={24} />}
        />

        <PopoverBox>
          <PopoverBox.Button>
            <Button className="whitespace-nowrap">
              <div className="flex gap-2 items-center">
                <FiPlus size={20} />
                <p>{t('dashboard:header.create_board_btn')}</p>
              </div>
            </Button>
          </PopoverBox.Button>

          <PopoverBox.Panel size={PopoverSize.LG} anchor={PopoverAnchor.BOTTOM_START}>
            <PopoverBox.Header>{t('dashboard:board_create_form.title')}</PopoverBox.Header>

            <PopoverBox.Body>
              <CreateBoardForm images={images} />
            </PopoverBox.Body>
          </PopoverBox.Panel>
        </PopoverBox>
      </div>
      <div className="flex items-center gap-5">
        <div>
          <IoIosNotificationsOutline size={24} className="text-text-muted cursor-not-allowed" />
        </div>
        <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer border-3 border-transparent hover:border-border">
          <img src={user} className="w-full h-full object-contain" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
