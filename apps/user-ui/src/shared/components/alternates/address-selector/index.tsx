'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType: string;
  isDefault: boolean;
}

interface AddressSelectorProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address | null) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ selectedAddress, onAddressSelect }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    addressType: 'home',
    isDefault: false
  });

  // 获取用户地址
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      // 暂时使用模拟用户ID，实际应该从用户认证状态获取
      const userId = '507f1f77bcf86cd799439011'; // 示例MongoDB ObjectId
      
      const response = await fetch('/api/addresses', {
        headers: { 'x-user-id': userId }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        // 如果没有选中的地址，且存在默认地址，则自动选择默认地址
        if (!selectedAddress && data.addresses.length > 0) {
          const defaultAddress = data.addresses.find((addr: Address) => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // 暂时使用模拟用户ID，实际应该从用户认证状态获取
      const userId = '507f1f77bcf86cd799439011'; // 示例MongoDB ObjectId
      
      if (editingAddress) {
        // 更新现有地址
        const response = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          setAddresses(prev => prev.map(addr => 
            addr.id === editingAddress.id ? data.address : addr
          ));
          // 如果更新的是当前选中的地址，更新选中状态
          if (selectedAddress?.id === editingAddress.id) {
            onAddressSelect(data.address);
          }
          setShowForm(false);
          setEditingAddress(null);
          resetForm();
        }
      } else {
        // 创建新地址
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          setAddresses(prev => [...prev, data.address]);
          setShowForm(false);
          resetForm();
          // 如果新地址是默认地址，自动选择它
          if (data.address.isDefault) {
            onAddressSelect(data.address);
          }
        }
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      addressType: 'home',
      isDefault: false
    });
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: address.addressType,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      setLoading(true);
      const userId = '507f1f77bcf86cd799439011';
      
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': userId }
      });

      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        // 如果删除的是当前选中的地址，清除选中状态
        if (selectedAddress?.id === addressId) {
          onAddressSelect(null);
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
  };

  const formatAddress = (address: Address) => {
    return `${address.addressLine1}${address.addressLine2 ? `, ${address.addressLine2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
          Shipping Address
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {/* 地址选择 */}
      {!showForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedAddress?.id === address.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {address.addressType}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                  <p className="text-sm text-gray-700">{formatAddress(address)}</p>
                </div>
                                 <div className="flex items-center space-x-2">
                   {selectedAddress?.id === address.id && (
                     <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                   )}
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleEditAddress(address);
                     }}
                     className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                     title="Edit address"
                   >
                     <Edit className="w-4 h-4" />
                   </button>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteAddress(address.id);
                     }}
                     className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                     title="Delete address"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 添加新地址表单 */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
           {editingAddress ? 'Edit Address' : 'Add New Address'}
         </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Set as default address
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
                             <button
                 type="submit"
                 disabled={loading}
                 className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
               </button>
               <button
                 type="button"
                 onClick={handleCancel}
                 className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
               >
                 Cancel
               </button>
            </div>
          </form>
        </div>
      )}

      {/* 没有地址时的提示 */}
      {!showForm && addresses.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No shipping addresses found</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
