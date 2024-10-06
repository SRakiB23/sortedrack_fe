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
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    Ticket ID: {ticket._id}
                  </Typography>
                  <Typography variant="h5" component="div">
                    User: {ticket.userName}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    Department: {ticket.department}
                  </Typography>
                  <Typography variant="body2">
                    Device: {ticket.device}
                    <br />
                    Priority: {ticket.priority}
                    <br />
                    Status: {ticket.status}
                    <br />
                    Additional Info:{" "}
                    {ticket.additionalInfo[0]?.comment
                      ? truncateComment(ticket.additionalInfo[0].comment)
                      : "No comments"}
                  </Typography>
                </CardContent>
                <CardActions className="cardAction">
                  <Button size="small">View Details</Button>
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
