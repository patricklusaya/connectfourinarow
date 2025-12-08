import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

