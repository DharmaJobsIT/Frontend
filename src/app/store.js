import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { api } from "../services/api";
import adminReducer from "../features/admin/adminSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["admin"], // persist only admin slice
};

const rootReducer = combineReducers({
  admin: adminReducer,
  [api.reducerPath]: api.reducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
