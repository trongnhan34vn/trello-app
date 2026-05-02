import type { Checklist } from '../../types/checklist.type';
import ChecklistComponent from './ChecklistComponent';

interface IProps {
  checklists: Checklist[];
  onCreateChecklistItem: (data: any) => void;
  onUpdateCompletedStateChecklistItem: (value: any) => void;
  onUpdateDueDateChecklistItem: (payload: any) => void;
  onUpdateChecklistName: (payload: any) => void;
  onDeleteChecklistItem: (value: any) => void;
  onDeleteChecklist: (value: any) => void;
}
const ChecklistContainer = ({
  checklists,
  onCreateChecklistItem,
  onUpdateCompletedStateChecklistItem,
  onUpdateDueDateChecklistItem,
  onUpdateChecklistName,
  onDeleteChecklistItem,
  onDeleteChecklist
}: IProps) => {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto pb-4 pr-2 custom-scrollbar">
      {checklists?.map((c) => {
        return (
          <ChecklistComponent
            onDeleteChecklist={onDeleteChecklist}
            onDeleteChecklistItem={onDeleteChecklistItem}
            onUpdateChecklistName={onUpdateChecklistName}
            onUpdateDueDateChecklistItem={onUpdateDueDateChecklistItem}
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
