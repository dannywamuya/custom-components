import { createColumnHelper } from "@tanstack/react-table";
import { getRequest } from "../utils/request";
import { convertToTitleCase } from "../utils/textFormatter";
import { Text } from "@chakra-ui/react";

export interface Airline {
  id: number;
  name: string;
  country: string;
  logo: string;
  slogan: string;
  head_quaters: string;
  website: string;
  established: string;
}

export interface PassengerData {
  _id: string;
  name: string;
  trips: number;
  airline: Airline[];
  __v: number;
}

export interface Passengers {
  totalPassengers: number;
  totalPages: number;
  data: PassengerData[];
}

// Fetch Passengers
export const getPassengers = async () => {
  const res = await getRequest<Passengers>(
    "https://api.instantwebtools.net/v1/passenger?page=1&size=20"
  );
  return res.data;
};

// React table helper to create columns
const columnHelper = createColumnHelper<PassengerData>();

export const passengerColumns = [
  columnHelper.accessor("_id", {
    id: "id",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
    size: 10,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableHiding: false,
  }),
  columnHelper.accessor((row) => row.trips, {
    id: "trips",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
    enableSorting: false,
  }),
  columnHelper.accessor((row) => row.airline[0].name, {
    id: "airline",
    cell: (info) => info.getValue(),
    header: (info) => <Text>{convertToTitleCase(info.column.id)}</Text>,
    footer: (info) => convertToTitleCase(info.column.id),
  }),
];
