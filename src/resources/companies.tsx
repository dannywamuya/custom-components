import { Text } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import { PaginatedResponse } from "../global/types";
import { getRequest } from "../utils/request";
import { convertToTitleCase } from "../utils/textFormatter";

export interface Company {
  id: number;
  company: string;
  valuation: string;
  valuation_date: string;
  industry: string;
  countries: string;
  founders: string;
}

// Fetch Companies Function
export const getCompanies = async (
  page?: number,
  size?: number
): Promise<PaginatedResponse<Company[]>> => {
  const res = await getRequest<PaginatedResponse<Company[]>>(
    `http://localhost:8080/api/companies?page=${page}&size=${size}`
  );
  return res.data;
};

const columnHelper = createColumnHelper<Company>();

export const companyColumns = [
  columnHelper.accessor("id", {
    id: "id",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
    size: 10,
  }),
  columnHelper.accessor((row) => row.company, {
    id: "company",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.countries, {
    id: "countries",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.founders, {
    id: "founders",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
  columnHelper.accessor((row) => row.industry, {
    id: "industry",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
  columnHelper.accessor((row) => row.valuation, {
    id: "valuation",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
  columnHelper.accessor((row) => row.valuation_date, {
    id: "valuation date",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
];
