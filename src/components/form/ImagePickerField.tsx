import { Controller, useFormContext } from 'react-hook-form';
import type { Image } from '../../types/image.type';
import ImagePicker from '../ImagePicker';
import FormErrorMessage from './FormErrorMessage';
import board_skeleton from '../../assets/board_skeleton.svg'

interface IProps {
  label?: string;
  name: string;
  list: Image[];
  rules?: any;
  hasPreview?: boolean;
}
const ImagePickerField = ({ name, list = [], label, rules, hasPreview }: IProps) => {
  const { control, watch } = useFormContext();
  const selectImage = watch(name) as Image;
  return (
    <div className="mb-2">
      {hasPreview && selectImage && (
        <div className="w-2/3 mx-auto h-36 mb-2 rounded overflow-hidden relative">
          <img className='h-full w-full object-cover' loading='lazy' src={selectImage?.url} alt="" />
          <img className='w-4/5 mx-auto h-full absolute top-0 left-1/2 -translate-x-1/2' src={board_skeleton} alt="" />
        </div>
      )}

      {label && (
        <label htmlFor="" className="text-white text-sm mb-1 block font-semibold">
          {label} {rules?.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <ImagePicker list={list} onSelect={onChange} value={value} defaultValue={list[0]} />
              <FormErrorMessage message={error?.message} />
            </>
          );
        }}
      />
    </div>
  );
};

export default ImagePickerField;
