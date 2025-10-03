import ProductDetails from 'apps/user-ui/src/shared/components/cards/ProductDetails';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { type Metadata } from 'next';

async function fetchProductDetails(slug: string) {
  const response = await axiosInstance.get(`/products/api/get-product/${slug}`);
  return response.data.product;
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const {slug} = await params;
  const product = await fetchProductDetails(slug);

  return {
    title: `${product.title} | Eshop Marketplace`,
    description:
      product.description ||
      `Discover high quality products on Eshop Marketplace`,
    openGraph: {
      title: product?.title,
      description: product?.description,
      images: [product?.images[0].fileUrl || `/default.jpg`],
      type: 'website',
    },
    twitter: {
      card: `summary_large_image`,
      title: product?.title,
      description: product?.description,
      images: [product?.images[0].fileUrl || `/default.jpg`],
    },
  };
}


const Page = async ( {params} : { params: Params}) => {
  const {slug} = await params;

  const productDetails = await fetchProductDetails( slug);

  return <ProductDetails product={productDetails} />;
};

export default Page;
