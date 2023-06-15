import { GetStaticProps } from 'next';

import data from '@/data/dummy-backend.json';

type ProductInfo = {
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
            {product.title} <p>{product.description}</p>
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
