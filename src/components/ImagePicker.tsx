import { clsx } from 'clsx';
import type { Image } from '../types/image.type';
import { FaCheck } from 'react-icons/fa6';
import { useEffect } from 'react';

interface IProps {
  list: Image[];
  colNum?: number;
  value?: Image;
  onSelect?: (value: Image) => void;
  defaultValue?: Image
}
const ImagePicker = ({ list, colNum = 4, onSelect, value, defaultValue }: IProps) => {
  const colNumMap = new Map([
    [1, 'grid-cols-1'],
    [2, 'grid-cols-2'],
    [3, 'grid-cols-3'],
    [4, 'grid-cols-4'],
    [5, 'grid-cols-5'],
  ]);
  const handleSelect = async (value: Image) => {
    await preloadImage(value.url)
    onSelect?.(value);
  };

  useEffect(() => {
    if (!defaultValue) return;
    handleSelect(defaultValue);
  }, [defaultValue])
  const preloadImage = (url: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = reject;
    });
  };
  return (
    <div className={clsx('grid gap-2', colNumMap.get(colNum))}>
      {list.map((item) => {
        const isSelected = value?.id == item.id;
        return (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className={clsx(
              'h-14 hover:opacity-85 relative cursor-pointer transition-all duration-150 ease-in rounded overflow-hidden',
              isSelected && 'ring-2 ring-primary',
            )}
          >
            {isSelected && (
              <div className='absolute flex w-full h-full bg-black/30 items-center justify-center'>
                <FaCheck size={18} className="text-primary font-bold" />
              </div>
            )}
            <img loading='lazy' className={clsx('w-full h-full')} src={item.url} alt="" />
          </div>
        );
      })}
    </div>
  );
};

export default ImagePicker;
