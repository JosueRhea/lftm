"use client";

import React, { PropsWithChildren } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers({ children }: PropsWithChildren) {
  const [client] = React.useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
