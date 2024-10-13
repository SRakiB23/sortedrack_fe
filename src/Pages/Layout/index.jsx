import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import SidebarContextProvider from "../../contexts/SidebarContext";
import { isLoggedIn, getUserDetails } from "../../service";
import { Footer, Header, Sidebar } from "../../component";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const { role } = getUserDetails();
  const navigate = useNavigate()

  useEffect(() => {
    if(role === 'user') {
      navigate("/createTicket")
    }
    // if(role === 'superadmin') {
    //   navigate("/viewTi");
    // }
  }, [role])

  return isLoggedIn() ? (
    ["superadmin", "admin", "user"].includes(role) ? ( // Allow superadmin, admin, and user
      <SidebarContextProvider>
        <main className="d-flex flex-nowrap">
          <Sidebar />
          <div className="w-100 overflow-auto main-wrapper min-vh-100 d-flex flex-column">
            <Header />
            <section style={{ minHeight: "85vh" }}>
              <Outlet />
            </section>
            <Footer />
          </div>
        </main>
      </SidebarContextProvider>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default Layout;
