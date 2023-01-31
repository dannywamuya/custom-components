import { IconButton } from "@chakra-ui/button";
import { CloseIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Column, Table } from "@tanstack/table-core";
import { useMemo } from "react";
import DebouncedInput from "./DebouncedInput";

export default function ColumnFilter({
  column,
  table,
  searchIcon = false,
  setFilteredColumns,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
  setFilteredColumns: any;
  searchIcon?: boolean;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  const handleSetFilteredColumns = (value: any) => {
    if (value) {
      setFilteredColumns((prev: string[]) => {
        const set = new Set([...prev]);
        set.add(column.id);
        return [...set];
      });
    } else {
      setFilteredColumns((prev: string[]) => {
        const set = new Set([...prev]);
        set.delete(column.id);
        return [...set];
      });
    }
  };

  return typeof firstValue === "number" ? (
    <Flex w="full">
      <Flex gap={"2"} align={"center"} w={"full"}>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => {
            column.setFilterValue((old: [number, number]) => [value, old?.[1]]);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          searchIcon={searchIcon}
          onClick={(e) => e.stopPropagation()}
          fontSize={"sm"}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => {
            column.setFilterValue((old: [number, number]) => [old?.[0], value]);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          searchIcon={searchIcon}
          fontSize={"sm"}
        />
        {column.getFilterValue() ? (
          <IconButton
            size={"xxs"}
            borderRadius={"full"}
            p={"1"}
            color={"white"}
            bg={"red.500"}
            aria-label="Clear Filter"
            variant={"ghost"}
            _hover={{}}
            onClick={(e) => {
              e.stopPropagation();
              column.setFilterValue(null);
            }}
            as={CloseIcon}
          />
        ) : null}
      </Flex>
    </Flex>
  ) : (
    <>
      <Flex w="full" align={"center"} gap={2}>
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => {
            column.setFilterValue(value);
            handleSetFilteredColumns(value);
          }}
          placeholder={`Search (${column.getFacetedUniqueValues().size})`}
          list={column.id + "list"}
          searchIcon={searchIcon}
          onClick={(e) => e.stopPropagation()}
          fontSize={"sm"}
        />
        {column.getFilterValue() ? (
          <IconButton
            size={"xxs"}
            borderRadius={"full"}
            p={"1"}
            color={"white"}
            bg={"red.500"}
            aria-label="Clear Filter"
            variant={"ghost"}
            _hover={{}}
            onClick={(e) => {
              e.stopPropagation();
              column.setFilterValue(null);
            }}
            as={CloseIcon}
          />
        ) : null}
      </Flex>
    </>
  );
}
