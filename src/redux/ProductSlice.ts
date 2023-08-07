import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductState {
  products: Product[];
  categories: string[];
}

const initialState: ProductState = {
  products: [],
  categories: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
  },
});

export const { setProducts, setCategories } = productSlice.actions;
export default productSlice.reducer;
