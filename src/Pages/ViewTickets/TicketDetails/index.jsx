import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import "./TicketDetails.scss";
import { FormControl, Select, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axiosSecure.get(`/tickets/${id}`);
        setTicket(response.data);
        setStatus(response.data.status || "");
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
      const response = await axiosSecure.put(`/tickets/${id}`, {
        status,
        comment,
        author: "", 
        email: "", 
      });

      console.log("Ticket updated successfully:", response.data);
      setTicket(response.data); 
      setComment(""); 

      Swal.fire({
        title: "Ticket Updated!",
        text: "Your ticket has been updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating ticket:", error);

      // Optionally, you can show an error alert if needed
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the ticket.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="ticket-details-h2">Ticket Details</h2>
      <div className="ticket-details-container">
        <p>
          <strong>User Name:</strong> {ticket.userName}
        </p>
        <p>
          <strong>Email:</strong> {ticket.email}
        </p>
        <p>
          <strong>Department:</strong> {ticket.department}
        </p>
        <p>
          <strong>Device:</strong> {ticket.device}
        </p>
        <p
          className={
            ticket.priority === "High"
              ? "priority-high"
              : ticket.priority === "Medium"
              ? "priority-medium"
              : ticket.priority === "Low"
              ? "priority-low"
              : ""
          }
        >
          <strong style={{ color: "black" }}>Priority: </strong>
          {ticket.priority}
        </p>

        {/* Displaying additional info (comments are part of this) */}

        <div className="comments-section">
          <h3>Comments</h3>
          {ticket.additionalInfo &&
          Array.isArray(ticket.additionalInfo) &&
          ticket.additionalInfo.length > 0 ? (
            <div>
              {ticket.additionalInfo.map((commentObj, index) => (
                <div key={commentObj._id || index} className="comment">
                  <p>
                    {/* <strong>Comment:</strong>  */}
                    {commentObj.comment}
                  </p>
                  <small>{new Date(commentObj.date).toLocaleString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No comments available.</p>
          )}
        </div>

        {/* Status Selector */}
        <FormControl fullWidth>
          <Select
            native
            name="status"
            value={status || ""}
            onChange={handleStatusChange}
            className="status-select"
          >
            <option value="">Change Status</option>
            <option value="In progress">In Progress</option>
            <option value="Solved">Solved</option>
            <option value="Rejected">Rejected</option>
          </Select>
        </FormControl>

        {/* Comment Input */}
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
