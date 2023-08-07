import { Container, Typography } from '@mui/material';
import ProductList from './components/ProductList';
import './index.css';

function App() {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bayt E-Commerce
      </Typography>
      <ProductList />
    </Container>
  );
}

export default App;
