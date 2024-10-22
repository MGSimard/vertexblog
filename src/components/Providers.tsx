import { ZIndexContextProvider } from "@/components/ZIndexContextProvider";
import { NewFileContextProvider } from "@/components/NewFileContextProvider";
import { IconViewContextProvider } from "@/components/IconViewProvider";
import { SortContextProvider } from "@/components/SortContextProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ZIndexContextProvider>
      <SortContextProvider>
        <IconViewContextProvider>
          <NewFileContextProvider>{children}</NewFileContextProvider>
        </IconViewContextProvider>
      </SortContextProvider>
    </ZIndexContextProvider>
  );
}
