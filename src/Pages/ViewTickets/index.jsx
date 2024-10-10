import React, { useEffect, useState } from "react";
import "./ViewTicket.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { axiosSecure } from "../../../src/api/axios";
import { Button, FormControl, Select, MenuItem, Tooltip } from "@mui/material";
import { FaEye } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";

import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const ViewTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosSecure.get("/gettickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // Handle sorting by priority
  const handlePriorityChange = (event) => {
    setSortPriority(event.target.value);
  };

  // Handle sorting by status
  const handleStatusChange = (event) => {
    setSortStatus(event.target.value);
  };

  // Sort tickets based on selected criteria
  const sortedTickets = tickets
    .filter((ticket) => {
      return (
        (sortStatus ? ticket.status === sortStatus : true) &&
        (sortPriority ? ticket.priority === sortPriority : true)
      );
    })
    .sort((a, b) => {
      if (sortPriority) {
        return a.priority.localeCompare(b.priority);
      }
      if (sortStatus) {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  const handleViewDetails = (ticketId) => {
    // Redirect to the ticket details page with the ticket's ID
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div>
      <h2 className="ticket-header">All Tickets</h2>

      {/* Sorting Selectors */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <FormControl style={{ marginRight: "10px" }}>
          <Select
            value={sortPriority}
            onChange={handlePriorityChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <span>Sort by Priority</span>
            </MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <Select
            value={sortStatus}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="">
              <span>Sort by Status</span>
            </MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Solved">Solved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="all-ticket-container">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="table-header">
              <TableRow className="table-row">
                <TableCell align="center">User Name</TableCell>
                <TableCell align="center">Department</TableCell>
                <TableCell align="center">Device</TableCell>
                <TableCell align="center">Priority</TableCell>
                <TableCell align="center">Additional Info</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {ticket.userName}
                  </TableCell>
                  <TableCell align="center">{ticket.department}</TableCell>
                  <TableCell align="center">{ticket.device}</TableCell>
                  <TableCell align="center">{ticket.priority}</TableCell>
                  <TableCell align="center">
                    {Array.isArray(ticket.additionalInfo) &&
                    ticket.additionalInfo.length > 0
                      ? ticket.additionalInfo[0]?.comment?.length > 30
                        ? `${ticket.additionalInfo[0].comment.slice(0, 30)}...`
                        : ticket.additionalInfo[0].comment
                      : "No comments available"}
                  </TableCell>
                  <TableCell align="center">{ticket.status}</TableCell>
                  <TableCell align="center">
                    <div className="buttons">
                      <Tooltip title="Change Status" arrow>
                        <div
                          className="change-button"
                          onClick={() => handleViewDetails(ticket._id)}
                        >
                          <FaExchangeAlt />
                        </div>
                      </Tooltip>
                      <Tooltip title="View" arrow>
                        <div
                          className="view-button"
                          onClick={() => handleViewDetails(ticket._id)}
                        >
                          <FaEye />
                        </div>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ViewTicket;
