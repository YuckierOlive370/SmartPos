type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
};

export const products: Product[] = [
  { id: 1, name: 'Laptop', description: 'High-performance laptop', price: 10.99 },
  { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 19.99 },
  { id: 3, name: 'Keyboard', description: 'Mechanical keyboard', price: 5.99 },
];