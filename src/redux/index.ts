import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware),
});