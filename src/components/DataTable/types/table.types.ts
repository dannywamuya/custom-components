export interface DataTableProps<T> {
  dataKey: Array<string>;
  fetchFunction: () => Promise<T[]>;
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
