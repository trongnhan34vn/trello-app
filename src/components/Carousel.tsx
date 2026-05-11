import { type ReactNode } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface IProps<T> {
  items: T[];
  render: (item: T, w?: any) => ReactNode;
  onSelect?: (item: T) => void;
  slidesPreview?: number;
  workspace?: any;
}
const Carousel = <T,>({ items, onSelect, slidesPreview = 4, render, workspace }: IProps<T>) => {
  const wsId = workspace?.id;
  const prevClass = `custom-prev-${wsId}`;
  const nextClass = `custom-next-${wsId}`;
  return (
    <div className="relative">
      <div
        className={`${prevClass} z-10 absolute top-1/2 -translate-y-1/2 left-1 p-2 rounded-full cursor-pointer hover:bg-white/20 transition-all ease-in duration-150 drop-shadow-2xl`}
      >
        <MdKeyboardArrowLeft size={24} />
      </div>

      <div
        className={`${nextClass} z-10 absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full cursor-pointer hover:bg-white/20 transition-all ease-in duration-150 drop-shadow-2xl`}
      >
        <MdKeyboardArrowRight size={24} />
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: `.${nextClass}`,
          prevEl: `.${prevClass}`,
        }}
        spaceBetween={16}
        className="p-2! w-full"
        slidesPerView={slidesPreview}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div onClick={() => onSelect?.(item)} className="cursor-pointer">
              {render(item, workspace)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
