import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Sidebar />
      <div className="ml-72 min-h-screen">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;
