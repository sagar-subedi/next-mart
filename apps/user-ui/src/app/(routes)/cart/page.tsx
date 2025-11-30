'use client';

import { useQuery } from '@tanstack/react-query';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceTracking';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { ChevronRight, Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from 'apps/user-ui/src/shared/components/EmptyState';

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const { location } = useLocationTracking();
  const { deviceInfo } = useDeviceTracking();
  const [loading, setLoading] = useState(false);
  const cart = useStore((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [storedCouponCode, setStoredCouponCode] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const removeFromCart = useStore((state) => state.removeFromCart);
  const [discountedProductId, setDiscountedProductId] = useState('');

  const decreaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    useStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
      ),
    }));
  };

  const subtotal = cart.reduce(
    (total: number, item: any) => total + item.quantity * item.salePrice,
    0
  );

  const removeItem = (id: string) => {
    removeFromCart(id, user, location, deviceInfo);
  };

  const applyCouponCode = async () => {
    setError(' ');

    if (!couponCode.trim()) {
      setError('Coupon code is required');
      return;
    }

    try {
      const res = await axiosInstance.put('/orders/api/verify-coupon', {
        couponCode: couponCode.trim(),
        cart,
      });

      if (res.data.valid) {
        setStoredCouponCode(couponCode.trim());
        setDiscountAmount(parseFloat(res.data.discountAmount));
        setDiscountPercent(res.data.discount);
        setDiscountedProductId(res.data.discountedProductId);
        setCouponCode('');
      } else {
        setDiscountAmount(0);
        setDiscountPercent(0);
        setDiscountedProductId('');
        setError(res.data.message || 'Coupon not valid for any items in cart');
      }
    } catch (error: any) {
      setDiscountAmount(0);
      setDiscountPercent(0);
      setDiscountedProductId('');
      setError(error.response.data.message);
    }
  };

  // Get address
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['shipping-addresses'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/shipping-addresses');
      return res.data.addresses;
    },
  });

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [addresses, selectedAddressId]);

  const createPaymentSession = async () => {
    if (addresses.length === 0) {
      toast.error('Please set your delivery address to create an order');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/orders/api/create-payment-session', {
        cart,
        selectedAddressId,
        coupon: {
          code: storedCouponCode,
          discountAmount,
          discountPercent,
          discountedProductId,
        },
      });

      const sessionId = res.data.sessionId;
      router.push(`/checkout?sessionId=${sessionId}`);
    } catch (error) {
      toast.error('Something went wrong!\\n Please try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] w-full min-h-screen">
      <div className="md:w-[80%] w-[95%] mx-auto py-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <div className="flex items-center gap-1 text-sm mb-8">
            <Link href="/" className="text-gray-600 hover:text-brand-primary-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Cart</span>
          </div>
        </div>
        {cart.length === 0 ? (
          <div className="flex justify-center">
            <EmptyState
              title="Your cart is empty"
              message="Add some products to get started!"
              icon={ShoppingCart}
            />
          </div>
        ) : (
          <div className="lg:flex items-start gap-8">
            <div className="flex-1 space-y-4 mb-8 lg:mb-0">
              {cart.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.images[0]?.fileUrl}
                        alt={item.title}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        {item.selectedOptions && (
                          <div className="flex gap-3 text-sm text-gray-500">
                            {item.selectedOptions?.color && (
                              <span className="flex items-center gap-1">
                                Color:{' '}
                                <span
                                  style={{
                                    backgroundColor: item?.selectedOptions?.color,
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '100%',
                                    display: 'inline-block',
                                    border: '1px solid #ddd',
                                  }}
                                />
                              </span>
                            )}
                            {item?.selectedOptions?.size && (
                              <span>Size: {item?.selectedOptions?.size}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              className="p-2 hover:bg-gray-50 transition-colors"
                              onClick={() => decreaseQuantity(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 font-medium">{item.quantity}</span>
                            <button
                              className="p-2 hover:bg-gray-50 transition-colors"
                              onClick={() => increaseQuantity(item.id)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                        <div className="flex flex-col items-end">
                          {item.id === discountedProductId ? (
                            <div className="text-right">
                              <span className="line-through text-gray-400 text-sm">
                                ${item.salePrice.toFixed(2)}
                              </span>
                              <div className="text-xl font-bold text-green-600">
                                ${((item.salePrice * (100 - discountPercent)) / 100).toFixed(2)}
                              </div>
                              <span className="text-xs text-green-600 font-medium">
                                Discount applied
                              </span>
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-900">
                              ${item.salePrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-[380px] bg-white rounded-xl p-6 shadow-md border border-gray-100 lg:sticky lg:top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-gray-700 mb-3">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="text-green-600 font-semibold">
                    -${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-lg font-semibold text-gray-900 pb-4 border-b">
                <span>Subtotal</span>
                <span>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Have a coupon?
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      placeholder="Enter coupon code"
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 text-sm"
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      className="flex-shrink-0 px-3 py-2 bg-brand-primary-500 text-white rounded-lg hover:bg-brand-primary-600 transition-colors font-medium text-sm whitespace-nowrap"
                      onClick={applyCouponCode}
                    >
                      Apply
                    </button>
                  </div>
                  {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  {addresses?.length > 0 ? (
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500"
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      {addresses?.map((address: any) => (
                        <option value={address.id} key={address.id}>
                          {address.label} - {address.city}, {address.country}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      Please add an address from your profile to create an order
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500">
                    <option value="credit_card">Online Payment</option>
                    <option value="cash_on_delivery">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-gray-900 mt-6 pt-6 border-t">
                <span>Total</span>
                <span>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>

              <button
                disabled={loading}
                onClick={createPaymentSession}
                className="w-full mt-6 py-3 bg-brand-primary-500 text-white font-semibold rounded-lg hover:bg-brand-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Redirecting...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
