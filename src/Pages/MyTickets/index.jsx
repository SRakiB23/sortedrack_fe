import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
} from "@mui/material";
import { axiosSecure } from "../../../src/api/axios";
import "./MyTickets.scss";

const MyTickets = () => {
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await axiosSecure.get("/mytickets"); // Update endpoint
        setMyTickets(response.data);
      } catch (error) {
        console.error("Error fetching my tickets:", error);
      }
    };

    fetchMyTickets();
  }, []);

  // Utility function to truncate comment
  const truncateComment = (comment) => {
    const words = comment.split(" ");
    return words.length > 10 ? words.slice(0, 8).join(" ") + "..." : comment;
  };

  return (
    <div>
      <h2 className="mytickets-h2">My Tickets</h2>
      <div className="my-tickets-container">
        {myTickets.length > 0 ? (
          myTickets.map((ticket) => (
            <Box key={ticket._id} className="my-ticket-card">
              <Card variant="outlined" className="card">
                <div className="card-content">
                <CardContent className="card-content">
                  <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                    Ticket ID: {ticket._id}
                  </Typography>
                  <Typography variant="h5" component="div">
                    <span className="bold">Username: </span> {ticket.userName}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    <span className="bold">Department: </span>{ticket.department}
                  </Typography>
                  <Typography variant="body2" className="ticket-details">
                    <span className="bold">Devices: </span> {ticket.device}
                    <br />
                    <span className="bold">Priority: </span> {ticket.priority}
                    <br />
                    <span className="bold">Status: </span> {ticket.status}
                    <br />
                    <span className="bold">Additional Info: </span>
                    {ticket.additionalInfo[0]?.comment
                      ? truncateComment(ticket.additionalInfo[0].comment)
                      : "No comments"}
                  </Typography>
                </CardContent>
                </div>
                <CardActions className="card-action">
                  <Button className="details" size="small">Details</Button>
                  <Button size="small">Update</Button>
                  <Button size="small">Delete</Button>
                </CardActions>
              </Card>
            </Box>
          ))
        ) : (
          <Typography>No tickets found.</Typography>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
