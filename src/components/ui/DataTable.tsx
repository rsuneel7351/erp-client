import { ReactNode } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={twMerge(clsx('w-full overflow-hidden rounded-xl border border-(--bg-border) bg-(--bg-surface)', className))}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-(--bg-surface-2) text-(--text-muted) uppercase text-xs font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--bg-border)">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-(--text-muted)">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-(--color-primary)" />
                    <p>Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-(--text-muted)">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={twMerge(
                    clsx('bg-(--bg-surface) transition-colors', onRowClick && 'cursor-pointer hover:bg-(--bg-surface-2)')
                  )}
                >
                  {columns.map((col) => (
                    <td key={`${row.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-(--text-primary)">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
