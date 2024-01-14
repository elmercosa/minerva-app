"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import {
  IconChevronDown,
  IconEdit,
  IconFilterFilled,
  IconSearch,
} from "@tabler/icons-react";
import { IconFilter } from "@tabler/icons-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import useQuery from "@/hooks/useQuery";

import DeleteEntity from "./delete";

// import { useBusiness } from "@/app/contexts/business/context";
// import useDataQuery from "../../../hooks/useDataQuery";
// import useEnableQuery from "../../../hooks/useEnableQuery";
// import DeleteEntity from "./delete";
// import EditEntity from "./edit";

export default function EntityTable({
  columns,
  entities,
  loading,
  actions,
  filterFunction,
  tableHeader,
  entityName,
  entityNamePlural,
  needsUpdate,
  collection,
  deleteAttribute,
  title,
}: {
  columns: any;
  entities: any;
  loading: any;
  actions?: any;
  filterFunction?: any;
  tableHeader?: any;
  entityName: string;
  entityNamePlural?: string;
  needsUpdate?: boolean;
  collection: string;
  deleteAttribute: string;
  title?: string;
}) {
  const [items, setItems] = useState([] as any);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hideFilters, setHideFilters] = useState(true);
  const rows = [10, 50, 100];

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: columns[0].key,
    direction: "ascending",
  });

  const columnsKeys: Selection = new Set<string>(
    columns.map((column: any) => column.key)
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(columnsKeys)
  );

  const [selectedColumns, setSelectedColumns] = useState(columns);

  useEffect(() => {
    if (entities) {
      setPages(Math.ceil(entities.length / rowsPerPage));
    }
  }, [entities, rowsPerPage]);

  useEffect(() => {
    if (entities) {
      let dataFiltered = filterFunction(entities, filterValue);

      // sort
      let dataSorted = dataFiltered;
      if (sortDescriptor.column) {
        dataSorted = dataFiltered.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column ?? columns[0].key] as number;
          let second = b[sortDescriptor.column ?? columns[0].key] as number;

          if (sortDescriptor.column?.toString().includes("parameter.")) {
            let parameterName = sortDescriptor.column?.toString().split(".")[1];
            let paramA = a.userParameters.find((param: any) => {
              return param.parameter.title == parameterName;
            });
            let paramB = a.userParameters.find((param: any) => {
              return param.parameter.title == parameterName;
            });
            if (paramA && paramB) {
              first = paramA.value as number;
              second = paramB.value as number;
            }
          }

          const cmp = first < second ? -1 : first > second ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
      }

      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      const dataPaginated = [...dataSorted.slice(start, end)];

      setItems(dataPaginated);
      setPages(Math.ceil(dataSorted.length / rowsPerPage));
    }
  }, [filterValue, entities, page, rowsPerPage, sortDescriptor]);

  useEffect(() => {
    let columnsAux = columns.filter((column: any) =>
      (visibleColumns as Set<string>).has(column.key)
    );
    setSelectedColumns(columnsAux);
  }, [visibleColumns]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="text-default-400 text-small">
          Total {entities.length} {entityNamePlural}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow={false}
          classNames={{
            wrapper: "shadow-none text-white font-semibold",
            item: "bg-white",
            next: "bg-white",
            prev: "bg-white",
          }}
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-center gap-2">
          <span className="text-small text-default-400 break-keep">
            Nº de filas
          </span>
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value="5">10</option>
            <option value="10">50</option>
            <option value="15">100</option>
          </select>
        </div>
      </div>
    );
  }, [page, pages, entities]);

  const renderCell = useCallback((data: any, columnKey: any) => {
    let cellValue = data[columnKey];

    if (columnKey.includes("parameter.")) {
      let parameterName = columnKey.split(".")[1];
      // cellValue = data.userParameters.find()
      let param = data.userParameters.find((param: any) => {
        return param.parameter.title == parameterName;
      });
      if (param) {
        cellValue = param.value;
        if (param.parameter.type == "textarea") {
          cellValue = cellValue.substring(0, 20) + "...";
        }
        if (param.parameter.type == "checkbox") {
          cellValue = param.value ? "Sí" : "No";
        }
      } else {
        cellValue = "";
      }
    }

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <EditEntity
              id={data.id}
              endpoint={endpoint}
              entityName={entityName}
            /> */}
            <DeleteEntity
              id={data.id}
              deleteAttribute={deleteAttribute}
              endpoint={collection}
              entityName={entityName}
            />
            {actions && actions(data.id)}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  useEffect(() => {
    if (entities && needsUpdate) {
      let dataFiltered = filterFunction(entities, filterValue);

      // sort
      let dataSorted = dataFiltered;
      if (sortDescriptor.column) {
        dataSorted = dataFiltered.sort((a: any, b: any) => {
          const first = a[sortDescriptor.column ?? columns[0].key] as number;
          const second = b[sortDescriptor.column ?? columns[0].key] as number;
          const cmp = first < second ? -1 : first > second ? 1 : 0;

          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
      }

      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      const dataPaginated = [...dataSorted.slice(start, end)];

      setItems(dataPaginated);
      setPages(Math.ceil(dataSorted.length / rowsPerPage));
    }
  }, [needsUpdate]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center justify-start gap-2">
              <Input
                isClearable
                classNames={{
                  inputWrapper:
                    "border-none bg-white shadow-none rounded-xl w-80 p-3 h-fit",
                }}
                startContent={<IconSearch size={16} />}
                placeholder={`Buscar ${entityName}`}
                value={filterValue}
                onValueChange={setFilterValue}
                radius="none"
                variant="bordered"
                size="sm"
              />
            </div>
          </div>
          {title && (
            <h2 className="text-2xl font-bold text-default-900">{title}</h2>
          )}
          <div className="flex items-center justify-end gap-3">
            <Dropdown
              classNames={{
                trigger: "bg-white",
              }}
            >
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<IconChevronDown size={14} />}
                  className="p-5"
                  variant="flat"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column: any) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {column.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {tableHeader && tableHeader()}
          </div>
        </div>
      </div>
      <Table
        aria-label="Example static collection table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        topContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        classNames={{
          table: `${loading ? "min-h-[400px]" : ""}`,
          base: "shadow-none rounded-xl",
          wrapper: "shadow-none rounded-xl",
        }}
      >
        <TableHeader columns={selectedColumns}>
          {(column: any) => (
            <TableColumn
              key={column.key}
              className="uppercase"
              allowsSorting={true}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner />}
          items={items ?? []}
          emptyContent={
            loading ? "Cargando..." : `No hay ${entityNamePlural} para mostrar`
          }
        >
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey: any) =>
                (visibleColumns as Set<string>).has(columnKey) ? (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                ) : (
                  <></>
                )
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
