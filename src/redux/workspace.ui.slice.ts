import { createSlice } from '@reduxjs/toolkit';

interface WorkspaceModalState {
  open: boolean;
}

const initialState: WorkspaceModalState = {
  open: false,
};
const workspaceUiSlice = createSlice({
  name: 'workspaceUI',
  initialState,
  reducers: {
    openModal: (state) => {
      state.open = true;
    },
    closeModal: (state) => {
      state.open = false;
    },
  },
});

export default workspaceUiSlice.reducer;
export const { openModal, closeModal } = workspaceUiSlice.actions;
