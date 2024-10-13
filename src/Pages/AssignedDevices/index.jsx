import React, { useEffect, useState } from "react";
import { axiosSecure } from "../../api/axios"; // Adjust the import path for your axios instance
import { Box, Typography, Card, CardContent } from "@mui/material";
import "./AssignedDevices.scss";

const AssignedDevices = () => {
  const [assignedDevices, setAssignedDevices] = useState([]);

  useEffect(() => {
    const fetchAssignedDevices = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("userDetails"));
        const response = await axiosSecure.get(
          `/assignedProduct/getUserAssignedDevices/${loggedInUser.userId}` // Correct route
        );
        console.log(response.data);
        setAssignedDevices(response.data.assignedDevices); // Access the array here
      } catch (error) {
        console.error("Error fetching assigned devices:", error);
      }
    };

    fetchAssignedDevices();
  }, []);

  return (
    <div>
      <h2 className="assigned-devices-h2">
        Assigned <span style={{ color: "#82b440" }}>Devices</span>
      </h2>
      <div className="assigned-container">
        {assignedDevices.length === 0 ? (
          <p>No assigned devices</p>
        ) : (
          assignedDevices.map((device) => (
            <div className="device-card-container">
              <div className="assigned-details">
                <div>
                  <p className="detailstitle">Product: </p>
                  <p className="detailstitle">Category: </p>
                  <p className="detailstitle">Branch: </p>
                  <p className="detailstitle">Status: </p>
                  <p className="detailstitle">Assigned At:</p>
                </div>
                <div key={device._id} className="device-card">
                  <p className="details-p">{device.product.productType}</p>
                  <p>{device.product.productCategory}</p>
                  <p>{device.product.branch}</p>
                  <p>{device.status}</p>
                  <p>{new Date(device.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedDevices;
