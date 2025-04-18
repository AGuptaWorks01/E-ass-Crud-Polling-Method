Register Api

> PORT
> `http://localhost:3100/auth/register`

> LOGIN
> `http://localhost:3100/auth/login`

> Api for Pagination with Sorting
> `http://localhost:3100/product/products?page=1&sort=asc` > `http://localhost:3100/product/products?page=2&sort=desc`

Adding Category
POST

> `http://localhost:3100/category/categories`
> GET
> `http://localhost:3100/category/categories`

Adding Product
POST (Add new product)

> `http://localhost:3100/product/products`

> GET (Get All product)
> `http://localhost:3100/product/products`

> GET (Get product By Id)
> `http://localhost:3100/product/products/:id`

> PUT (Update product details)
> `http://localhost:3100/product/products/:is`

> DELETE
> `http://localhost:3100/product/products/:id`

Add Category

> ``

## Api for pagination:

> GET (asc)
> `http://localhost:3100/product/products?page=1`
> GET (desc)
> `http://localhost:3100/product/products?page=2`

## Api for Price Sort:

> GET (asc)
> `http://localhost:3100/product/products?page=1&sort=asc`
> GET (desc)
> `http://localhost:3100/product/products?page=1&sort=desc`

## Api for Search By Product-Name & Category

`http://localhost:3100/product/products?search=Computer`
