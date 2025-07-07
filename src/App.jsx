import SidebarLayout from "./components/SidebarLayout";
import Navbar from "./components/Navbar";

export default function App({ children }) {
  return (
    <div className="flex w-full">
      <SidebarLayout />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 bg-slate-100 w-full">{children}</main>
      </div>
    </div>
  );
}
