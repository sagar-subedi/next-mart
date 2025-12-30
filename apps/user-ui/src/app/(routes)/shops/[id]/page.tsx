import SellerProfile from 'apps/user-ui/src/shared/widgets/section/SellerProfile';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { Metadata } from 'next';

type Params = Promise<{ id: string }>


const fetchShopDetails = async (id: string) => {
  const response = await axiosInstance.get(`/api/get-shop-details/${id}`);
  return response.data;
};

// Dynamic metadata generator
export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { id } = await params;

  try {
    const data = await fetchShopDetails(id);

    return {
      title: `${data.shop?.bio} | DokoMart Marketplace`,
      description:
        data.shop?.description ||
        'Explore products and services from trusted sellers on DokoMart',
      openGraph: {
        title: `${data.shop?.name} | DokoMart Marketplace`,
        description:
          data.shop?.bio ||
          'Explore products and services from trusted sellers on DokoMart',
        type: 'website',
        images: [
          {
            url: data.shop?.avatar[0].fileUrl || '/images/default-shop.png',
            width: 800,
            height: 600,
            alt: data.shop?.name || 'Shop logo',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${data.shop?.name} | DokoMart Marketplace`,
        description:
          data.shop?.bio ||
          'Explore products and services from trusted sellers on DokoMart',
        images: [data.shop?.avatar || '/images/default-shop.png'],
      },
    };
  } catch (error) {
    return {
      title: 'Shop Not Found | DokoMart Marketplace',
      description: 'The requested shop could not be found.',
    };
  }
};

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  console.log('Fetching data for shop ID:', id);

  try {
    const data = await fetchShopDetails(id);
    return (
      <SellerProfile shop={data.shop} followersCount={data?.followersCount} />
    );
  } catch (error) {
    console.error('Error fetching shop details:', error);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop Not Found</h2>
        <p className="text-gray-600">The shop you are looking for does not exist or has been removed.</p>
      </div>
    );
  }
};

export default Page;
