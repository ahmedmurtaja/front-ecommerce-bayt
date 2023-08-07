import ReactDOM from 'react-dom';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';
import productReducer from './redux/ProductSlice';

const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
  <Provider store={store}>
    <App />
  </Provider>
  </SnackbarProvider>,
  document.getElementById('root')
);
