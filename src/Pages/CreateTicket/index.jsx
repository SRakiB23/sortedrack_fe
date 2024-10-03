import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { axiosSecure } from "../../../src/api/axios"; 
import './CreateTicket.scss';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles for Quill

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    userName: "John Doe",
    department: "",
    device: "",
    priority: "",
    additionalInfo: "" // This will now store HTML content from Quill
  });

  // For handling non-Quill input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value || "" // Ensure the value is never null or undefined
    });
  };

  // For handling Quill editor input (HTML content)
  const handleQuillChange = (value) => {
    setFormData({
      ...formData,
      additionalInfo: value // Set the HTML content from Quill editor
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axiosSecure.post("/tickets", formData); 
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className="create-ticket-form" style={{ width: "80%" }}>
      <h2 className="py-3">Create Ticket</h2>
      <Form onSubmit={onSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formUserName">
              <Form.Label>User Name</Form.Label>
              <Form.Control 
                type="text" 
                name="userName" 
                value={formData.userName || ""} // Ensure no null or undefined value
                onChange={handleChange} 
                disabled 
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control
                as="select"
                name="department" 
                value={formData.department || ""} // Ensure no null or undefined value
                onChange={handleChange} 
              >
                <option value="">Select Department</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Developer">Developer</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formDevice">
              <Form.Label>Device List</Form.Label>
              <Form.Control
                as="select"
                name="device" 
                value={formData.device || ""} // Ensure no null or undefined value
                onChange={handleChange}
              >
                <option value="">Select Device/Accessories</option>
                <option value="Laptop">Laptop</option>
                <option value="Monitor">Monitor</option>
                <option value="Keyboard">Keyboard</option>
                <option value="Mouse">Mouse</option>
                <option value="Headphone">Headphone</option>
                <option value="Webcam">Webcam</option>
                <option value="Desktop-Items">Desktop Items</option>
                <option value="others">Others</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority" 
                value={formData.priority || ""}
                onChange={handleChange} 
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        {formData.device && (
          <Form.Group className="my-4" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Additional Information</Form.Label>
            <ReactQuill
              theme="snow"
              value={formData.additionalInfo} // Ensure no null or undefined value
              onChange={handleQuillChange} // Handle HTML content from Quill
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className="submit-button">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTicket;
