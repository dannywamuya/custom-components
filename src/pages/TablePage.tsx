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
          sortableColumns: ["category", "id", "rating", "price", "title"],
        }}
      />
    </>
  );
};

export default TablePage;
