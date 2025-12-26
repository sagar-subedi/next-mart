'use client';

import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { ArrowLeft, Loader2, MapPin, Package, Calendar, CreditCard, Tag, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

const statuses = [
  'Ordered',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const OrderDetails = () => {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(
        `/orders/api/get-order-details/${orderId}`
      );
      setOrder(res.data.order);
    } catch (error) {
      setIsLoading(false);
      console.error(`Failed to fetch order details: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);

    try {
      await axiosInstance.put(`/orders/api/update-status/${order.id}`, {
        deliveryStatus: newStatus,
      });
      setOrder((prev: any) => ({ ...prev, deliveryStatus: newStatus }));
    } catch (error) {
      console.error(`Failed to update status: ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statuses.findIndex(
    (s) => s.toLowerCase() === (order.deliveryStatus || 'ordered').toLowerCase()
  );

  return (
    <div className="bg-slate-50 min-h-screen py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/dashboard/orders" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
              Orders
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Order #{order.id.slice(-6).toUpperCase()}</span>
          </div>

          <button
            onClick={() => router.push('/dashboard/orders')}
            className="flex items-center gap-2 text-brand-primary-600 hover:text-brand-primary-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Order #{order.id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${order.status === 'Paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                  {order.status}
                </span>
                <span
                  className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${order.deliveryStatus === 'Delivered'
                      ? 'bg-green-100 text-green-700'
                      : order.deliveryStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                >
                  {order.deliveryStatus || 'Processing'}
                </span>
              </div>
              {/* Status Update Dropdown */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="status"
                  className="text-xs font-medium text-gray-600 whitespace-nowrap"
                >
                  Update Status:
                </label>
                <select
                  id="status"
                  value={order.deliveryStatus}
                  onChange={handleStatusChange}
                  disabled={isUpdating}
                  className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 disabled:opacity-50"
                >
                  {statuses.map((status) => {
                    const currentIndex = statuses.indexOf(order.deliveryStatus);
                    const statusIndex = statuses.indexOf(status);

                    return (
                      <option
                        value={status}
                        key={status}
                        disabled={statusIndex < currentIndex}
                      >
                        {status}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Progress */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Status</h2>
          <div className="relative">
            {/* Progress bar background */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }}></div>
            {/* Progress bar fill */}
            <div
              className="absolute top-4 left-0 h-0.5 bg-brand-primary-500 transition-all duration-500"
              style={{
                width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`,
                zIndex: 1,
              }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between" style={{ zIndex: 2 }}>
              {statuses.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step} className="flex flex-col items-center" style={{ flex: 1 }}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${isCompleted
                          ? 'bg-brand-primary-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-brand-primary-200' : ''}`}
                    >
                      {index + 1}
                    </div>
                    <p
                      className={`mt-2 text-[10px] font-medium text-center max-w-[70px] leading-tight ${isCompleted ? 'text-brand-primary-600' : 'text-gray-400'
                        }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-primary-500" />
              Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${(order.total + (order.discountAmount || 0)).toFixed(2)}
                </span>
              </div>
              {order?.discountAmount > 0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Discount
                    {order.couponCode && (
                      <span className="text-[10px] bg-brand-primary-100 text-brand-primary-700 px-1.5 py-0.5 rounded">
                        {order.couponCode.publicName}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-green-600">
                    -${order.discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-brand-primary-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order?.shippingAddress && (
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-primary-500" />
                Shipping Address
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-primary-500" />
            Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-brand-primary-200 hover:bg-brand-primary-50/30 transition-all"
                key={item.productId}
              >
                <Image
                  src={
                    item.product?.images[0]?.fileUrl || '/images/placeholder.png'
                  }
                  width={64}
                  height={64}
                  alt={item.product?.title || 'Product image'}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    Qty: {item.quantity}
                  </p>
                  {item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                        {Object.entries(item.selectedOptions).map(
                          ([key, value]: [string, any]) =>
                            value && (
                              <span key={key} className="bg-gray-100 px-1.5 py-0.5 rounded">
                                <span className="capitalize font-medium">
                                  {key}:{' '}
                                </span>
                                {value}
                              </span>
                            )
                        )}
                      </div>
                    )}
                </div>
                <p className="text-base font-bold text-brand-primary-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
