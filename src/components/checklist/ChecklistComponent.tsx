import clsx from 'clsx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { generateKeyBetween } from 'fractional-indexing';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FaPlus, FaRegClock } from 'react-icons/fa6';
import Form from '../../forms';
import type { Checklist } from '../../types/checklist.type';
import Button from '../Button';
import DatePickerField, { DayPickerMode } from '../form/DatePickerField';
import TextField from '../form/TextField';
import TimePickerField from '../form/TimePickerField';
import PopoverBox, { PopoverAnchor } from '../PopoverBox';
import ProgressBar from '../ProgressBar';
import TimeValidationError from '../TimeValidationError';
import ChecklistHeader from './ChecklistHeader';
import ChecklistItemComponent from './ChecklistItemComponent';

dayjs.extend(customParseFormat);

interface IProps {
  checklist: Checklist;
  onCreateChecklistItem: (data: any) => void;
  onUpdateCompletedStateChecklistItem: (value: any) => void;
  onUpdateDueDateChecklistItem: (payload: any) => void;
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

const ChecklistComponent = ({
  checklist,
  onCreateChecklistItem,
  onUpdateCompletedStateChecklistItem,
  onUpdateDueDateChecklistItem
}: IProps) => {
  if (!checklist) return;
  const { name, checklistItems } = checklist;

  const getPercent = () => {
    if (checklistItems == null) return 0;
    let total = checklistItems.length;
    if (total == 0) return 0;
    let numOfCompleted = checklistItems.filter((ci) => ci.isCompleted == true).length;
    return (numOfCompleted / total) * 100;
  };

  const [onShowCreateChecklistItem, setOnShowCreateChecklistItem] = useState({
    checklistId: '',
    state: false,
  });

  const isOnCreateChecklistItem =
    onShowCreateChecklistItem.checklistId == checklist?.id && onShowCreateChecklistItem.state;

  const defaultValues = {
    position: null,
    dueDate: null,
    to: '',
    toTime: null,
    checklistId: checklist?.id || '',
    name: '',
  };

  const [isSubmitWithDueDate, setSubmitWithDueDate] = useState({
    checklistId: '',
    state: false,
  });

  const handleSubmit = (data: any) => {
    if (!data.checklistId) return;

    const checklistItems = checklist.checklistItems;
    const lastPos = checklistItems?.[checklistItems?.length - 1]?.position ?? null;

    const position = generateKeyBetween(lastPos, null);

    if (isSubmitWithDueDate.checklistId == checklist?.id && isSubmitWithDueDate.state) {
      const dueTime = data.toTime;
      const dueDay = dayjs(data.dueDate).format('DD/MM/YYYY');

      const raw = `${dueDay} ${dueTime}:00`;
      const parsed = dayjs(raw, 'DD/MM/YYYY HH:mm:ss', true);

      if (!parsed.isValid()) {
        console.error('Invalid date:', raw);
      }

      const dueDate = parsed.format('YYYY/MM/DD HH:mm:ss');

      data = { ...data, dueDate, position };
    } else {
      data = { ...data, position, dueDate: null };
    }

    onCreateChecklistItem(data);
    setOnShowCreateChecklistItem({ checklistId: checklist?.id || '', state: false });
    setSubmitWithDueDate({ checklistId: checklist?.id || '', state: false });
  };

  return (
    <div className="mb-8">
      <ChecklistHeader title={name} />
      <ProgressBar percent={getPercent()} />
      <div>
        {checklistItems.map((ci) => {
          return (
            <ChecklistItemComponent
              onUpdateDueDateChecklistItem={onUpdateDueDateChecklistItem}
              onUpdateCompletedStateChecklistItem={onUpdateCompletedStateChecklistItem}
              key={ci?.id}
              checklistItem={ci}
            />
          );
        })}
      </div>

      <div className="mt-4">
        {isOnCreateChecklistItem ? (
          <div className="p-2 bg-bg-card/20 drop-shadow-lg rounded">
            <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
              {(methods: any) => (
                <>
                  <TextField name="name" />
                  <div className="flex justify-between">
                    <div>
                      <Button>Save</Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setOnShowCreateChecklistItem({
                            checklistId: checklist?.id || '',
                            state: false,
                          });
                          setSubmitWithDueDate({ checklistId: checklist?.id || '', state: false });
                        }}
                        className="text-text-muted! hover:text-red-500!"
                        variant="text"
                      >
                        Cancel
                      </Button>
                    </div>

                    <div>
                      <PopoverBox>
                        {({ open }) => (
                          <>
                            <PopoverBox.Button>
                              <Button
                                className={clsx(
                                  'px-1!',
                                  isSubmitWithDueDate.checklistId === checklist?.id &&
                                    isSubmitWithDueDate.state
                                    ? 'text-primary!'
                                    : open
                                      ? 'text-white'
                                      : 'text-text-muted! hover:text-white!',
                                )}
                                variant="text"
                                color="disabled"
                              >
                                <FaRegClock />
                                <span>Due Date</span>
                              </Button>
                            </PopoverBox.Button>
                            <PopoverBox.Panel anchor={PopoverAnchor.RIGHT_START}>
                              {({ close }) => (
                                <>
                                  <PopoverBox.Header>Due Date</PopoverBox.Header>
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
                                        onClick={async () => {
                                          const isValid = await methods.trigger([
                                            'dueDate',
                                            'toTime',
                                          ]);
                                          if (isValid) {
                                            close();
                                            setSubmitWithDueDate({
                                              checklistId: checklist?.id || '',
                                              state: true,
                                            });
                                          }
                                        }}
                                        className="w-full mt-4"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </PopoverBox.Body>
                                </>
                              )}
                            </PopoverBox.Panel>
                          </>
                        )}
                      </PopoverBox>
                    </div>
                  </div>
                </>
              )}
            </Form>

          </div>
        ) : (
          <Button
            onClick={() =>
              setOnShowCreateChecklistItem({ checklistId: checklist?.id || '', state: true })
            }
            variant="outlined"
          >
            <FaPlus />
            <span>Add Item</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChecklistComponent;
