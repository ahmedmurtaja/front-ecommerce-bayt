

1. How do you handle the pagination of the results and the caching of data

   in front-end i used MUI pagination component to handle pagination of the results and in back-end i used Sequelize ORM to handle Pagination using limit and offset

   ```javascript
   const { limit, offset } = req.query;
   const { count, rows } = await db.product.findAndCountAll({
     limit: limit ? parseInt(limit) : 10,
     offset: offset ? parseInt(offset) : 0,
   });
   ```
   and for caching in front i used LocalStorage to store the data and check if the data is already cached or not , i cached the data for 10 minutes
   ```javascript
   useEffect(() => {
     const cachedData = JSON.parse(localStorage.getItem("data"));
     if (cachedData && cachedData.expiry > Date.now()) {
       setData(cachedData.data);
     } else {
       fetchProducts();
     }
   }, []);
   ```
   > i was thinking to use Redis to cache the data but i didn't have enough time to do it

   ```javascript
   const cachedData = JSON.parse(localStorage.getItem("data"));
   ```
   
2. How do you design the UI and how it interacts with the Redux state
   
      i used MUI for the UI and i used Redux to manage the state of the application , i used Redux Thunk to handle the async actions and i used Redux Toolkit to handle the reducers and actions
   
      ```javascript
      const fetchProducts = () => async (dispatch) => {
      try {
         dispatch(setLoading(true));
         const { data } = await axios.get(
            "http://localhost:5000/api/products?limit=10&offset=0"
         );
         dispatch(setData(data));
         dispatch(setLoading(false));
         localStorage.setItem(
            "data",
            JSON.stringify({ data, expiry: Date.now() + 600000 })
         );
      } catch (error) {
         dispatch(setError(error.message));
         dispatch(setLoading(false));
      }
      };
      ```
3. How do you handle errors and how they communicate it to the users

   i used notistack to view a snack bar when an error occurs
   ```javascript
   import { enqueueSnackbar } from "../snackbar/";

   <!-- when error -->
   enqueueSnackbar({
      message: error,
      options: {
         variant: "error",
      },
   });
   ```
4. How do you design the filtering and sorting functionality
in back end i used Sequelize ORM to handle the filtering and sorting functionality
```javascript
const { limit, offset, sort, order, ...filter } = req.query;
const { count, rows } = await db.product.findAndCountAll({
   limit: limit ? parseInt(limit) : 10,
   offset: offset ? parseInt(offset) : 0,
   order: [[sort ? sort : "id", order ? order : "ASC"]],
   where: filter,
});
```

5. How do you approach the performance optimization and accessibility
   
      i Created Cache for the data to avoid fetching the data every time the user refresh the page and i used MUI for the UI to make the application responsive and i used Redux to manage the state of the application and i used Redux Thunk to handle the async actions and i used Redux Toolkit to handle the reducers and actions


