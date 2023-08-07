import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../redux/ProductSlice'; // Import your productSlice reducer

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
