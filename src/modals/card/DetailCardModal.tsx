import { Checkbox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/16/solid/CheckIcon';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { generateKeyBetween } from 'fractional-indexing';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaTags } from 'react-icons/fa';
import { GrGroup } from 'react-icons/gr';
import { MdAccessTime, MdChecklist, MdModeEdit, MdOutlineDescription } from 'react-icons/md';
import Button from '../../components/Button';
import ChecklistContainer from '../../components/checklist';
import Modal, { ModalSize } from '../../components/Modal';
import PopoverBox, { PopoverAnchor, PopoverSize } from '../../components/PopoverBox';
import AddMemberForm from '../../forms/card/AddMemberForm';
import DatePickerCardForm from '../../forms/card/DatePickerCardForm';
import EditDescriptionCardForm from '../../forms/card/EditDescriptionCardForm';
import CreateCheckListForm from '../../forms/checklist/CreateCheckListForm';
import { useMutationHandler } from '../../hooks/useMutationHandler';
import { UpdateCardField, useUpdateCard } from '../../hooks/useUpdateCard';
import { useDetailCardQuery, useUpdateCardMutation } from '../../services/card.service';
import {
  useCreateChecklistItemMutation,
  useDeleteChecklistItemMutation,
  useUpdateChecklistItemMutation,
} from '../../services/checklist.item.service';
import {
  useCreateChecklistMutation,
  useDeleteChecklistMutation,
  useListChecklistQuery,
  useUpdateChecklistMutation,
} from '../../services/checklist.service';
import type { ErrorResponse } from '../../types/api.type';
import type { ChecklistItemCreatePayload } from '../../types/checklist.item.type';
import type { ChecklistCreatePayload } from '../../types/checklist.type';
import { useParams } from 'react-router-dom';
import { useListBoardMemberQuery } from '../../services/board.member.service';

interface IProps {
  open: boolean;
  close: () => void;
  id: string;
  title: string;
}
const DetailCardModal = ({ open, close, title, id }: IProps) => {
  if (!id) return;
  const { id: boardId } = useParams();

  const { data: resCard } = useDetailCardQuery({ id }, { skip: !open });
  const card = resCard ? resCard.data : null;

  useEffect(() => {
    if (!card) close();
  }, [card]);

  const [isOnEditDescription, setOnEditDescription] = useState(false);

  const { handle } = useMutationHandler();
  const [updateCard] = useUpdateCardMutation();
  const [createChecklist] = useCreateChecklistMutation();
  const [createChecklistItem] = useCreateChecklistItemMutation();
  const [updateChecklistItem] = useUpdateChecklistItemMutation();
  const [deleteChecklistItem] = useDeleteChecklistItemMutation();

  const [updateChecklist] = useUpdateChecklistMutation();
  const [deleteChecklist] = useDeleteChecklistMutation();

  const { data: resChecklist } = useListChecklistQuery(
    { cardId: card?.id ?? id ?? '' },
    {
      skip: !card?.id,
    },
  );

  const { data: resBoardMember } = useListBoardMemberQuery(
    { boardId: boardId || '' },
    {
      skip: !boardId,
    },
  );

  const boardMembers = resBoardMember ? resBoardMember.data : [];

  const checklists = resChecklist ? resChecklist.data : null;

  const handleEditDateCard = (data: any) => {
    const startDate = dayjs(`${data.from} ${data.fromTime}`, 'DD/MM/YYYY HH:mm').format(
      'YYYY/MM/DD HH:mm:ss',
    );
    const dueDate = dayjs(`${data.to} ${data.toTime}`, 'DD/MM/YYYY HH:mm').format(
      'YYYY/MM/DD HH:mm:ss',
    );

    const payload = {
      id: card?.id || id || '',
      startDate,
      dueDate,
    };

    handle(() => updateCard(payload), {
      hasLoading: false,
      onError: (error: ErrorResponse) => toast.error(error.message),
    });
  };

  const handleCreateChecklist = (data: ChecklistCreatePayload) => {
    const lastestPos = checklists?.[checklists?.length - 1]?.position ?? null;
    const position = generateKeyBetween(lastestPos, null);

    const payload = { ...data, position };

    handle(() => createChecklist(payload), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleCreateChecklistItem = (data: ChecklistItemCreatePayload) => {
    handle(() => createChecklistItem(data), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleUpdateCompletedStateChecklistItem = (value: any) => {
    const payload = {
      id: value.id,
      isCompleted: value.isCompleted,
    };
    handle(() => updateChecklistItem(payload), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleUpdateDueDateChecklistItem = (payload: any) => {
    handle(() => updateChecklistItem(payload), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleUpdateChecklistName = (payload: any) => {
    handle(() => updateChecklist(payload), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleDeleteChecklistItem = (value: any) => {
    handle(() => deleteChecklistItem(value), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const handleDeleteChecklist = (value: any) => {
    handle(() => deleteChecklist(value), {
      hasLoading: false,
      onError: (error: any) => toast.error(error.message),
    });
  };

  const items = [
    {
      id: 1,
      icon: <FaTags />,
      title: 'Tag',
      isDisabled: true,
      form: null,
    },
    {
      id: 2,
      icon: <MdAccessTime />,
      title: 'Date',
      isDisabled: false,
      header: 'Date',
      defaultValues: {
        date: {
          from: card?.startDate ? dayjs(card.startDate).toDate() : new Date(),
          to: card?.dueDate ? dayjs(card.dueDate).toDate() : new Date(),
        },
        from: card?.startDate
          ? dayjs(card.startDate).format('DD/MM/YYYY')
          : dayjs().format('DD/MM/YYYY'),
        to: card?.dueDate ? dayjs(card.dueDate).format('DD/MM/YYYY') : dayjs().format('DD/MM/YYYY'),
        fromTime: card?.startDate ? dayjs(card.startDate).format('HH:mm') : '00:00',
        toTime: card?.dueDate ? dayjs(card.dueDate).format('HH:mm') : '00:00',
      },

      form: ({ close, defaultValues }: any) => (
        <DatePickerCardForm
          defaultValues={defaultValues}
          onSubmit={handleEditDateCard}
          close={close}
        />
      ),
    },
    {
      id: 3,
      icon: <MdChecklist />,
      title: 'Checklist',
      isDisabled: false,
      header: 'Add Checklist',
      defaultValues: {
        name: '',
        position: null,
        cardId: card?.id || id || '',
      },
      form: ({ close, defaultValues }: any) => (
        <CreateCheckListForm
          onSubmit={handleCreateChecklist}
          defaultValues={defaultValues}
          close={close}
        />
      ),
    },
    {
      id: 4,
      icon: <GrGroup />,
      title: 'Member',
      isDisabled: false,
      header: 'Add member',
      size: PopoverSize.LG,
      form: () => <AddMemberForm members={boardMembers} />,
    },
  ];

  const { onSubmit } = useUpdateCard(card?.id || id || '', UpdateCardField.COMPLETED);

  const buildCarđDescription = () => {
    if (!card) return null;

    if (isOnEditDescription) {
      return (
        <EditDescriptionCardForm
          defaultValues={{ description: card.description || '' }}
          cardId={card.id}
          closeOnEditDescription={() => setOnEditDescription(false)}
        />
      );
    }

    if (card.description) {
      return (
        <p
          dangerouslySetInnerHTML={{ __html: card.description }}
          className="text-text-secondary whitespace-pre-wrap"
        ></p>
      );
    }

    return (
      <div className="h-18 rounded-lg bg-white/5 hover:bg-white/15 p-3 text-text-secondary transition-all duration-150 ease-in cursor-pointer">
        Add more details...
      </div>
    );
  };

  const buildDate = () => {
    if (!card?.startDate || !card?.dueDate) return null;

    const now = dayjs();
    const startDate = dayjs(card.startDate);
    const dueDate = dayjs(card.dueDate);

    if (!startDate.isValid() || !dueDate.isValid()) return null;

    const isOverdue = dueDate.isBefore(now);

    return (
      <div className="px-4">
        <p className="font-bold text-text-secondary mb-1">Ngày</p>
        <div className="text-text-secondary flex items-center gap-2 transition-all duration-150 ease-in hover:text-white px-2 py-1 bg-bg-tertiary w-fit rounded cursor-pointer">
          {startDate.format('DD/MM/YYYY')} - {dueDate.format('DD/MM/YYYY HH:mm:ss')}
          {isOverdue && (
            <span className="ml-1 px-1.5 py-0.5 rounded text-black text-[10px] font-bold bg-red-500 uppercase tracking-wider">
              Overdue
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal className="" hasXMark size={ModalSize.LG} open={open} onClose={close}>
      <Modal.Header className="text-lg! border-b border-border mb-4 pb-3 ">
        {card?.title || title || ''}
      </Modal.Header>
      <Modal.Body className="flex flex-col">
        <div className="shrink-0">
          <div className="flex items-center gap-4 mb-8">
            <Checkbox
              checked={card?.completed ? true : false}
              onChange={(c) => onSubmit({ isCompleted: c })}
              className="group size-6 rounded-md bg-bg-card p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
            >
              <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
            </Checkbox>
            <p className="text-xl font-bold text-white">{card?.title || title || ''}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8 px-4">
            {items.map((item) => {
              const { id, icon, title, isDisabled, header, form, size, defaultValues } = item;
              return (
                <PopoverBox key={id}>
                  {({ open }) => (
                    <>
                      <PopoverBox.Button disabled={isDisabled}>
                        <Button
                          disabled={isDisabled}
                          variant="outlined"
                          className={clsx('w-full', open && 'font-bold text-white bg-white/10')}
                          color={'disabled'}
                        >
                          {icon}
                          {title}
                        </Button>
                      </PopoverBox.Button>
                      <PopoverBox.Panel
                        size={size || PopoverSize.MD}
                        anchor={PopoverAnchor.BOTTOM_END}
                      >
                        {({ close }) => (
                          <>
                            <PopoverBox.Header>{header}</PopoverBox.Header>
                            <PopoverBox.Body>{form?.({ close, defaultValues })}</PopoverBox.Body>
                          </>
                        )}
                      </PopoverBox.Panel>
                    </>
                  )}
                </PopoverBox>
              );
            })}
          </div>
          <div className="mb-5">{buildDate()}</div>
          <div className="mb-5">
            <div className="text-white flex items-center justify-between font-bold text-lg mb-2">
              <p className="flex gap-5 items-center">
                <MdOutlineDescription />
                <span>Description</span>
              </p>

              {card?.description && (
                <Button
                  onClick={() => setOnEditDescription(true)}
                  className="hover:text-white! text-text-secondary!"
                  color="disabled"
                  variant="outlined"
                >
                  <MdModeEdit />
                  <span>Edit</span>
                </Button>
              )}
            </div>
            {card?.description ? (
              <div>{buildCarđDescription()}</div>
            ) : (
              <div onClick={() => setOnEditDescription(true)}>{buildCarđDescription()}</div>
            )}
          </div>
        </div>
        <ChecklistContainer
          onDeleteChecklist={handleDeleteChecklist}
          onDeleteChecklistItem={handleDeleteChecklistItem}
          onUpdateChecklistName={handleUpdateChecklistName}
          onUpdateDueDateChecklistItem={handleUpdateDueDateChecklistItem}
          onUpdateCompletedStateChecklistItem={handleUpdateCompletedStateChecklistItem}
          onCreateChecklistItem={handleCreateChecklistItem}
          checklists={checklists || []}
        />
      </Modal.Body>
    </Modal>
  );
};

export default DetailCardModal;
