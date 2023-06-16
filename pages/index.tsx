import { GetStaticProps } from 'next';
import Link from 'next/link';

import data from '@/data/dummy-backend.json';

export type ProductInfo = {
  id: string;
  title: string;
  description: string;
};

interface ProductInfoProps {
  products: Array<ProductInfo>;
}

const HomePage: React.FC<ProductInfoProps> = ({ products }) => {
  return (
    <ul>
      {products.map((product) => {
        return (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export const getStaticProps: GetStaticProps<ProductInfoProps> = async () => {
  return {
    props: {
      products: data.products
    },
    revalidate: 20
  };
};

export default HomePage;
