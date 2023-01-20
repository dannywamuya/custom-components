import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { RowSelectionState, Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { CustomSelectedRows } from "../components/DataTable";

/**
 * Logic to get the selected rows in the dataTable
 *
 * @param key dataKey used to set state in react-query
 * @param table instance of the dataTable
 * @param rowSelection state of the row selection in the dataTable
 * @returns all selected rows in the dataTable
 */
const useSelectedRows = <T>(
  key: string[],
  table: Table<T>,
  rowSelection: RowSelectionState
) => {
  const queryClient = useQueryClient();

  const getSelectedRows = (): Promise<CustomSelectedRows<T>> => {
    return new Promise((res) =>
      res(
        table
          .getSelectedRowModel()
          .flatRows.map((row) => ({ row: row.original, idx: row.index }))
      )
    );
  };

  const { mutate } = useMutation<CustomSelectedRows<T>>({
    mutationFn: getSelectedRows,
    onSuccess() {
      queryClient.invalidateQueries([...key]);
    },
  });

  useEffect(() => {
    mutate();
  }, [rowSelection]);

  const { data: selectedRows } = useQuery<CustomSelectedRows<T>>(
    [...key],
    getSelectedRows,
    {
      initialData: [],
    }
  );

  return { selectedRows };
};

export default useSelectedRows;
