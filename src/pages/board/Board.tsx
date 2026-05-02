import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { MdGroupAdd } from 'react-icons/md';
import userImg from '../../assets/user.png';
import KanbanBoard from '../../components/board';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import Form from '../../forms';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useDetailBoardQuery } from '../../services/board.service';
import { useLoading } from '../../hooks/useLoading';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import {
  useListCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
} from '../../services/card.service';
import { useListListQuery, useCreateListMutation, useUpdateListMutation } from '../../services/list.service';
import type { CardCreateForm, DragUpdateCard } from '../../types/card.type';
import type { DragUpdateList, ListCreateForm } from '../../types/list.type';
import type { Card } from '../../types/card.type';
import type { List } from '../../types/list.type';
import type { ErrorResponse, SuccessResponse } from '../../types/api.type';

const Board = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpenInviteMemberModal, setOpenInviteMemberModal] = useState(false);
  const { show, hide } = useLoading();
  const { handle } = useMutationHandler();

  useEffect(() => {
    if (!id) navigate(ROUTES.DASHBOARD);
  }, [id]);
  if (!id) return;
  const { data: boardRes, isLoading } = useDetailBoardQuery(id);
  const board = boardRes ? boardRes.data : null;

  useEffect(() => {
    if (isLoading) {
      show();
    } else {
      hide();
    }
  }, [isLoading]);

  const { data: listRes } = useListListQuery(board?.id!, {
    skip: !board?.id,
  });
  const { data: cardRes } = useListCardQuery(board?.id!, {
    skip: !board?.id,
  });

  const lists = listRes ? listRes.data : [];
  const cards = cardRes ? cardRes.data : [];

  const [createList] = useCreateListMutation();
  const [createCard] = useCreateCardMutation();
  const [updateCard] = useUpdateCardMutation();
  const [updateList] = useUpdateListMutation();

  const handleCreateList = async (payload: ListCreateForm): Promise<List | null> => {
    let result: List | null = null;

    await handle(() => createList(payload), {
      hasLoading: false,
      onSuccess: (res: SuccessResponse<List>) => {
        toast.success(res.message);
        result = res.data;
      },
      onError: (error: ErrorResponse) => {
        toast.error(error.message);
      },
    });

    return result;
  };

  const handleCreateCard = async (payload: CardCreateForm): Promise<Card | null> => {
    let result: Card | null = null;

    await handle(() => createCard(payload), {
      hasLoading: false,
      onSuccess: (res: SuccessResponse<Card>) => {
        toast.success(res.message);
        result = res.data;
      },
      onError: (error: ErrorResponse) => {
        toast.error(error.message);
      },
    });

    return result;
  };

  const handleAsyncDragCard = async (payload: DragUpdateCard) => {
    await handle(() => updateCard(payload), {
      hasLoading: false,
    });
  };

  const handleAsyncDragList = async (payload: DragUpdateList) => {
    await handle(() => updateList(payload), {
      hasLoading: false,
    });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${board?.backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex h-full min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 justify-between h-16 w-full flex items-center bg-black/50 text-white">
        <p className="text-lg font-bold">{board?.name}</p>
        <div className="flex items-center gap-5">
          {/* List user */}
          <div className="flex">
            <div className="w-9 h-9 rounded-full">
              <img className="w-full h-full" src={userImg} alt="" />
            </div>
            <div className="-ml-1 w-9 h-9 rounded-full">
              <img className="w-full h-full" src={userImg} alt="" />
            </div>
          </div>
          <Button onClick={() => setOpenInviteMemberModal(true)}>
            <MdGroupAdd size={18} />
            <span>Invite member</span>
          </Button>
        </div>
      </div>
      {/* Kanban: một hàng, cuộn ngang (grid-cols-N khiến xuống dòng) */}
      <div className="h-full min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-hidden p-2">
        <KanbanBoard
          items={cards}
          columns={lists}
          boardId={id}
          onCreateList={handleCreateList}
          onCreateCard={handleCreateCard}
          onDragCard={handleAsyncDragCard}
          onDragList={handleAsyncDragList}
        />
      </div>
      {/* Modal */}
      <Modal
        hasXMark
        open={isOpenInviteMemberModal}
        onClose={() => setOpenInviteMemberModal(false)}
      >
        <Modal.Header>Invite Member</Modal.Header>
        <Modal.Body>
          <Form defaultValues={{}} onSubmit={() => { }}>
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <Select isMulti isSearchable name="member" options={async () => []} />
              </div>
              <Button className="">Send</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Board;
