import React, { useEffect, useState } from "react";
import "./ViewTicket.scss";
import { styled } from "@mui/material/styles"; // Import for styling
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination"; // Import for pagination
import { axiosSecure } from "../../../src/api/axios";
import { FormControl, Select, MenuItem, Tooltip, Modal, Box, Typography, Button } from "@mui/material";
import { FaEye } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6bbcc8",
    color: "#2b0c37",
    fontSize: 16,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const ViewTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [sortPriority, setSortPriority] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const [page, setPage] = useState(0); // Pagination page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page state
  const [open, setOpen] = useState(false); // Modal open/close state
  const [selectedTicket, setSelectedTicket] = useState(null); // Current selected ticket for status change
  const [newStatus, setNewStatus] = useState(""); // Selected status for modal

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

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle modal open and store the selected ticket
  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status); // Set current status in modal
    setOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setOpen(false);
  };

  // Handle status update from modal
  const handleUpdateStatus = async () => {
    if (selectedTicket) {
      try {
        await axiosSecure.put(`/tickets/${selectedTicket._id}`, { status: newStatus });
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id ? { ...ticket, status: newStatus } : ticket
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    }
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

  // Paginate the sorted tickets
  const paginatedTickets = sortedTickets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleViewDetails = (ticketId) => {
    // Redirect to the ticket details page with the ticket's ID
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div>
      <h2 className="ticket-header">All <span style={{color:"#6bbcc8"}}>Tickets</span></h2>

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
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">User Name</StyledTableCell>
                <StyledTableCell align="center">Department</StyledTableCell>
                <StyledTableCell align="center">Device</StyledTableCell>
                <StyledTableCell align="center">Priority</StyledTableCell>
                <StyledTableCell align="center">Additional Info</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTickets.map((ticket) => (
                <StyledTableRow key={ticket._id}>
                  <StyledTableCell component="th" scope="row" align="center">
                    {ticket.userName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{ticket.department}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.device}</StyledTableCell>
                  <StyledTableCell align="center">{ticket.priority}</StyledTableCell>
                  <StyledTableCell align="center">
                    {Array.isArray(ticket.additionalInfo) &&
                    ticket.additionalInfo.length > 0
                      ? ticket.additionalInfo[0]?.comment?.length > 30
                        ? `${ticket.additionalInfo[0].comment.slice(0, 30)}...`
                        : ticket.additionalInfo[0].comment
                      : "No comments available"}
                  </StyledTableCell>
                  <StyledTableCell align="center">{ticket.status}</StyledTableCell>
                  <StyledTableCell align="center">
                    <div className="buttons">
                      <Tooltip title="Change Status" arrow>
                        <div
                          className="change-button"
                          onClick={() => handleOpenModal(ticket)}
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
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[10, 50]}
            component="div"
            count={sortedTickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>

      {/* Modal for changing ticket status */}
      <Modal open={open} onClose={handleCloseModal} aria-labelledby="status-modal">
  <Box sx={modalStyle}>
    <Typography id="status-modal" variant="h6" component="h2" className="modal-header">
      Change Ticket Status
    </Typography>
    {selectedTicket && ( // Ensure selectedTicket is defined
      <p style={{paddingTop:"20px"}}>Current Status:
       <span style={{paddingLeft:"10px", color:"#039eb9"}}>{selectedTicket.status}</span></p>
    )}
    <FormControl fullWidth margin="normal">
      <Select
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="In progress">In progress</MenuItem>
        <MenuItem value="Solved">Solved</MenuItem>
        <MenuItem value="Rejected">Rejected</MenuItem>
      </Select>
    </FormControl>
    <Button onClick={handleUpdateStatus} variant="contained" 
    style={{backgroundColor:"#039eb9"}}>
      Update Status
    </Button>
  </Box>
</Modal>

    </div>
  );
};

export default ViewTicket;
