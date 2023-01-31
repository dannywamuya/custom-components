import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Flex } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Table } from "@tanstack/react-table";
import { BiHide } from "react-icons/bi";

// Menu that allows for toggling of table columns
export default function ColumnToggleMenu<T>({ table }: { table: Table<T> }) {
  return (
    <Flex>
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<BiHide />}>
          Columns
        </MenuButton>
        <MenuList>
          {table.getAllLeafColumns().map((column) =>
            column.getCanHide() ? (
              <MenuItem key={column.id}>
                <Checkbox
                  size={"md"}
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                  defaultChecked
                >
                  {column.id}
                </Checkbox>
              </MenuItem>
            ) : null
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
}
