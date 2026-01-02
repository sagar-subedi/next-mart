'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Breadcrumb from 'apps/seller-ui/src/shared/components/Breadcrumb';
import ColorPicker from 'apps/seller-ui/src/shared/components/ColorPicker';
import CustomProperties from 'apps/seller-ui/src/shared/components/CustomProperties';
import CustomSpecifications from 'apps/seller-ui/src/shared/components/CustomSpecifications';
import RichTextEditor from 'apps/seller-ui/src/shared/components/RichTextEditor';
import SizeSelector from 'apps/seller-ui/src/shared/components/SizeSelector';
import Input from 'apps/seller-ui/src/shared/input';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { defaultCategories } from 'apps/seller-ui/src/utils/constants';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditProductPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [subCategories, setSubCategories] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            detailedDescription: '',
            warranty: '',
            slug: '',
            tags: '',
            brand: '',
            videoUrl: '',
            category: '',
            subCategory: '',
            regularPrice: 0,
            salePrice: 0,
            stock: 0,
            colors: [],
            sizes: [],
            customSpecifications: [],
            customProperties: [],
        },
    });

    const category = watch('category');

    // Fetch product details
    const { data: productData, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const res = await axiosInstance.get(`/products/api/get-products-by-id/${id}`);
            return res.data.product;
        },
        enabled: !!id,
    });

    // Populate form with product data
    useEffect(() => {
        if (productData) {
            reset({
                title: productData.title,
                description: productData.description,
                detailedDescription: productData.detailedDescription,
                warranty: productData.warranty,
                slug: productData.slug,
                tags: Array.isArray(productData.tags) ? productData.tags.join(',') : productData.tags,
                brand: productData.brand,
                videoUrl: productData.videoUrl,
                category: productData.category,
                subCategory: productData.subCategory,
                regularPrice: productData.regularPrice,
                salePrice: productData.salePrice,
                stock: productData.stock,
                colors: productData.colors,
                sizes: productData.sizes,
                customSpecifications: productData.customSpecifications,
                customProperties: productData.customProperties,
            });
            setImages(productData.images || []);
        }
    }, [productData, reset]);

    useEffect(() => {
        const selectedCategory = defaultCategories.find(
            (c: any) => c.title === category
        );
        if (selectedCategory) {
            setSubCategories(selectedCategory.subCategories);
        }
    }, [category]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const formData = new FormData();

        try {
            for (let i = 0; i < files.length; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(files[i]);
                reader.onload = async () => {
                    const base64 = reader.result;
                    const res = await axiosInstance.post(
                        '/products/api/upload-product-image',
                        { fileName: base64 }
                    );
                    setImages((prev) => [...prev, res.data]);
                };
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const { mutateAsync: editProduct } = useMutation({
        mutationFn: async (data: any) => {
            await axiosInstance.put(`/products/api/edit-product/${id}`, data);
        },
        onSuccess: () => {
            toast.success('Product updated successfully');
            router.push('/dashboard/all-products');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        },
    });

    const onSubmit = async (data: any) => {
        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        const payload = {
            ...data,
            images,
            discountCodes: [],
        };

        await editProduct(payload);
    };

    if (isLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <p className="text-slate-900">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-8">
            <Breadcrumb title="Edit Product" />
            <form
                className="w-full mx-auto p-8 shadow-md rounded-lg text-slate-900 bg-white"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl py-2 font-semibold font-Poppins text-slate-900">
                    Edit Product
                </h2>

                <div className="py-4 w-full flex gap-6">
                    {/* Left side - Images */}
                    <div className="md:w-[35%]">
                        <label className="block font-semibold text-slate-800 mb-1">
                            Images *
                        </label>
                        <div className="flex flex-wrap gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img
                                        src={image.fileUrl}
                                        alt="Product"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-md flex items-center justify-center cursor-pointer hover:border-brand-primary-500 transition">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                {uploading ? (
                                    <span className="text-xs text-slate-500">Uploading...</span>
                                ) : (
                                    <ImagePlus className="text-slate-400" />
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Right side - Form Fields */}
                    <div className="md:w-[65%]">
                        <div className="w-full flex gap-6">
                            {/* Column 1 */}
                            <div className="w-2/4">
                                <div className="mb-4">
                                    <Controller
                                        name="title"
                                        control={control}
                                        rules={{ required: 'Title is required' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Product Title *"
                                                placeholder="Enter product title"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.title && (
                                        <p className="text-error">{String(errors.title.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="description"
                                        control={control}
                                        rules={{ required: 'Description is required' }}
                                        render={({ field }) => (
                                            <Input
                                                type="textarea"
                                                label="Short Description * (Max 150 words)"
                                                placeholder="Enter product description"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.description && (
                                        <p className="text-error">{String(errors.description.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="tags"
                                        control={control}
                                        rules={{ required: 'Tags are required' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Tags *"
                                                placeholder="concert,festival,..."
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.tags && (
                                        <p className="text-error">{String(errors.tags.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="warranty"
                                        control={control}
                                        rules={{ required: 'Warranty is required' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Warranty *"
                                                placeholder="1 Year/ No warranty"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.warranty && (
                                        <p className="text-error">{String(errors.warranty.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="slug"
                                        control={control}
                                        rules={{ required: 'Slug is required' }}
                                        render={({ field }) => (
                                            <Input label="Slug *" placeholder="event-slug" {...field} />
                                        )}
                                    />
                                    {errors.slug && (
                                        <p className="text-error">{String(errors.slug.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="brand"
                                        control={control}
                                        rules={{ required: 'Brand is required' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Brand *"
                                                placeholder="Brand Name"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.brand && (
                                        <p className="text-error">{String(errors.brand.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <ColorPicker control={control} errors={errors} />
                                </div>

                                <div className="mb-4">
                                    <CustomSpecifications control={control} errors={errors} />
                                </div>

                                <div className="mb-4">
                                    <CustomProperties control={control} errors={errors} />
                                </div>

                                <div className="mb-4">
                                    <SizeSelector control={control} errors={errors} />
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="w-2/4">
                                <div className="mb-4">
                                    <label className="block font-semibold text-slate-800 mb-1">
                                        Category *
                                    </label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{ required: 'Category is required' }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full border outline-none border-slate-300 bg-transparent p-2 rounded-md text-slate-900"
                                            >
                                                <option value="" disabled>
                                                    Select Category
                                                </option>
                                                {defaultCategories.map((c) => (
                                                    <option key={c.title} value={c.title}>
                                                        {c.title}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.category && (
                                        <p className="text-error">{String(errors.category.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block font-semibold text-slate-800 mb-1">
                                        Sub Category *
                                    </label>
                                    <Controller
                                        name="subCategory"
                                        control={control}
                                        rules={{ required: 'Sub Category is required' }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className="w-full border outline-none border-slate-300 bg-transparent p-2 rounded-md text-slate-900"
                                            >
                                                <option value="" disabled>
                                                    Select Sub Category
                                                </option>
                                                {subCategories.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {errors.subCategory && (
                                        <p className="text-error">{String(errors.subCategory.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block font-semibold text-slate-800 mb-1">
                                        Detailed description *
                                    </label>
                                    <Controller
                                        name="detailedDescription"
                                        control={control}
                                        rules={{ required: 'Detailed description is required' }}
                                        render={({ field }) => (
                                            <RichTextEditor value={field.value} onChange={field.onChange} />
                                        )}
                                    />
                                    {errors.detailedDescription && (
                                        <p className="text-error">
                                            {String(errors.detailedDescription.message)}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="videoUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                label="Video URL"
                                                placeholder="https://www.youtube.com/embed/something"
                                                {...field}
                                            />
                                        )}
                                    />
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="regularPrice"
                                        control={control}
                                        rules={{ required: 'Regular Price is required' }}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                label="Regular Price"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.regularPrice && (
                                        <p className="text-error">{String(errors.regularPrice.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="salePrice"
                                        control={control}
                                        rules={{ required: 'Sale Price is required' }}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                label="Sale Price"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.salePrice && (
                                        <p className="text-error">{String(errors.salePrice.message)}</p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <Controller
                                        name="stock"
                                        control={control}
                                        rules={{ required: 'Stock is required' }}
                                        render={({ field }) => (
                                            <Input
                                                type="number"
                                                label="Stock *"
                                                {...field}
                                            />
                                        )}
                                    />
                                    {errors.stock && (
                                        <p className="text-error">{String(errors.stock.message)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || uploading}
                        className="bg-brand-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-700 transition disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;
