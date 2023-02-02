import { Route } from "@tanstack/react-location";
import TablePage from "../pages/TablePage";
import App from "../App";
import FormPage from "../pages/FormPage";

const routes: Route[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/table",
    element: <TablePage />,
  },
  {
    path: "/form",
    element: <FormPage />,
  },
];

export default routes;
