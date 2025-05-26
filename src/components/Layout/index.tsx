import Navbar from "@/components/Navbar";
import SideMenu from "@/components/SideMenu";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <SideMenu />
    </>
  );
}
