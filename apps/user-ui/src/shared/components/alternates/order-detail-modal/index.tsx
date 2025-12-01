'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, CreditCard, Phone, Download } from 'lucide-react';
import { generateInvoicePDF, createInvoiceData } from '../../../../utils/invoiceGenerator';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productImage?: string;
  product: {
    id: string;
    name: string;
    description: string;
    productImages: Array<{ url: string }>;
  };
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  orderDate: string;
  updatedAt: string;
  paymentMethod: string;
  paymentIntentId?: string;
  orderItems: OrderItem[];
  shippingAddress: {
    id: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails(orderId);
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/order-service/orders/${orderId}`);

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.order);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理下载发票
  const handleDownloadInvoice = () => {
    if (orderDetails) {
      try {
        const invoiceData = createInvoiceData(orderDetails);
        generateInvoicePDF(invoiceData);
      } catch (error) {
        console.error('Error generating invoice:', error);
        alert('Failed to generate invoice. Please try again.');
      }
    }
  };



  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* 背景遮罩 */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        {/* 模态框内容 */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading order details...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : orderDetails ? (
              <div className="space-y-6">
                {/* Order Items */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Order Items</h5>
                  <div className="space-y-3">
                    {orderDetails.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0">
                          {item.productImage || item.product?.productImages?.[0]?.url ? (
                            <img
                              src={item.productImage || item.product?.productImages?.[0]?.url}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h6 className="text-sm font-medium text-gray-900 truncate">
                            {item.productName}
                          </h6>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Order Summary</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(orderDetails.totalAmount - orderDetails.taxAmount - orderDetails.shippingAmount + orderDetails.discountAmount)}</span>
                    </div>

                    {orderDetails.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>{formatPrice(orderDetails.taxAmount)}</span>
                      </div>
                    )}

                    {orderDetails.shippingAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>{formatPrice(orderDetails.shippingAmount)}</span>
                      </div>
                    )}

                    {orderDetails.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">-{formatPrice(orderDetails.discountAmount)}</span>
                      </div>
                    )}

                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(orderDetails.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      Shipping Address
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{orderDetails.shippingAddress.fullName}</p>
                      <p>{orderDetails.shippingAddress.addressLine1}</p>
                      {orderDetails.shippingAddress.addressLine2 && (
                        <p>{orderDetails.shippingAddress.addressLine2}</p>
                      )}
                      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}</p>
                      <p>{orderDetails.shippingAddress.country}</p>
                      <p className="flex items-center mt-2">
                        <Phone className="w-4 h-4 mr-2" />
                        {orderDetails.shippingAddress.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                      Payment Details
                    </h5>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method</span>
                        <span className="font-medium capitalize">{orderDetails.paymentMethod.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(orderDetails.paymentStatus)}`}>
                          {orderDetails.paymentStatus}
                        </span>
                      </div>
                      {orderDetails.paymentIntentId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transaction ID</span>
                          <span className="font-mono text-xs">{orderDetails.paymentIntentId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">

                  {orderDetails.status === 'Delivered' && (
                    <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      Write Review
                    </button>
                  )}

                  {['Pending', 'Confirmed'].includes(orderDetails.status) && (
                    <button className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
