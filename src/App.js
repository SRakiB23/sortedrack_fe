import React from "react";
import { Routes, Route } from "react-router-dom";
import StockProvider from "./contexts/StockContext";
import {
  Layout,
  LoginForm,
  PageNotFound,
  Dashboard,
  Allitems,
  Request,
  AddUser,
  ListUser,
  EditUser,
  ListStock,
  AddStock,
  EditSystemDetails,
} from "./Pages";

import AssignItem from "./Pages/AssignItems";
import CreateTicket from "./Pages/CreateTicket";
import ViewTicket from "./Pages/ViewTickets";
import TicketDetails from "./Pages/ViewTickets/TicketDetails";
import MyTickets from "./Pages/MyTickets";
import AssignedDevices from "./Pages/AssignedDevices";

function App() {
  return (
    <StockProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="stock" element={<ListStock />} />
          <Route path="stock/add" element={<AddStock />} />
          <Route path="stock/edit/:id" element={<EditSystemDetails />} />
          <Route path="allitems" element={<Allitems />} />
          <Route path="request" element={<Request />} />
          <Route path="user/add" element={<AddUser />} />
          <Route path="user" element={<ListUser />} />
          <Route path="user/edit/:id" element={<EditUser />} />
          <Route path="assigned/" element={<AssignItem />} />
          <Route path="/createTicket" element={<CreateTicket />} />
          <Route path="/viewTicket" element={<ViewTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/myTickets" element={<MyTickets />} />
          <Route path="/assigndevices" element={<AssignedDevices />} />
        </Route>

        <Route path="login" element={<LoginForm />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </StockProvider>
  );
}

export default App;
