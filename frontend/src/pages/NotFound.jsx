import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function NotFound() {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-7xl font-bold text-red-500">404</h1>
        <p className="mt-4 text-xl text-slate-400">Page Not Found</p>
        <button onClick={() => navigate("/")} className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition">
          Return to Dashboard
        </button>
      </div>
    </MainLayout>
  );
}
export default NotFound;
