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
      <Navbar page="Table Component Demo" />
      <DataTable
        dataKey={["products"]}
        columns={productColumns}
        fetchFunction={getProducts}
      />
    </>
  );
};

export default TablePage;
