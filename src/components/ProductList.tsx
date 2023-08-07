import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Typography,
  SelectChangeEvent,
  Pagination,
} from '@mui/material';

const Container = styled.div`
  padding: 20px;
`;

const ControlGrid = styled(Grid)`
  margin-bottom: 20px;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;

  & > .MuiCardMedia-root {
    flex: 1;
  }
`;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(
        `https://bayt.onrender.com/api/v1/products?page=${currentPage}&category=${categoryFilter}&sort=${sortOption}&order=${sortOrder}`
      );
      setProducts(data.data.products.rows);
      setTotalPages(data.data.products.totalPages);
    };
    const fetchCategories = async () => {
      const { data } = await axios.get(
        `https://bayt.onrender.com/api/v1/products/categories`
      );
      console.log(data.data.categories);
      setCategories(data.data.categories);
    };
    fetchCategories();
    fetchProducts();
  }, [sortOption, sortOrder, categoryFilter, currentPage]);

  const handleSortChange = (
    event: SelectChangeEvent<string>
  ) => {
    setSortOption(event.target.value as 'name' | 'price');
  };

  const handleOrderChange = (
    event: SelectChangeEvent<string>
  ) => {
    setSortOrder(event.target.value as 'asc' | 'desc');
  };

  const handleCategoryChange = (
    event: SelectChangeEvent<string>
  ) => {
    setCategoryFilter(event.target.value as string);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Container>
       <ControlGrid container spacing={2}>
       <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={handleSortChange}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select value={sortOrder} onChange={handleOrderChange}>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={categoryFilter} onChange={handleCategoryChange}>
              <MenuItem value="all">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
       </ControlGrid>
      
     
       <Grid container spacing={2}>
        {products.map((product: Product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <StyledCard>
              <CardMedia
                component="img"
                height="200"
                image={product.image + '?v=' + product.id}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="subtitle1">
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2">Category: {product.category}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', alignSelf: 'center' }}
      />
    </Container>
  );
};

export default ProductList;