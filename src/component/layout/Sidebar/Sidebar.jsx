import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContext } from "../../../contexts/SidebarContext";
import logo from "../../../assests/images/sorted-rack-logo.svg";
import { IoCreateOutline, IoTicketOutline } from "react-icons/io5";
import { MdAssignmentInd, MdPreview } from "react-icons/md";
import { getUserDetails } from "../../../service"; // Importing getUserDetails to get the role

import "./Sidebar.scss";

const Sidebar = () => {
  const { activeMenu } = useContext(SidebarContext);
  const { role } = getUserDetails();

  return (
    <div
      className={
        activeMenu ? "sidebar d-flex bg-dark hide" : "sidebar d-flex bg-dark"
      }
    >
      <div className="d-flex flex-column flex-shrink-0 px-3 text-white w-100">
        <a
          href="/"
          className="d-flex align-items-center pt-3 mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <img alt="Sorted Rack" src={logo} width="140px" />
        </a>

        <hr />

        <nav className="h-100vh">
          <ul className="nav nav-pills flex-column mb-auto">
            {role === "user" ? (
              <>
                <li>
                  <NavLink
                    to="/createTicket"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <IoCreateOutline className="fs-5 me-2" />
                    <span>Create Ticket</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/myTickets"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <IoTicketOutline className="fs-5 me-2" />
                    <span>My Tickets</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assigndevices"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <MdAssignmentInd className="fs-5 me-2" />
                    <span>Assigned Devices</span>
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    end={true}
                    to="/"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-house-door pe-none me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z" />
                    </svg>
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-people pe-none me-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                    <span>User</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/stock"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-clipboard-check pe-none me-2"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                      />
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z" />
                    </svg>
                    <span>Stock</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/assigned"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <MdPreview className="fs-5 me-2" />
                    <span>Assigned Devices</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/viewTicket"
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? "active" : undefined}`
                    }
                  >
                    <IoTicketOutline className="fs-5 me-2" />
                    <span>View Tickets</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
