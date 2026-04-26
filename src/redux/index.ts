import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services";
import workspaceUiSlice from './workspace.ui.slice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    workspaceUI: workspaceUiSlice
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;