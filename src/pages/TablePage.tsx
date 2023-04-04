import Navbar from "./NavBar";
import { getProducts, productColumns } from "../resources/products";
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
              async action(rows, updateLoading) {
                const fn = () => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      updateLoading();
                      resolve(rows);
                    }, 6000);
                  });
                };
                const res = await fn();
                console.log(res, "normal");
              },
            },
            {
              name: "log rows again - longer",
              async action(rows, updateLoading) {
                const fn = () => {
                  return new Promise((resolve) => {
                    setTimeout(() => {
                      updateLoading();
                      resolve(rows);
                    }, 6000);
                  });
                };
                const res = await fn();
                console.log(res, "longer");
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
