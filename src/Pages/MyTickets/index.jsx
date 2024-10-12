import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Rating,
  Drawer,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { axiosSecure } from "../../../src/api/axios";
import "./MyTickets.scss";
import StarIcon from "@mui/icons-material/Star";
import { FaInfoCircle } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const MyTickets = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null); // To store the selected ticket
  const [myTickets, setMyTickets] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await axiosSecure.get("/mytickets");
        setMyTickets(response.data);
      } catch (error) {
        console.error("Error fetching my tickets:", error);
      }
    };

    fetchMyTickets();
  }, []);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
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
      // Update the ticket on the server
      await axiosSecure.put(`/tickets/${ticket._id}`, {
        additionalInfo: [...ticket.additionalInfo, newComment],
      });

      // Immediately update local state
      setTicket((prevTicket) => ({
        ...prevTicket,
        additionalInfo: [...prevTicket.additionalInfo, newComment],
      }));

      setComment(""); // Clear the comment field

      Swal.fire({
        title: "Comment Added!",
        text: "Your comment has been added successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      
      // You could also optionally refetch ticket data here, but we'll handle it on drawer open instead.
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

  const toggleDrawer = async (open, selectedTicket = null) => {
    if (open && selectedTicket) {
      // If opening the drawer, fetch the latest ticket data
      try {
        const response = await axiosSecure.get(`/tickets/${selectedTicket._id}`);
        setTicket(response.data); // Set the ticket data to the latest fetched data
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    }
    setIsDrawerOpen(open);
  };

  const handleDeleteTicket = async (ticketId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/tickets/${ticketId}`);
        // Remove the deleted ticket from myTickets state
        setMyTickets(myTickets.filter((ticket) => ticket._id !== ticketId));
        Swal.fire("Deleted!", "Your ticket has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting ticket:", error);
        Swal.fire({
          title: "Error!",
          text: "There was an error deleting the ticket.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div>
      <h2 className="mytickets-h2">
        My <span style={{ color: "#e58800" }}>Tickets</span>
      </h2>
      <div className="my-tickets-container">
        {myTickets.length > 0 ? (
          myTickets.map((ticketItem) => (
            <Box key={ticketItem._id} className="my-ticket-card">
              <Card variant="outlined" className="card">
                <div className="card-content">
                  <CardContent className="card-content">
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                      Ticket ID: {ticketItem._id}
                    </Typography>
                    <div className="icon-details2">
                      <span className="details-title">Username: </span>
                      {ticketItem.userName}
                    </div>

                    <div className="icon-details2">
                      <span className="details-title">Email: </span>
                      {ticketItem.email}
                    </div>

                    <div className="icon-details2">
                      <span className="details-title">Department: </span>
                      {ticketItem.department}
                    </div>

                    <div className="info">
                      <div className="icon-details2">
                        <span className="details-title">
                          Requested Device:{" "}
                        </span>
                        {ticketItem.device}
                      </div>
                      <div className="icon-details2">
                        <span className="details-title">Priority: </span>
                        {ticketItem.priority}
                        <Rating
                          name="priority-rating"
                          value={
                            ticketItem.priority === "High"
                              ? 3
                              : ticketItem.priority === "Medium"
                              ? 2
                              : ticketItem.priority === "Low"
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
                      <div className="icon-details2">
                        <span className="details-title">Status: </span>
                        {ticketItem.status}
                      </div>
                    </div>
                  </CardContent>
                </div>
                <CardActions className="card-action">
                  <Button
                    className="updatebtn"
                    onClick={() => toggleDrawer(true, ticketItem)} // Pass the current ticket item to the drawer
                  >
                    <MdTipsAndUpdates />
                  </Button>

                  <Button
                    className="deletebtn"
                    disabled={ticketItem.status !== "Pending"}
                    onClick={() => handleDeleteTicket(ticketItem._id)}
                  >
                    <AiFillDelete />
                  </Button>
                </CardActions>
              </Card>

              {/* MUI Drawer */}
              <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => toggleDrawer(false)}
              >
                <Box p={2} width="440px" role="presentation">
                  <Typography className="ticketdetails">
                    Ticket <span style={{ color: "#e58800" }}>Details</span>
                  </Typography>
                  <hr />
                  {ticket && (
                    <>
                      <p className="body1">
                        <span style={{ fontWeight: "600" }}>User Name: </span>
                        {ticket.userName}
                      </p>
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Email: </span>{" "}
                        {ticket.email}
                      </p>
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Department: </span>
                        {ticket.department}
                      </p>
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Device: </span>
                        {ticket.device}
                      </p>
                      <div className="drawerpriority">
                        <span style={{ fontWeight: "600" }}>Priority: </span>
                        {ticketItem.priority}
                        <Rating
                          name="priority-rating"
                          value={
                            ticketItem.priority === "High"
                              ? 3
                              : ticketItem.priority === "Medium"
                              ? 2
                              : ticketItem.priority === "Low"
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
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Status: </span>
                        {ticket.status}
                      </p>
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Additional Info: </span>
                      </p>

                      <div className="additional-info-list">
                        {ticket.additionalInfo.map((info, index) => (
                          <p key={index}>
                            <strong>{info.userName}: </strong>
                            <span>{info.comment}</span> <em>{new Date(info.date).toLocaleString()}</em>
                          </p>
                        ))}
                      </div>
                    </>
                  )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comment . . ."
            value={comment}
            onChange={handleCommentChange}
            variant="outlined" // Ensure you are using the outlined variant
            sx={{
              marginTop: "38px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px", // Apply border radius to the input wrapper
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            sx={{
              marginTop: "40px",
              width: "150px",
              marginLeft: "130px",
              backgroundColor: "#e58800", // Custom background color
              color: "white", // Custom text color
              "&:hover": {
                backgroundColor: "#ff9800", // Optional hover effect
              },
            }}
          >
            Add Comment
          </Button>
                </Box>
              </Drawer>
            </Box>
          ))
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
};


export default MyTickets;
