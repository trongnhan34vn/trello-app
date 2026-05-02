import { Checkbox } from '@headlessui/react';
import CheckIcon from '@heroicons/react/16/solid/CheckIcon';
import dayjs from 'dayjs';
import { FaRegClock } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import type { ChecklistItem } from '../../types/checklist.item.type';
import Button from '../Button';
import { useEffect, useState } from 'react';
import PopoverBox, { PopoverAnchor } from '../PopoverBox';
import DatePickerField, { DayPickerMode } from '../form/DatePickerField';
import { useFormContext, useWatch } from 'react-hook-form';
import TimeValidationError from '../TimeValidationError';
import TextField from '../form/TextField';
import TimePickerField from '../form/TimePickerField';
import clsx from 'clsx';
import Form from '../../forms';

interface IProps {
  checklistItem: ChecklistItem;
  onUpdateCompletedStateChecklistItem: (value: any) => void;
  onUpdateDueDateChecklistItem: (value: any) => void;
}

const DatePickerSync = () => {
  const { setValue } = useFormContext();
  const date = useWatch({ name: 'dueDate' });

  useEffect(() => {
    if (date) {
      setValue('to', dayjs(date).format('DD/MM/YYYY'));
    } else {
      setValue('to', '');
    }
  }, [date, setValue]);

  return null;
};

const ChecklistItemComponent = ({
  checklistItem,
  onUpdateCompletedStateChecklistItem,
  onUpdateDueDateChecklistItem,
}: IProps) => {
  const isOverdue = checklistItem?.isCompleted
    ? false
    : new Date(checklistItem?.dueDate) < new Date();

  const [isCompleted, setCompleted] = useState(false);

  useEffect(() => {
    if (!checklistItem) return;
    setCompleted(!!checklistItem?.isCompleted);
  }, [checklistItem]);

  const handleChangeCompleted = (value: boolean) => {
    onUpdateCompletedStateChecklistItem({
      id: checklistItem?.id,
      isCompleted: value,
    });
    setCompleted(value);
  };

  const defaultValues = {
    dueDate: checklistItem?.dueDate || new Date(),
    to: '',
    toTime: dayjs(checklistItem?.dueDate || new Date()).format('HH:mm') || '00:00',
  };

  const handleUpdateDueDateChecklistItem = (data: any, close: any) => {
    const payload = {
      id: checklistItem?.id,
      dueDate: dayjs(`${data.to} ${data.toTime}`, 'DD/MM/YYYY HH:mm').format('YYYY/MM/DD HH:mm:ss'),
      isCompleted: checklistItem?.isCompleted
    };
    onUpdateDueDateChecklistItem(payload);
    close();
  };

  return (
    <div className="mt-2 mb-5 flex items-center w-full justify-between">
      <div className="flex gap-3 items-center px-2  ">
        <Checkbox
          checked={isCompleted}
          onChange={handleChangeCompleted}
          className="group size-5 rounded-md bg-bg-card p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
        >
          <CheckIcon className="hidden size-3 fill-black group-data-checked:block" />
        </Checkbox>
        <p className="text-text-secondary">{checklistItem?.name}</p>
      </div>

      <div className="flex gap-3">
        {checklistItem?.dueDate && (
          <div className="text-text-secondary flex items-center gap-2 transition-all duration-150 ease-in hover:text-white px-2 py-1 bg-bg-card w-fit rounded cursor-pointer">
            {dayjs(checklistItem?.dueDate).format('DD/MM/YYYY HH:mm:ss')}
            {isOverdue && (
              <span className="ml-1 px-1.5 py-0.5 rounded text-black text-[10px] font-bold bg-red-500 uppercase tracking-wider">
                Overdue
              </span>
            )}
          </div>
        )}
        <div className="flex gap-3">
          <PopoverBox>
            {({ open }) => (
              <>
                <PopoverBox.Button>
                  <Button
                    className={clsx(
                      'px-1!',
                      open ? 'text-white!' : '',
                      'text-text-muted! hover:text-white!',
                    )}
                    variant="text"
                    color="disabled"
                  >
                    <FaRegClock />
                  </Button>
                </PopoverBox.Button>
                <PopoverBox.Panel anchor={PopoverAnchor.RIGHT_START}>
                  {({ close }) => (
                    <>
                      <PopoverBox.Header>Due Date</PopoverBox.Header>
                      <Form
                        defaultValues={defaultValues}
                        onSubmit={(data) => handleUpdateDueDateChecklistItem(data, close)}
                      >
                        <PopoverBox.Body>
                          <div className="w-full">
                            <DatePickerField
                              mode={DayPickerMode.SINGLE}
                              name="dueDate"
                              rules={{ required: '' }}
                            />
                            <DatePickerSync />
                            <div className="space-y-4">
                              <TimeValidationError />

                              <div className="grid grid-cols-2 gap-4 items-end">
                                <TextField
                                  label="Due Date"
                                  disabled
                                  name="to"
                                  containerClassName="mb-0!"
                                />
                                <TimePickerField
                                  hasDisplayError={false}
                                  name="toTime"
                                  containerClassName="mb-0!"
                                  rules={{
                                    required: 'Time is required',
                                    validate: (value: string, formValues: any) => {
                                      const dueDate = formValues.dueDate;
                                      if (!dueDate || !value) return true;

                                      const now = dayjs();
                                      const selectedDateTime = dayjs(dueDate)
                                        .hour(parseInt(value.split(':')[0]))
                                        .minute(parseInt(value.split(':')[1]));

                                      if (selectedDateTime.isBefore(now)) {
                                        return 'Due time cannot be in the past';
                                      }
                                      return true;
                                    },
                                  }}
                                />

                              </div>
                            </div>

                            <Button
                              className="w-full mt-4"
                              type="submit"
                            // onClick={close}
                            >
                              Save
                            </Button>
                          </div>
                        </PopoverBox.Body>
                      </Form>
                    </>
                  )}
                </PopoverBox.Panel>
              </>
            )}
          </PopoverBox>

          <Button
            className="text-text-muted! hover:text-red-500! px-1!"
            variant="text"
            color="disabled"
          >
            <MdDelete />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistItemComponent;
