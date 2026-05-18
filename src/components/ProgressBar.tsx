
interface IProps {
  percent: number;
}
const ProgressBar = ({ percent }: IProps) => {
  return (
    <div>
      <div className="relative transition-all duration-150 ease-in w-full h-1 bg-bg-tertiary rounded overflow-hidden">
        <div
          style={{ transform: `translateX(${percent}%)` }}
          className="absolute transition-all duration-150 ease-in w-full h-1 bg-primary top-0 -left-full rounded"
        ></div>
      </div>
      <p className="mt-1 text-text-secondary">{Math.round(percent)}%</p>
    </div>
  );
};

export default ProgressBar;
