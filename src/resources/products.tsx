import { getRequest } from "../utils/request";
import { Flex, Text } from "@chakra-ui/react";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { convertToTitleCase } from "../utils/textFormatter";

// Product model
export interface ProductItem {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

// Fetch Products Function
export const getProducts = async () => {
  const res = await getRequest<ProductItem[]>("/products");
  return res.data;
};

// React table helper to create columns
const columnHelper = createColumnHelper<ProductItem>();

/**
 * @id is a required property that identifies the column to the actual data and is
 * used as header if header is not set
 * @Cell allows you to manipulate the data that will be shown in the table
 * @header is what is shown in the header cell of the column, it overides the ID if set
 * @footer is what is shown in the footer cell of the column
 */

export const productColumns = [
  columnHelper.accessor("id", {
    id: "id",
    cell: (info) => (
      <Flex w="full" justify="center">
        {info.getValue()}
      </Flex>
    ),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
    size: 10,
  }),
  columnHelper.accessor((row) => row.title, {
    id: "title",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.description, {
    id: "description",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.category, {
    id: "category",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
  columnHelper.accessor((row) => row.rating.rate, {
    id: "rating",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
  columnHelper.accessor((row) => row.price, {
    id: "price",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
];

// Declaring columns without the columnHelper
export const defaultColumns: ColumnDef<ProductItem>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "title",
    cell: (info) => `${info.row.renderValue("id")} ${info.getValue()}`,
  },
  {
    id: "desc",
    accessorFn: (item) => item.description,
  },
];
