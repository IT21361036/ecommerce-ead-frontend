//import React, { useState, useEffect } from "react";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  //Table,
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  FaBoxOpen,
  FaTruck,
  FaCheck,
  FaTimesCircle,
  FaSync,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// function UserTables() {
//   const [users, setUsers] = useState([]);

//   // Fetch the user data from the backend API
//   useEffect(() => {
//     fetch("http://127.0.0.1:15240/api/user/getAllUsers")
//       .then((response) => response.json())
//       .then((data) => setUsers(data))
//       .catch((error) => console.error("Error fetching user data:", error));
//   }, []);

//   // Filter only customers
//   const filteredUsers = users.filter((user) => user.role === "Customer");

//   // Function to handle approve/reject actions
//   const handleApprove = (id) => {
//     console.log(`User with ID ${id} approved`);
//     // Add logic to call your API to approve the user
//   };


  // const handleReject = (id) => {
  //   console.log(`User with ID ${id} rejected`);
  //   // Add logic to call your API to reject the user
  // };
  function OrderCategoryCards() {
    const navigate = useNavigate();

      // Hardcoded order categories with icons and order counts
  const orderCategories = [
    {
      name: "Processing",
      dispalyName: "Processing",
      orderCount: 25,
      icon: <FaSync className="me-2" />,
    },
    {
      name: "VendorReady",
      dispalyName: "Vendor Ready",
      orderCount: 12,
      icon: <FaTruck className="me-2" />,
    },
    {
      name: "PartiallyDelivered",
      dispalyName: "Partially Delivered",
      orderCount: 8,
      icon: <FaBoxOpen className="me-2" />,
    },
    {
      name: "Delivered",
      dispalyName: "Delivered",
      orderCount: 45,
      icon: <FaCheck className="me-2" />,
    },
    {
      name: "Canceled",
      dispalyName: "Canceled",
      orderCount: 5,
      icon: <FaTimesCircle className="me-2" />,
    },
  ];


  return (
    <div className="content">
      <Row>
      {orderCategories.map((category) => (
          <Col md="4" key={category.name}>
            <Card className="mb-3">
              <CardHeader>
                <CardTitle tag="h3">
                  {category.icon}
                  {" " + category.dispalyName}
                </CardTitle>
                <h5 className="text-muted">
                  Total Orders: {category.orderCount}
                </h5>
              </CardHeader>
              <CardBody>
                <Button
                  color="primary"
                  onClick={() => navigate(`/admin/orders/${category.name}`)}
                >
                  Manage Orders
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default OrderCategoryCards;
