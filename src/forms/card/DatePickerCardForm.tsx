import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Form from '..';
import Button from '../../components/Button';
import DatePickerField, { DayPickerMode } from '../../components/form/DatePickerField';
import TextField from '../../components/form/TextField';
import TimePickerField from '../../components/form/TimePickerField';
import TimeValidationError from '../../components/TimeValidationError';

dayjs.extend(customParseFormat);

const DatePickerSync = () => {
  const { setValue } = useFormContext();
  const date = useWatch({ name: 'date' });

  useEffect(() => {
    if (date?.from) {
      setValue('from', dayjs(date.from).format('DD/MM/YYYY'));
    } else {
      setValue('from', '');
    }

    if (date?.to) {
      setValue('to', dayjs(date.to).format('DD/MM/YYYY'));
    } else {
      setValue('to', '');
    }
  }, [date, setValue]);

  return null;
};


interface IProps {
  close: () => void;
  defaultValues: any
  onSubmit: (data: any) => void;
}

const DatePickerCardForm = ({ close, defaultValues: defaultValue, onSubmit }: IProps) => {
  const defaultValues = defaultValue ?? {
    date: { from: new Date(), to: new Date() },
    from: dayjs(new Date()).format('DD/MM/YYYY'),
    to: dayjs(new Date()).format('DD/MM/YYYY'),
    fromTime: '00:00',
    toTime: '00:00',
  };

  const handleSubmit = (data: any) => {
    onSubmit(data)
    close();
  };

  return (
    <div className="w-full">
      <Form defaultValues={defaultValues} onSubmit={handleSubmit}>
        <DatePickerField mode={DayPickerMode.RANGE} name="date" rules={{ required: '' }} />
        <DatePickerSync />
        <div className="space-y-4">
          <TimeValidationError />
          <div className="grid grid-cols-2 gap-4 items-end">
            <TextField label="Start Date" disabled name="from" containerClassName="mb-0!" />
            <TimePickerField name="fromTime" containerClassName="mb-0!" />
          </div>
          <div className="grid grid-cols-2 gap-4 items-end">
            <TextField label="Due Date" disabled name="to" containerClassName="mb-0!" />
            <TimePickerField
              hasDisplayError={false}
              name="toTime"
              containerClassName="mb-0!"
              rules={{
                validate: (value: string, formValues: any) => {
                  const dueDate = formValues.date?.to;
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

        <Button className="w-full mt-4">Save</Button>
      </Form>
    </div>
  );
};

export default DatePickerCardForm;
