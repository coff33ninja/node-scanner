import { Sidebar } from "./ui/sidebar";
import { BackendStatus } from "./BackendStatus";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <BackendStatus />
        </div>
        {children}
      </main>
    </div>
  );
};

export default Layout;