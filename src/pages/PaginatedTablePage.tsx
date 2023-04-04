import Navbar from "./NavBar";
import DataTable from "../components/DataTable";
import { companyColumns, getCompanies } from "../resources/companies";

const PaginatedTablePage = () => {
  return (
    <>
      <Navbar page="Paginated Table Component" />
      <DataTable
        dataKey={["companies"]}
        columns={companyColumns}
        fetchFunction={getCompanies}
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

export default PaginatedTablePage;
