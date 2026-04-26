import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux";
import { closeModal, openModal } from "../redux/workspace.ui.slice";

export const useCreateWorkspaceModal = () => {
    const dispatch = useDispatch();
  
    const isOpen = useSelector(
      (state: RootState) => state.workspaceUI.open
    );
  
    return {
      isOpen,
      open: () => dispatch(openModal()),
      close: () => dispatch(closeModal()),
    };
  };