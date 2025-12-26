'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import DeleteConfirmationModal from 'apps/seller-ui/src/shared/components/DeleteConfirmationModal';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { AxiosError } from 'axios';
import {
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

const Products = () => {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const fetchProducts = async () => {
    const response = await axiosInstance.get(
      `/admin/api/get-all-products?page=${page}&limit=${limit}`
    );
    return response.data.products;
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: fetchProducts,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/products/api/delete-product/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Something went wrong';
      toast.error(errorMessage);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) =>
      axiosInstance.put(`/products/api/restore-product/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      toast.success('Product restored successfully');
      setShowDeleteModal(false);
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        'Something went wrong';
      toast.error(errorMessage);
    },
  });

  const openDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }: any) => (
          <Image
            src={row.original.images[0]?.fileUrl || ''}
            alt={row.original.images[0]?.fileUrl || ''}
            width={100}
            height={100}
            className="rounded-md object-cover w-12 h-12"
          />
        ),
      },
      {
        accessorKey: 'title',
        header: 'Product Name',
        cell: ({ row }) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;

          return (
            <Link
              href={`/products/${row.original.slug}`}
              className="text-brand-primary-600 hover:underline"
              title={row.original.title}
            >
              {truncatedTitle}
            </Link>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => <span>${row.original.salePrice}</span>,
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }: any) => (
          <span
            className={row.original.stock < 10 ? 'text-red-500' : 'text-slate-900'}
          >
            {row.original.stock} left
          </span>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }: any) => (
          <div className="flex items-center gap-1 text-yellow-500">
            <Star fill="#eab308" size={18} />
            <span className="text-slate-900">{row.original.rating || 0}</span>
          </div>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <Link
              href={`/products/${row.original.id}`}
              className="text-brand-primary-600 hover:text-brand-primary-700 transition"
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/products/edit/${row.original.id}`}
              className="text-yellow-600 hover:text-yellow-700 transition"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={() => openDeleteModal(row.original)}
              className="text-red-500 hover:text-red-600 transition"
            >
              <Trash size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    globalFilterFn: 'includesString',
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-slate-900 font-semibold">All Products</h2>
        <Link
          href="/dashboard/create-product"
          className="bg-brand-primary-600 hover:bg-brand-primary-700 transition text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>
      <div className="flex items-center">
        <span className="text-brand-primary-600 cursor-pointer">Dashboard</span>
        <ChevronRight size={20} className="opacity-[0.98] text-slate-400" />
        <span className="text-slate-900">All Products</span>
      </div>
      <div className="mb-4 flex items-center bg-white border border-slate-200 p-2 rounded-md flex-1">
        <Search size={18} className="text-slate-400 mr-2" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg p-4">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-slate-900" />
          </div>
        ) : (
          <table className="w-full text-slate-900">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="text-left p-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          product={selectedProduct}
          onRestore={() => restoreMutation.mutate(selectedProduct?.id || '')}
          onConfirm={() => deleteMutation.mutate(selectedProduct?.id || '')}
          onClose={() => setShowDeleteModal(false)}
          isDeleting={deleteMutation.isPending}
          isRestoring={restoreMutation.isPending}
        />
      )}
    </div>
  );
};

export default Products;
