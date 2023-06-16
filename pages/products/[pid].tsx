import React from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import data from '@/data/dummy-backend.json';

import { ProductInfo } from '../';

interface ProductDetailPageProps {
  productInfo?: ProductInfo | undefined;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productInfo }) => {
  if (!productInfo) return <p>Loading...</p>;
  return (
    <>
      <h1>{productInfo.title}</h1>
      <p>{productInfo.description}</p>
    </>
  );
};

export const getStaticProps: GetStaticProps<ProductDetailPageProps> = async (context) => {
  const { params } = context;
  if (!params)
    return {
      redirect: { destination: "/" },
      props: {}
    };

  const productId = params.pid;
  const product = data.products.find((product) => product.id === productId);

  if (!product) return { notFound: true, props: {} };

  return {
    props: {
      productInfo: product
    }
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const preloadIds = data.products.map((product) => ({ params: { pid: product.id } }));

  return {
    paths: preloadIds,
    fallback: true
  };
};

export default ProductDetailPage;
