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
  Modal,
} from "@mui/material";
import { axiosSecure, makeRequest } from "../../../src/api/axios";
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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const response = await makeRequest().get("/mytickets");
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
        const response = await axiosSecure.get(
          `/tickets/${selectedTicket._id}`
        );
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

  // MUI Modal styling
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 8,
  };

  return (
    <div>
      <h2 className="mytickets-h2">
        My <span style={{ color: "#82b440" }}>Tickets</span>
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

                    {/* Wrapper div for both titles and values */}
                    <div className="ticket-info">
                      <div className="details-titles">
                        <p className="details-title">Username:</p>
                        <p className="details-title">Email:</p>
                        <p className="details-title">Department:</p>
                        <p className="details-title">Req Device:</p>
                        <p className="details-title">Priority:</p>
                        <p className="details-title">Status:</p>
                      </div>

                      <div className="details-values">
                        <p>{ticketItem.userName}</p>
                        <p>{ticketItem.email}</p>
                        <p>{ticketItem.department}</p>
                        <p>{ticketItem.device}</p>
                        <p>
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
                        </p>
                        <p>{ticketItem.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <CardActions className="card-action">
                  <Button
                    className="detailsbtn"
                    onClick={() => {
                      setTicket(ticketItem);
                      handleOpen();
                    }}
                  >
                    <FaInfoCircle />
                  </Button>
                  <Button
                    className="updatebtn"
                    onClick={() => toggleDrawer(true, ticketItem)}
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
                    Update <span style={{ color: "#82b440" }}>Ticket</span>
                  </Typography>
                  <hr />
                  {ticket && (
                    <>
                      <p className="body1">
                        <span style={{ fontWeight: "600" }}>User Name: </span>
                        {ticket.userName}
                      </p>
                      <p variant="body1">
                        <span style={{ fontWeight: "600" }}>Email: </span>
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
                        <span style={{ fontWeight: "600" }}>Comments:</span>
                      </p>

                      <div className="additional-info-list">
                        {ticket.additionalInfo.map((info, index) => (
                          <p key={index}>
                            <strong>{info.userName}: </strong>
                            <span>{info.comment}</span>{" "}
                            <em>{new Date(info.date).toLocaleString()}</em>
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
                      backgroundColor: "#82b440", // Custom background color
                      color: "white", // Custom text color
                      "&:hover": {
                        backgroundColor: "#82b340", // Optional hover effect
                      },
                    }}
                  >
                    Add Comment
                  </Button>
                </Box>
              </Drawer>
              <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                  {ticket && (
                    <div>
                      <Typography className="ticketdetails">
                        Ticket <span style={{ color: "#e58800" }}>Details</span>
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Labels */}
                        <div>
                          <p variant="body1">
                            <strong>Ticket ID:</strong>
                          </p>
                          <p variant="body1">
                            <strong>User Name:</strong>
                          </p>
                          <p variant="body1">
                            <strong>Email:</strong>
                          </p>
                          <p variant="body1">
                            <strong>Department:</strong>
                          </p>
                          <p variant="body1">
                            <strong>Device:</strong>
                          </p>
                          <p variant="body1">
                            <strong>Priority:</strong>
                          </p>
                          <p variant="body1">
                            <strong>Status:</strong>
                          </p>
                        </div>

                        {/* Ticket Details */}
                        <div>
                          <p variant="body1">{ticket._id}</p>
                          <p variant="body1">{ticket.userName}</p>
                          <p variant="body1">{ticket.email}</p>
                          <p variant="body1">{ticket.department}</p>
                          <p variant="body1">{ticket.device}</p>
                          <p variant="body1">
                            {" "}
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
                          </p>
                          <p variant="body1">{ticket.status}</p>
                        </div>
                      </div>
                      <div className="commentarea">
                        {ticket.additionalInfo.map((info, index) => (
                          <p key={index}>
                            <strong>{info.userName}: </strong>
                            <span>{info.comment}</span> -
                            <em>{new Date(info.date).toLocaleString()}</em>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </Box>
              </Modal>
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
