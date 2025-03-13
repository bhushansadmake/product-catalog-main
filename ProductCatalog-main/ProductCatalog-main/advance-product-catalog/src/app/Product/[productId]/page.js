import ProductDetail from "@/app/ProductDetail/page";


const ProductPage = ({params}) => {
  return <ProductDetail id={params.productId} />;
};

export default ProductPage;
