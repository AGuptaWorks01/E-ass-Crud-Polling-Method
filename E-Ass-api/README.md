Register Api

> PORT
> `http://localhost:3100/api/auth/register`

> LOGIN
> `http://localhost:3100/api/auth/login`

> Api for Pagination with Sorting
> `http://localhost:3100/api/product?page=1&sort=asc` > `http://localhost:3100/products?page=2&sort=desc`

Adding Category
POST
> `http://localhost:3100/api/categories`
> GET
> `http://localhost:3100/api/categories`
> PUT 
> `http://localhost:3100/api/categories/:id`
> Delete
> `http://localhost:3100/api/categories/:id`

Adding Product
POST (Add new product)

> `http://localhost:3100/api/products`

> GET (Get All product)
> `http://localhost:3100/api/products`

> GET (Get product By Id)
> `http://localhost:3100/api/producs/:id`

> PUT (Update product details)
> `http://localhost:3100/api/products/:is`

> DELETE
> `http://localhost:3100/api/products/:id`


## Api for pagination:

> GET (asc)
> `http://localhost:3100/api/products?page=1`
> GET (desc)
> `http://localhost:3100/api/products?page=2`

## Api for Price Sort:

> GET (asc)
> `http://localhost:3100/api/products?page=1&sort=asc`
> GET (desc)
> `http://localhost:3100/api/products?page=1&sort=desc`

## Api for Search By Product-Name & categories

`http://localhost:3100/api/products?search=Computer`

## Report Generation CSV & XLSX

`http://localhost:3100/api/products/report/download?format=csv`
`http://localhost:3100/api/products/report/download?format=xlsx`
