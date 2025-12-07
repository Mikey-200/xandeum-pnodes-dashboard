"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, HardDrive, RefreshCw } from "lucide-react";
import { useState } from "react";

interface PNode {
  pubkey: string;
  gossip: string | number;
  tpu: string | number;
  rpc?: string | number;
  version?: string;
  ip?: string;
}

export function PNodeDashboard() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: pnodes = [], isLoading, refetch, dataUpdatedAt } = useQuery<PNode[]>({
    queryKey: ["pnodes"],
    queryFn: async () => {
      const res = await fetch("/api/pnodes");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 60000,
    staleTime: 50000,
  });

  const columns: ColumnDef<PNode>[] = [
    {
      accessorKey: "pubkey",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identity <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => {
        const pub = row.original.pubkey;
        return <span className="font-mono text-sm">{pub.slice(0, 12)}...{pub.slice(-8)}</span>;
      },
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => row.original.ip || "—",
    },
    {
      accessorKey: "gossip",
      header: "Gossip Port",
      cell: ({ row }) => row.original.gossip,
    },
    {
      accessorKey: "tpu",
      header: "TPU Port",
      cell: ({ row }) => row.original.tpu,
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => row.original.version || "—",
    },
  ];

  const table = useReactTable({
    data: pnodes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <HardDrive className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">{pnodes.length} Active pNodes</h2>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search pubkey / IP..."
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 w-full sm:w-64"
            />
            <button
              onClick={() => refetch()}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {isLoading && pnodes.length === 0 ? (
          <div className="text-center py-20 text-gray-500">Loading pNodes from Xandeum network...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b dark:border-gray-700">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="pb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-500">
        Built for Superteam Earn Xandeum Bounty • Data via pRPC • Auto-refreshes every 60s
      </div>
    </div>
  );
}
