import { useFormContext } from 'react-hook-form';

const TimeValidationError = () => {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors.toTime?.message as string;
  if (!error) return null;

  return <p className="text-red-500 text-xs italic mb-2">{error}</p>;
};

export default TimeValidationError;
