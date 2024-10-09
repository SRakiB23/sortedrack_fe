import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosSecure } from "../../../api/axios";
import "./TicketDetails.scss";
import { FormControl, Select, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import { FaCommentAlt, FaPlus, FaRegUserCircle } from "react-icons/fa";
import {
  MdDevices,
  MdEmail,
  MdOutlinePublishedWithChanges,
} from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FcHighPriority } from "react-icons/fc";
import { GrStatusUnknown } from "react-icons/gr";

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
      <div>
        <h2 className="ticket-details-h2">Ticket Details</h2>
      </div>
      <div className="main-container">
        <div className="leftside">
          <div className="leftside-details">
            <div className="leftside-content-first">
              <div>
                <div className="icon-details">
                  <FaRegUserCircle />
                  <p>
                    User name <br />
                  </p>
                </div>
                <p className="items">{ticket.userName}</p>
              </div>
              <div>
                <div className="icon-details">
                  <MdEmail />
                  <p>Email</p>
                </div>
                <p className="items">{ticket.email}</p>
              </div>
              <div>
                <div className="icon-details">
                  <HiOutlineBuildingOffice2 />
                  <p>Department</p>
                </div>
                <p className="items">{ticket.department}</p>
              </div>
              <div>
                <div className="icon-details">
                  <MdDevices />
                  <p>Requested Device</p>
                </div>
                <p className="items">{ticket.device}</p>
              </div>
            </div>
            <div className="leftside-content-second">
              <div>
                <div className="icon-details">
                  <FcHighPriority />
                  <p>Priority</p>
                </div>
                <p className="items">{ticket.priority}</p>
              </div>
              <div>
                <div className="icon-details">
                  <GrStatusUnknown />
                  <p>Status</p>
                </div>
                <p className="items">{ticket.status}</p>
              </div>
            </div>
          </div>
          <div className="change-status-container">
            <div className="change-status">
              <MdOutlinePublishedWithChanges />
              <p>Change Status</p>
            </div>
            <FormControl>
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
          </div>
          <div className="update-button">
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              style={{ width: "420px" }}
            >
              Update Ticket
            </Button>
          </div>
        </div>
        <div className="rightside">
          <h3>Comments</h3>
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
                    <p>{commentObj.comment}</p>
                    <small>{new Date(commentObj.date).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
