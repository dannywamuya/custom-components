import React from "react";
import ReactDOM from "react-dom/client";
import { ReactLocation, Router, Outlet } from "@tanstack/react-location";
import routes from "./utils/routes";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const locationClient = new ReactLocation();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router location={locationClient} routes={routes}>
          <Outlet />
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
