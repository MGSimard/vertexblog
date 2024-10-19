import { ZIndexContextProvider } from "@/components/ZIndexContextProvider";
import { SortContextProvider } from "@/components/SortContextProvider";
import { NewFileContextProvider } from "@/components/NewFileContextProvider";
import { IconViewContextProvider } from "@/components/IconViewProvider";

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
