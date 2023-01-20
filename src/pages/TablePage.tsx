import Navbar from "./NavBar";
import {
  getProducts,
  productColumns,
  defaultColumns,
} from "../resources/products";
import DataTable from "../components/DataTable";

const TablePage = () => {
  return (
    <>
      <Navbar page="Table Component" />
      <DataTable
        dataKey={["products"]}
        columns={productColumns}
        fetchFunction={getProducts}
        options={{
          canToggleColumns: true,
          selectActions: [
            {
              name: "log rows",
              action(rows) {
                console.log(rows);
              },
            },
          ],
        }}
      />
      <div style={{ margin: "4rem 0" }} />
    </>
  );
};

export default TablePage;
