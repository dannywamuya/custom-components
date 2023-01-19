import { Route } from "@tanstack/react-location";
import TablePage from "../pages/TablePage";
import App from "../App";

const routes: Route[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/table",
    element: <TablePage />,
  },
];

export default routes;
