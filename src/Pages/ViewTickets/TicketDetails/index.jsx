import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import "./TicketDetails.scss";
import { FormControl, Select, TextField, Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import Swal from "sweetalert2";
import {
  FaCommentAlt,
  FaComments,
  FaPlus,
  FaRegUserCircle,
} from "react-icons/fa";
import {
  MdDevices,
  MdEmail,
  MdOutlinePublishedWithChanges,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FcHighPriority } from "react-icons/fc";
import { GrStatusUnknown } from "react-icons/gr";
import { IoTicket } from "react-icons/io5";
import { FaBoxArchive } from "react-icons/fa6";


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

  // Handle status change
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  // Handle comment change
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Handle status update
  const handleStatusSubmit = async () => {
    // Check if the current status is "Closed"
    if (ticket.status === "Closed") {
      Swal.fire({
        title: "Error!",
        text: "This ticket is already resolved. No further updates are allowed.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return; // Prevent the update
    }

    if (!status) {
      Swal.fire({
        title: "Error!",
        text: "Please select a status to update.",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    // Create payload to include both status and additionalInfo
    const payload = {
      status,
      additionalInfo: ticket.additionalInfo, // Keep existing comments
    };

    try {
      const response = await axiosSecure.put(`/tickets/${id}`, payload);
      console.log("Status updated successfully:", response.data);
      setTicket(response.data); // Update the ticket state with the new data

      Swal.fire({
        title: "Status Updated!",
        text: "Ticket status has been updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the ticket status.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Comment is required to update the ticket.",
        icon: "warning",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
    const loggedInUserName = loggedInUser?.userName;

    if (!loggedInUserName) {
      Swal.fire({
        title: "Error!",
        text: "User is not logged in!",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    const newComment = {
      comment: comment,
      date: new Date(),
      userName: loggedInUserName,
    };

    try {
      const payload = {
        status: ticket.status, // Keep current status
        additionalInfo: [...ticket.additionalInfo, newComment], // Add new comment
      };

      const response = await axiosSecure.put(`/tickets/${id}`, payload);
      console.log("Comment added successfully:", response.data);
      setTicket(response.data); // Update the ticket with the new data
      setComment(""); // Clear the comment field

      Swal.fire({
        title: "Comment Added!",
        text: "Your comment has been added successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error adding the comment.",
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
    <div className="body">
      <div className="main-container">
        <div className="leftside">
          <div className="leftside-details">
            <h2 className="ticket-details-h2">
              <span className="ticketIcon">
                <IoTicket />
              </span>
              Ticket Details
            </h2>
            <hr />
            <div className="leftside-content-first">
              <div className="titles">
                <div className="icon-details">
                  <FaRegUserCircle />
                  <p>
                    User name <br />
                  </p>
                </div>
                <div className="icon-details">
                  <MdEmail />
                  <p>Email</p>
                </div>
                <div className="icon-details">
                  <HiOutlineBuildingOffice2 />
                  <p>Department</p>
                </div>
                <div className="icon-details">
                  <MdDevices />
                  <p>Requested Device</p>
                </div>
                <div className="icon-details">
                  <FcHighPriority />
                  <p>Priority</p>
                </div>
                <div className="icon-details">
                  <GrStatusUnknown />
                  <p>Status</p>
                </div>
              </div>
              <div className="info">
                <div className="icon-details2">{ticket.userName}</div>
                <div className="icon-details2">{ticket.email}</div>
                <div className="icon-details2">{ticket.department}</div>
                <div className="icon-details2">{ticket.device}</div>
                <div className="icon-details2">
                  {ticket.priority}
                  <Rating
                    name="priority-rating"
                    value={
                      ticket.priority === "High"
                        ? 3
                        : ticket.priority === "Medium"
                        ? 2
                        : ticket.priority === "Low"
                        ? 1
                        : 0
                    }
                    readOnly
                    size="small"
                    max={3}
                    icon={<StarIcon fontSize="inherit" />}
                    emptyIcon={null}
                  />
                </div>
                <div className="icon-details2">{ticket.status}</div>
              </div>
            </div>
          </div>
          <div className="change-status-container1">
            <div className="change-status-container">
              <div className="change-status">
                <MdOutlinePublishedWithChanges />
                <p>Change Status</p>
              </div>
              <div>
                <FormControl fullWidth>
                  <Select
                    native
                    name="status"
                    value={status || ""}
                    onChange={handleStatusChange}
                    className="status-select"
                  >
                    <option value="">Change Status</option>
                    <option value="Open">Open</option>
                    <option value="In progress">In Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="update-button">
              <Button
                variant="contained"
                color="success"
                onClick={handleStatusSubmit}
                style={{ width: "400px" }}
              >
                Update Ticket
              </Button>
            </div>
          </div>
        </div>
        <div className="rightside">

          <h2 className="comments">
            <span className="ticketIcon">
              <FaComments />
            </span>
            Comments
          </h2>
          <hr />
          <div className="comments-section">
            {ticket.additionalInfo &&
            Array.isArray(ticket.additionalInfo) &&
            ticket.additionalInfo.length > 0 ? (
              <div>
                {ticket.additionalInfo.map((commentObj, index) => (
                  <div
                    key={commentObj._id || index}
                    className={`comment ${
                      commentObj.authorRole === "admin" ||
                      commentObj.authorRole === "superadmin"
                        ? "left"
                        : "right"
                    }`}
                  >
                    <p>
                      <span className="comment-author">
                        {commentObj.userName}
                      </span>
                      : {commentObj.comment}
                    </p>
                    <p className="comment-date">
                      {new Date(commentObj.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments available.</p>
            )}
          </div>
          <div className="add-comment-container">
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment . . ."
              value={comment}
              onChange={handleCommentChange}
              variant="outlined"
              sx={{
                marginTop: "38px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              sx={{
                marginTop: "40px",
                width: "400px",
                marginLeft: "70px",
                backgroundColor: "#6BBCC8",
                color: "white", // Custom text color
                "&:hover": {
                  backgroundColor: "rgb(109, 190, 195)", // Optional hover effect
                },
              }}
            >
              Add Comment
            </Button>
          </div>
        </div>
       <div className="arhieveContainer">
        <h2>
          Arhieve Ticket
        </h2>
        <hr />
       <Button className="arhieve" sx={{
                backgroundColor: "#6BBCC8",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgb(109, 190, 195)", 
                },
              }}>
        <FaBoxArchive />
        </Button>
       </div>
      </div>
    </div>
  );
};

export default TicketDetails;
