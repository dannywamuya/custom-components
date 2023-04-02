import { Button, IconButton } from "@chakra-ui/button";
import { CloseIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Column, Table } from "@tanstack/react-table";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { convertToTitleCase } from "../../../utils/textFormatter";
import ColumnFilter from "./ColumnFilter";

export default function ColumnFilterMenu<T>({
  canFilterColumns,
  table,
}: {
  canFilterColumns: Column<T>[];
  table: Table<T>;
}) {
  const [filteredColumns, setFilteredColumns] = useState<string[]>([]);

  return (
    <Flex gap={"2"} fontSize={"sm"} align={"center"} w="full">
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} size={"sm"} rightIcon={<MdFilterList />}>
          Filter Columns {`(${filteredColumns.length})`}
        </MenuButton>
        <MenuList>
          {canFilterColumns.map((column, idx) => (
            <MenuItem key={`${column.id}_${idx}`} gap={"2"}>
              <Flex align={"center"} fontWeight={"semibold"} gap={"2"}>
                {convertToTitleCase(column.id)}
              </Flex>
              <ColumnFilter
                column={column}
                table={table}
                searchIcon={false}
                setFilteredColumns={setFilteredColumns}
              />
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {filteredColumns.length > 0 ? (
        <IconButton
          size={"xxs"}
          borderRadius={"full"}
          p={"1"}
          cursor={"pointer"}
          color={"white"}
          bg={"red.500"}
          aria-label="Clear Filters"
          _hover={{}}
          onClick={(e) => {
            table.resetColumnFilters();
          }}
          as={CloseIcon}
        />
      ) : null}
    </Flex>
  );
}
