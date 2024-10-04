import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import "./TicketDetails.scss";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const TicketDetails = () => {
  const { id } = useParams(); // Get ticket ID from the route parameter
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axiosSecure.get(`/tickets/${id}`); // Fetch ticket details using the ID
        setTicket(response.data);
        setStatus(response.data.status || ""); // Set the initial status from the ticket
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Update the ticket with the new status and comment
      const response = await axiosSecure.put(`/tickets/${id}`, {
        status,
        comment,
      });
      console.log("Ticket updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="ticket-dettails-h2">Ticket Details</h2>
      <div className="ticket-details-container">
        <p>
          <strong>User Name:</strong> {ticket.userName}
        </p>
        <p>
          <strong>Department:</strong> {ticket.department}
        </p>
        <p>
          <strong>Device:</strong> {ticket.device}
        </p>
        <p>
          <strong>Priority:</strong> {ticket.priority}
        </p>
        <p>
          <strong>Additional Info:</strong> {ticket.additionalInfo}
        </p>

        {/* Status Selector */}
        <FormControl fullWidth>
          {/* <InputLabel>Status</InputLabel> */}
          <Select
            native
            name="status"
            value={status || ""} // Default value when no status is selected
            onChange={handleStatusChange}
          >
            <option value="">Change Status</option>
            <option value="in progress">In Progress</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </Select>
        </FormControl>

        {/* Comment Textarea */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Comment"
          value={comment}
          onChange={handleCommentChange}
          style={{ marginTop: "20px" }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: "20px" }}
        >
          Update Ticket
        </Button>
      </div>
    </div>
  );
};

export default TicketDetails;
