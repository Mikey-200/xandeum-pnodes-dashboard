"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, HardDrive, Server, Globe } from "lucide-react";
import { useState } from "react";

interface PNode {
  pubkey: string;
  gossip: string;
  tpu: string;
  rpc?: string;
  version?: string;
  ip?: string;
}

export function PNodeDashboard() {
  const [sorting, setSorting] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: pnodes = [], isLoading } = useQuery<PNode[]>({
    queryKey: ["pnodes"],
    queryFn: async () => {
      const res = await fetch("/api/pnodes");
      return res.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const columns: ColumnDef<PNode>[] = [
    {
      accessorKey: "pubkey",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Identity <ArrowUpDown className="h-4 w-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.original.pubkey.slice(0, 12)}...{row.original.pubkey.slice(-8)}
        </div>
      ),
    },
    {
      accessorKey: "ip",
      header: "IP / Hostname",
      cell: ({ row }) => row.original.ip || "N/A",
    },
    {
      accessorKey: "gossip",
      header: "Gossip Port",
      cell: ({ row }) => row.original.gossip,
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => row.original.version || "Unknown",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl">Loading pNodes from Xandeum network...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <HardDrive className="h-7 w-7 text-blue-600" />
              {pnodes.length} Active pNodes
            </h2>
          </div>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search pubkey or IP..."
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b dark:border-gray-700">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="pb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
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
      </div>

      <div className="text-center text-sm text-gray-500">
        Data fetched via pRPC • Refreshes every 60s • Built for Superteam Earn Xandeum Bounty
      </div>
    </div>
  );
}
