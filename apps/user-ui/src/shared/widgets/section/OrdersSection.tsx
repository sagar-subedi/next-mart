'use client';

import { useQuery } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Search, Package } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import EmptyState from '../../components/EmptyState';

interface Props {
  isLoading?: boolean;
  orders: any[];
}

const OrdersSection = ({ orders, isLoading }: Props) => {
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }: any) => (
          <span className="font-mono text-sm font-semibold text-gray-900">
            #{row.original.id.slice(-6).toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: 'username',
        header: 'Customer',
        cell: ({ row }) => (
          <span className="text-gray-700">
            {row.original?.user?.name ?? 'Guest'}
          </span>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-semibold text-gray-900">
            ${row.original.total.toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Payment',
        cell: ({ row }) => (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${row.original.status === 'Paid'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
              }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: 'deliveryStatus',
        header: 'Delivery',
        cell: ({ row }) => {
          const status = row.original.deliveryStatus;
          let colorClass = 'bg-gray-100 text-gray-700';

          if (status === 'Delivered') colorClass = 'bg-green-100 text-green-700';
          else if (status === 'Cancelled') colorClass = 'bg-red-100 text-red-700';
          else if (status === 'Processing') colorClass = 'bg-blue-100 text-blue-700';
          else if (status === 'Shipped') colorClass = 'bg-purple-100 text-purple-700';

          return (
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          return <span className="text-gray-600 text-sm">{date}</span>;
        },
      },
      {
        accessorKey: '',
        header: 'Actions',
        cell: ({ row }) => (
          <Link
            href={`/orders/${row.original.id}`}
            className="inline-flex items-center justify-center p-2 text-brand-primary-600 hover:text-brand-primary-700 hover:bg-brand-primary-50 rounded-lg transition-colors"
            title="View order details"
          >
            <Eye size={18} />
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: orders || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="mb-6 flex items-center bg-gray-50 border border-gray-200 p-3 rounded-lg focus-within:border-brand-primary-300 focus-within:ring-2 focus-within:ring-brand-primary-100 transition-all">
        <Search size={20} className="text-gray-400 mr-3" />
        <input
          type="text"
          className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
          placeholder="Search orders by ID, customer, or status..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-500"></div>
          </div>
        ) : orders?.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title="No orders yet"
              message="Your orders will appear here once you make a purchase"
              icon={Package}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        key={header.id}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    className="hover:bg-gray-50 transition-colors"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td className="px-6 py-4 text-sm" key={cell.id}>
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
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && orders?.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
