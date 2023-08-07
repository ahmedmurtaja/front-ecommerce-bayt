import { Container, Typography } from '@mui/material';
import ProductList from './components/ProductList';
import './index.css';

function App() {
  return (
    <Container
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        minHeight: '100vh', 
      }}
    >
      <Typography variant="h4" gutterBottom sx={
        {
          textAlign: 'center',
          alignSelf: 'center',
          marginTop: '20px',
        }
      }>
        Bayt E-Commerce
      </Typography>
      <ProductList />
    </Container>
  );
}

export default App;
