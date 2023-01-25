import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import storage from 'redux-persist/lib/storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import transactionsReducer from './transactions/transactionsSlice';
import statsReducer from './statistics/statsSlice';
import languageReducer from './lang/langSlice';
import themeReducer from './theme/themeSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'token', 'refreshToken', 'sid', 'isLoggedIn'],
};

const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    transactions: transactionsReducer,
    statistics: statsReducer,
    language: languageReducer,
    theme: themeReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
