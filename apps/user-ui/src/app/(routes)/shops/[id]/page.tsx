import SellerProfile from 'apps/user-ui/src/shared/widgets/section/SellerProfile';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { Metadata } from 'next';

type Params = Promise<{ id: string }>


const fetchSellerDetails = async (id: string) => {
  const response = await axiosInstance.get(`/api/get-seller/${id}`);
  return response.data;
};

// Dynamic metadata generator
export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { id } = await params;
  const data = await fetchSellerDetails(id);

  return {
    title: `${data.shop?.name} | Eshop Marketplace`,
    description:
      data.shop?.bio ||
      'Explore products and services from trusted sellers on Eshop',
    openGraph: {
      title: `${data.shop?.name} | Eshop Marketplace`,
      description:
        data.shop?.bio ||
        'Explore products and services from trusted sellers on Eshop',
      type: 'website',
      images: [
        {
          url: data.shop?.avatar || '/images/default-shop.png',
          width: 800,
          height: 600,
          alt: data.shop?.name || 'Shop logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.shop?.name} | Eshop Marketplace`,
      description:
        data.shop?.bio ||
        'Explore products and services from trusted sellers on Eshop',
      images: [data.shop?.avatar || '/images/default-shop.png'],
    },
  };
};

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  console.log('Fetching data for shop ID:', id);
  const data = await fetchSellerDetails(id);
  return (
    <SellerProfile shop={data.shop} followersCount={data?.followersCount} />
  );
};

export default Page;
