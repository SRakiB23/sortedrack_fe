import React, { useEffect, useState } from 'react';
import './ViewTicket.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { axiosSecure } from '../../../src/api/axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const ViewTicket = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosSecure.get('/gettickets');
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handleViewDetails = (ticketId) => {
    // Redirect to the ticket details page with the ticket's ID
    navigate(`/tickets/${ticketId}`);
  };

  return (
    <div>
      <h2 className='ticket-header'>All Tickets</h2>
      <div className="all-ticket-container">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className='table-header'>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell align="right">Department</TableCell>
                <TableCell align="right">Device</TableCell>
                <TableCell align="right">Priority</TableCell>
                <TableCell align="right">Additional Info</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {ticket.userName}
                  </TableCell>
                  <TableCell align="right">{ticket.department}</TableCell>
                  <TableCell align="right">{ticket.device}</TableCell>
                  <TableCell align="right">{ticket.priority}</TableCell>
                  <TableCell align="right">
                    {ticket.additionalInfo?.length > 30
                      ? `${ticket.additionalInfo.slice(0, 30)}...`
                      : ticket.additionalInfo}
                  </TableCell>
                  <TableCell align="right">
                    <Button variant="contained" onClick={() => handleViewDetails(ticket._id)}>
                      View
                    </Button>
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
