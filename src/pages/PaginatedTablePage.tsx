import Navbar from "./NavBar";
import DataTable from "../components/DataTable";
import { getPassengers, passengerColumns } from "../resources/passengers";

const PaginatedTablePage = () => {
  return (
    <>
      <Navbar page="Paginated Table Component" />
      <DataTable
        dataKey={["passengers"]}
        columns={passengerColumns}
        fetchFunction={async () => {
          const res = await getPassengers();
          return res.data;
        }}
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
