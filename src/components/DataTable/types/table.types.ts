import { PaginatedResponse } from "../../../global/types";

export interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: (
    page?: number,
    size?: number
  ) => Promise<PaginatedResponse<T[]>>;
  columns: any;
  options?: {
    tableTitle?: string;
    canToggleColumns?: boolean;
    selectActions?: Array<{
      name: string;
      action: (rows: T[], updateLoading: () => void) => void;
    }>;
  };
}

export type CustomSelectedRows<T> = { row: T; idx: number }[];
