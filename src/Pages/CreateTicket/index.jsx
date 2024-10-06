import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert2
import { axiosSecure } from "../../../src/api/axios";
import "./CreateTicket.scss";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    department: "",
    device: "",
    priority: "",
    additionalInfo: [],
    status: "",
  });

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userName: userDetails.userName, // Automatically set username
        email: userDetails.email, // Set email
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value || "",
    });
  };

  const handleAdditionalInfoChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      additionalInfo: [{ comment: value, date: new Date() }],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.post("/tickets", {
        ...formData,
      });
      // console.log("Success:", response.data);

      // Display SweetAlert success notification
      Swal.fire({
        title: "Ticket Created!",
        text: "Your ticket has been created successfully!.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error:", error);

      // Display error notification
      Swal.fire({
        title: "Error!",
        text: "Please fill all the fields!!!.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div>
      <h2 className="createticket-header">Create Ticket</h2>
      <Container className="create-ticket-form">
        <form onSubmit={onSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Username and Email in one column */}
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="User Name"
                name="userName"
                value={formData.userName || ""}
                onChange={handleChange}
                fullWidth
                disabled
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Box>

            {/* Department in its own column */}
            <Box flex="1">
              <FormControl fullWidth>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  label="Department"
                >
                  <MenuItem value="">
                    <em>Select Department</em>
                  </MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Developer">Developer</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Device and Priority in one column */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel id="device-label">Device</InputLabel>
                <Select
                  labelId="device-label"
                  id="device"
                  name="device"
                  value={formData.device || ""}
                  onChange={handleChange}
                  label="Device"
                >
                  <MenuItem value="">
                    <em>Select Device/Accessories</em>
                  </MenuItem>
                  <MenuItem value="Laptop">Laptop</MenuItem>
                  <MenuItem value="Monitor">Monitor</MenuItem>
                  <MenuItem value="Keyboard">Keyboard</MenuItem>
                  <MenuItem value="Mouse">Mouse</MenuItem>
                  <MenuItem value="Headphone">Headphone</MenuItem>
                  <MenuItem value="Webcam">Webcam</MenuItem>
                  <MenuItem value="Desktop-Items">Desktop Items</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value="">
                    <em>Select Priority</em>
                  </MenuItem>
                  <MenuItem value="High">
                    High <span className="dot red"> </span>
                  </MenuItem>
                  <MenuItem value="Medium">
                    Medium <span className="dot yellow"> </span>
                  </MenuItem>
                  <MenuItem value="Low">
                    Low <span className="dot green"> </span>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Additional Info */}
            {formData.device && (
              <Box>
                <TextField
                  label="Additional Info"
                  name="additionalInfo"
                  value={
                    formData.additionalInfo.length
                      ? formData.additionalInfo[0].comment
                      : ""
                  }
                  onChange={handleAdditionalInfoChange}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Type your additional info here..."
                />
              </Box>
            )}

            {/* Submit button */}
            <Box>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Submit
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </div>
  );
};

export default CreateTicket;
