import { Checkbox, Popover } from '@headlessui/react';
import CheckIcon from '@heroicons/react/16/solid/CheckIcon';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import TextEditorField from '../components/form/TextEditorField';
import Modal, { ModalSize } from '../components/Modal';
import Form from '../forms';
import { useDetailCardQuery } from '../services/card.service';
import { FaTags } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { MdChecklist } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';
import PopoverBox, { PopoverAnchor } from '../components/PopoverBox';

interface IProps {
  open: boolean;
  close: () => void;
  id: string;
  title: string;
}
const DetailCardModal = ({ open, close, title, id }: IProps) => {
  if (!id) return;

  const { data: card } = useDetailCardQuery({ id });

  useEffect(() => {
    if (!card) close();
  }, [card]);

  const [enabled, setEnabled] = useState(false);
  const [isOnEditDescription, setOnEditDescription] = useState(false);

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
      form: <>2</>,
    },
    {
      id: 3,
      icon: <MdChecklist />,
      title: 'Checklist',
      isDisabled: false,
      header: 'Add checklist',
      form: <>3</>,
    },
    {
      id: 4,
      icon: <GrGroup />,
      title: 'Member',
      isDisabled: false,
      header: 'Add member',
      form: <>4</>,
    },
  ];

  return (
    <Modal hasXMark size={ModalSize.LG} open={open} onClose={close}>
      <Modal.Header className="text-lg! border-b border-border mb-4 pb-3 ">{title}</Modal.Header>
      <Modal.Body>
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Checkbox
              checked={enabled}
              onChange={setEnabled}
              className="group size-6 rounded-md bg-bg-card p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
            >
              <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
            </Checkbox>
            <p className="text-xl font-bold text-white">{title}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {items.map((item) => {
              const { id, icon, title, isDisabled, header, form } = item;
              return (
                <PopoverBox key={id}>
                  <PopoverBox.Button disabled={isDisabled}>
                    <Button
                      disabled={isDisabled}
                      variant="outlined"
                      className="w-full"
                      color={'disabled'}
                    >
                      {icon}
                      {title}
                    </Button>
                  </PopoverBox.Button>
                  <PopoverBox.Panel anchor={PopoverAnchor.BOTTOM_END}>
                    <PopoverBox.Header>{header}</PopoverBox.Header>
                    <PopoverBox.Body>{form}</PopoverBox.Body>
                  </PopoverBox.Panel>
                </PopoverBox>
              );
            })}
          </div>

          <div>
            <div className="text-white font-bold text-lg mb-2">
              <span>Description</span>
            </div>
            <div onClick={() => setOnEditDescription(true)}>
              {isOnEditDescription ? (
                <Form defaultValues={{}} onSubmit={() => {}}>
                  <TextEditorField name="description" />
                  <div className="float-right">
                    <Button>Save</Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOnEditDescription(false);
                      }}
                      type="button"
                      variant="text"
                      className="text-text-secondary hover:text-red-500"
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="h-18 rounded-lg bg-white/5 hover:bg-white/15 p-3 text-text-secondary transition-all duration-150 ease-in cursor-pointer">
                  Add more details...
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailCardModal;
