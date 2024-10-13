import React, { createContext, useState } from "react";

// Create a context
export const TicketContext = createContext();

// Create a provider component
export const TicketProvider = ({ children }) => {
  const [myTickets, setMyTickets] = useState([]);

  return (
    <TicketContext.Provider value={{ myTickets, setMyTickets }}>
      {children}
    </TicketContext.Provider>
  );
};
