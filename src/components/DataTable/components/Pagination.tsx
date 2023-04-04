import { Flex, IconButton, Input, Select, Text } from "@chakra-ui/react";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { Table as ITable } from "@tanstack/react-table";

export default function Pagination<T>({ table }: { table: ITable<T> }) {
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <Flex
      justify="space-between"
      align="center"
      bg={"#004f98"}
      color={"white"}
      p={"2"}
      boxShadow="0 0 25px rgba(0, 0, 0, 0.274)"
      borderBottomRadius={"md"}
      w={"full"}
    >
      <Flex w={"33%"} justify={"space-between"}>
        <IconButton
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          _hover={{
            bg: "#054077",
          }}
          aria-label="Go to first page"
          icon={<FaAngleDoubleLeft />}
          size={"xs"}
        />
        <IconButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          aria-label="Go to previous page"
          _hover={{
            bg: "#054077",
          }}
          icon={<FaAngleLeft />}
          size={"xs"}
        />
        <IconButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="outline"
          aria-label="Go to next page"
          icon={<FaAngleRight />}
          _hover={{
            bg: "#054077",
          }}
          size={"xs"}
        />
        <IconButton
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          variant="outline"
          aria-label="Go to last page"
          icon={<FaAngleDoubleRight />}
          _hover={{
            bg: "#054077",
          }}
          size={"xs"}
        />
      </Flex>
      <Flex align="center" mr="2">
        <Text fontWeight={"semibold"} mx="2" fontSize={"sm"}>
          Page {pageIndex + 1} of {table.getPageCount()}
        </Text>
      </Flex>
      <Flex align="center">
        <Text fontWeight={"semibold"} mx="2" fontSize={"sm"}>
          Go to page :
        </Text>
        <Input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          ml="2"
          w="16"
          borderRadius={"md"}
          size={"sm"}
        />
      </Flex>
      <Select
        value={pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        ml="2"
        w="32"
        size={"sm"}
        borderRadius={"md"}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize} style={{ color: "#000" }}>
            Show {pageSize}
          </option>
        ))}
      </Select>
    </Flex>
  );
}
