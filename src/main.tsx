import React from "react";
import ReactDOM from "react-dom/client";
import { ReactLocation, Router, Outlet } from "@tanstack/react-location";
import routes from "./utils/routes";
import { ChakraProvider } from "@chakra-ui/react";

const locationClient = new ReactLocation();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <Router location={locationClient} routes={routes}>
        <Outlet />
      </Router>
    </ChakraProvider>
  </React.StrictMode>
);
