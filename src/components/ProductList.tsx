/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { connect } from 'react-redux';
import axios, { AxiosError } from 'axios';
import {
  Skeleton,
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
import styled from 'styled-components';
import { RootState } from './store';
import { setProducts, setCategories } from '../redux/ProductSlice';


const isItemExpired = (item:any) => {
  return Date.now() > item.expiration;
};

const storeItem = (key:string, value:any, expiration:number) => {
  const item = { value, expiration };
  localStorage.setItem(key, JSON.stringify(item));
};

const retrieveItem = (key:string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

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

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface ProductListProps {
  products: Product[];
  categories: string[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: string[]) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  setProducts,
  setCategories,
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [sortOption, setSortOption] = React.useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number>(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const cacheKey = `products-${currentPage}-${categoryFilter}-${sortOption}-${sortOrder}`;
        const cachedData = retrieveItem(cacheKey);

        if (cachedData && !isItemExpired(cachedData)) {
          setProducts(cachedData.value);
          setTotalPages(cachedData.totalPages);
        } else {
          const { data } = await axios.get(
            `https://bayt.onrender.com/api/v1/products?page=${currentPage}&category=${categoryFilter}&sort=${sortOption}&order=${sortOrder}`
          );

          setProducts(data.data.products.rows);
          setTotalPages(data.data.products.totalPages);

          const expiration = Date.now() + 600000; // 10 minutes expiration
          storeItem(cacheKey, data.data.products.rows, expiration);
        }
      } catch (error) {
        const err = error as AxiosError;
        enqueueSnackbar(`Error fetching products ${err.message} `, { variant: 'error' });
      }

      setLoading(false);
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `https://bayt.onrender.com/api/v1/products/categories`
        );
        setCategories(data.data.categories);
      } catch (error) {
        enqueueSnackbar('Error fetching categories', { variant: 'error' });
      }
    };

    fetchCategories();
    fetchProducts();
  }, [currentPage, categoryFilter, sortOption, sortOrder, setProducts, setCategories]);

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
        {loading &&
          Array.from({ length: 9 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <StyledCard>
                <Skeleton variant="rectangular" height={200} width={500} />
                <CardContent>
                  <Skeleton height={24} width="80%" />
                  <Skeleton height={18} width="60%" />
                  <Skeleton height={18} width="40%" />
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        {!loading &&
          products.map((product: Product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardMedia
                  component="img"
                  width="500"
                  sx={{ maxHeight: 200 }}
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

const mapStateToProps = (state: RootState) => ({
  products: state.products.products,
  categories: state.products.categories,
});

const mapDispatchToProps = {
  setProducts,
  setCategories,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
