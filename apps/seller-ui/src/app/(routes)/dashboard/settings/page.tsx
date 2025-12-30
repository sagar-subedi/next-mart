'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  RiUploadCloud2Line,
  RiSave3Line,
  RiStore2Line,
  RiMapPinLine,
  RiPhoneLine,
  RiFileTextLine,
  RiImageEditLine,
  RiNotification3Line,
  RiDeleteBinLine,
  RiGlobalLine,
  RiBankCardLine,
  RiAlertLine,
  RiCheckLine,
  RiExternalLinkLine,
  RiAddLine,
  RiFacebookCircleLine,
  RiInstagramLine,
  RiTwitterXLine,
  RiYoutubeLine,
} from 'react-icons/ri';
import Image from 'next/image';
import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';

type ShopFormData = {
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  socialLinks: { platform: string; url: string }[];
};

const Settings = () => {
  const { seller, refetch } = useSeller();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatar, setAvatar] = useState<string>('');
  const [cover, setCover] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ShopFormData>({
    defaultValues: {
      socialLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  useEffect(() => {
    refetch();
    if (seller?.shop) {
      setValue('name', seller.shop.name);
      setValue('description', seller.shop.bio || '');
      setValue('address', seller.shop.address);
      setValue('phoneNumber', seller.phone || '');
      setCover(seller.shop.coverBanner || 'https://placehold.co/1200x400/1e293b/cbd5e1.png?text=Shop+Cover');

      // Populate social links
      if (seller.shop.socialLinks && seller.shop.socialLinks.length > 0) {
        setValue('socialLinks', seller.shop.socialLinks);
      } else {
        // Optional: Add one empty field if none exist
        // append({ platform: 'Facebook', url: '' }); 
        // Actually, setValue is better for initial load. 
        // If we want to start empty, we don't need to do anything as defaultValues is [].
      }
    }
  }, [seller, setValue, refetch]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          if (type === 'avatar') setAvatar(reader.result as string);
          else setCover(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ShopFormData) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.put('/seller/api/update-shop-info', {
        ...data,
        avatar,
        cover,
      });
      toast.success('Shop information updated successfully!');
      refetch();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update shop information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'general', label: 'General' },
    { id: 'domains', label: 'Custom Domains' },
    { id: 'withdraw', label: 'Withdraw Method' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] pb-20">
      <div className="max-w-5xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">
            Dashboard &gt; Settings
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === tab.id
                ? 'text-brand-primary-600 border-b-2 border-brand-primary-600'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <RiStore2Line className="text-brand-primary-500" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Shop Name
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Shop name is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Enter your shop name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800 placeholder:text-slate-400 resize-none"
                      placeholder="Tell customers about your shop..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <RiMapPinLine className="text-brand-primary-500" />
                  Location & Contact
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Address
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Shop address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      {...register('phoneNumber', { required: 'Phone number is required' })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Phone number"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <RiGlobalLine className="text-brand-primary-500" />
                  Social Media
                </h2>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-start">
                      <div className="w-1/3">
                        <div className="relative">
                          <select
                            {...register(`socialLinks.${index}.platform` as const, { required: true })}
                            className="w-full appearance-none px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800"
                          >
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Twitter">X (Twitter)</option>
                            <option value="YouTube">YouTube</option>
                            <option value="LinkedIn">LinkedIn</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <input
                          type="text"
                          {...register(`socialLinks.${index}.url` as const, { required: "URL is required" })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800 placeholder:text-slate-400"
                          placeholder="https://..."
                        />
                        {errors.socialLinks?.[index]?.url && (
                          <p className="text-red-500 text-xs mt-1">{errors.socialLinks[index]?.url?.message}</p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                        title="Remove link"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => append({ platform: 'Facebook', url: '' })}
                    className="mt-2 px-4 py-2 bg-brand-primary-50 text-brand-primary-600 hover:bg-brand-primary-100 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <RiAddLine size={20} /> Add Social Link
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-brand-primary-600 hover:bg-brand-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <RiSave3Line size={20} />
                  )}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <RiImageEditLine className="text-brand-primary-500" />
                  Shop Media
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Shop Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                          <Image
                            src={avatar || seller.shop.avatar?.[0].fileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.shop.name)}&background=random`}
                            alt="Avatar"
                            fill
                            className="object-cover"
                          />
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'avatar')}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <RiUploadCloud2Line size={18} />
                          Upload Logo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Cover Image
                    </label>
                    <div className="relative w-full aspect-[3/1] rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 group">
                      {cover ? (
                        <Image
                          src={cover}
                          alt="Cover"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <RiImageEditLine size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <input
                          type="file"
                          id="cover-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'cover')}
                        />
                        <label
                          htmlFor="cover-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-bold text-slate-900 hover:bg-white cursor-pointer transition-all transform translate-y-2 group-hover:translate-y-0"
                        >
                          <RiUploadCloud2Line size={18} />
                          Change Cover
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <RiAlertLine size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Low Stock Alert Threshold</h3>
                    <p className="text-sm text-slate-500">Get notified when stock falls below the set limit.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <RiNotification3Line size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">Order Notification Preferences</h3>
                    <p className="text-sm text-slate-500">Choose how you receive order notifications.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20">
                    <option>Email & App</option>
                    <option>Email Only</option>
                    <option>App Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
              <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2">
                <RiAlertLine /> Danger Zone
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900">Delete Shop</h4>
                  <p className="text-sm text-slate-500">Deleting your shop is irreversible. Proceed with caution.</p>
                </div>
                <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <RiDeleteBinLine />
                  Delete Shop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Domains Tab */}
        {activeTab === 'domains' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <RiGlobalLine className="text-brand-primary-500" />
                Custom Domain
              </h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Domain Name
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="yourdomain.com"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500 transition-all text-slate-800"
                  />
                  <button className="px-6 py-2.5 bg-brand-primary-600 hover:bg-brand-primary-700 text-white rounded-xl font-semibold transition-colors">
                    Save Domain
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-medium text-slate-700">DNS Configuration</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  To verify your domain, add the following DNS records:
                </p>
                <div className="space-y-2 font-mono text-xs bg-slate-900 text-slate-300 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span>CNAME</span>
                    <span className="text-brand-primary-400">seller.dokomart.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span>A Record</span>
                    <span className="text-brand-primary-400">76.76.21.21</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Method Tab */}
        {activeTab === 'withdraw' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <RiBankCardLine className="text-brand-primary-500" />
                Withdraw Method
              </h2>

              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-500">
                    <RiCheckLine size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Connected to Stripe</h3>
                    <p className="text-sm text-slate-400">support@dokomart.com</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Business Name</span>
                    <p className="font-medium mt-1">{seller?.shop?.name || 'My Shop'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Country</span>
                    <p className="font-medium mt-1">United States</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Payouts Enabled</span>
                    <p className="font-medium mt-1 text-emerald-500">Yes</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Charges Enabled</span>
                    <p className="font-medium mt-1 text-emerald-500">Yes</p>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-brand-primary-400 hover:text-brand-primary-300 transition-colors text-sm font-medium">
                  <RiExternalLinkLine />
                  Open Stripe Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
