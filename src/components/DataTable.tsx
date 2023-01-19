import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Flex,
  Text,
  Spinner,
  Checkbox,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { capitalizeFirstLetter } from "../utils/textFormatter";
import "../css/DataTable.css";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: () => Promise<T[]>;
  columns: any;
  tableTitle?: string;
}

function DataTable<T>({
  dataKey,
  columns,
  fetchFunction,
  tableTitle,
}: DataTableProps<T>) {
  const { data, isFetching } = useQuery<T[]>([...dataKey], fetchFunction, {
    initialData: [],
  });

  const table = useReactTable<T>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      {/* Table Title and Description  */}
      <Flex p={"4"} w="full" gap="2" align={"center"}>
        <Text fontSize={"xl"} fontWeight="bold">
          {tableTitle ?? capitalizeFirstLetter(dataKey)}
        </Text>
        {isFetching ? <Spinner size={"sm"} /> : null}
      </Flex>

      {/* Table Controls */}
      <Flex my={"4"} w="full" gap="2" align={"center"}>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Toggle Columns
          </MenuButton>
          <MenuList>
            {table.getAllLeafColumns().map((column) => (
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
            ))}
          </MenuList>
        </Menu>
      </Flex>

      {/* Actual Table */}
      <table
        {...{
          style: {
            width: "100%",
          },
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  {...{
                    key: cell.id,
                    style: {
                      width: cell.column.getSize(),
                    },
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th
                  {...{
                    key: header.id,
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

export default DataTable;
