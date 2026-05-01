import type { Checklist } from '../../types/checklist.type';
import ChecklistComponent from './ChecklistComponent';

interface IProps {
  checklists: Checklist[];
  onCreateChecklistItem: (data: any) => void;
  onUpdateCompletedStateChecklistItem: (value: any) => void;
}
const ChecklistContainer = ({
  checklists,
  onCreateChecklistItem,
  onUpdateCompletedStateChecklistItem,
}: IProps) => {
  return (
    <div className="max-h-92 h-full overflow-scroll">
      {checklists?.map((c) => {
        return (
          <ChecklistComponent
            onUpdateCompletedStateChecklistItem={onUpdateCompletedStateChecklistItem}
            onCreateChecklistItem={onCreateChecklistItem}
            key={c.id}
            checklist={c}
          />
        );
      })}
    </div>
  );
};

export default ChecklistContainer;
