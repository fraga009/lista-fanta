"use client";

import { Column, ColumnFiltersState, createColumnHelper, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingFn, sortingFns, useReactTable, VisibilityState } from '@tanstack/react-table';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'
import { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StrategyWithPlayerItem } from '../page';

declare module '@tanstack/react-table' {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export const StrategyTable = ({
  data
}: {
  data: StrategyWithPlayerItem[],
}) => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('')

  const columnHelper = createColumnHelper<StrategyWithPlayerItem>();

  const columns = [
    columnHelper.accessor('fascia', {
      cell: (row) => row.getValue(),
      header: 'F',
      maxSize: 40,
      filterFn: 'equalsString',
    }),
    columnHelper.accessor('player.role', {
      cell: (row) => row.getValue(),
      header: 'R',
      maxSize: 40,
      filterFn: 'equalsString',
    }),
    columnHelper.accessor('player.name', {
      cell: (row) => row.getValue(),
      header: 'Name',
      filterFn: 'includesString',
    }),
    columnHelper.accessor('player.team', {
      cell: (row) => row.getValue(),
      header: 'Team',
      maxSize: 60,
      filterFn: 'includesString',
    }),
    columnHelper.accessor('notes', {
      header: 'Note',
      cell: (row) => row.getValue()?.join(', '),
    }),
    columnHelper.accessor('price', {
      cell: (row) => row.getValue(),
      header: 'Prezzo',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('price', {
      // calculate percentage based on 500 budget
      cell: (row) => ((row.getValue() / 500) * 100).toFixed(2) + '%',
      header: 'Budget',
      maxSize: 80,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.classic_10_mod_median', {
      cell: (row) => `${row.getValue()}% - ${row.getValue() * 500 / 100}`,
      header: 'Med',
      maxSize: 140,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.quotazione', {
      cell: (row) => row.getValue(),
      header: 'Quot',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('tit_index', {
      cell: (row) => row.getValue(),
      header: 'Tit',
      maxSize: 40,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('aff_index', {
      cell: (row) => row.getValue(),
      header: 'Aff',
      maxSize: 40,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('inf_index', {
      cell: (row) => row.getValue(),
      header: 'Inf',
      maxSize: 40,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('ex_fmv', {
      cell: (row) => row.getValue(),
      header: 'Ex FMV',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.mv', {
      cell: (row) => row.getValue(),
      header: 'MV',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.fmv', {
      cell: (row) => row.getValue(),
      header: 'FMV',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.presenze', {
      cell: (row) => row.getValue(),
      header: 'Presenze',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.starts_eleven', {
      cell: (row) => row.getValue(),
      header: 'Titolarità',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.gol_fatti', {
      cell: (row) => row.getValue(),
      header: 'Gol',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.assist', {
      cell: (row) => row.getValue(),
      header: 'Assist',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.penalties', {
      cell: (row) => row.getValue(),
      header: 'Rigori',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.injured', {
      cell: (row) => row.getValue(),
      header: 'Inf',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.amm', {
      cell: (row) => row.getValue(),
      header: 'Amm',
      maxSize: 60,
      enableColumnFilter: false,
    }),
    columnHelper.accessor('player.esp', {
      cell: (row) => row.getValue(),
      header: 'Esp',
      maxSize: 60,
      enableColumnFilter: false,
    }),
  ];


  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (<>
    <div>
      <DebouncedInput
        value={globalFilter ?? ''}
        onChange={value => setGlobalFilter(String(value))}
        className="p-2 font-lg shadow border border-block"
        placeholder="Search all columns..."
      />
    </div>
    <Table className="table-fixed">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead 
                  key={header.id}
                  style={{ width: `${header.getSize()}px` }}
                >
                  {header.column.getCanFilter() ? (
                    <Filter column={header.column} />
                  ) : null}
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              tabIndex={index}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center"
            >
              No results
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </>);

}


function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <DebouncedInput
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}