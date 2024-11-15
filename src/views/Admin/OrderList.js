import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
  Button,
} from "reactstrap";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

function Orders() {
  const [orders, setOrders] = useState([]);
  const { categoryName } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders by status from the backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:15240/api/order/getOrdersByStatus/${categoryName}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [categoryName]);

  // Function to cancel the order
  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/order/${orderId}/updateStatus/canceled`,
        {
          method: "PUT", // Use PUT for updating status
        }
      );
      if (response.ok) {
        // Update UI to reflect order cancellation
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Order canceled successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  // Function to mark the order as delivered
  const markAsDelivered = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:15240/api/order/${orderId}/updateStatus/delivered`,
        {
          method: "PUT", // Use PUT for updating status
        }
      );
      if (response.ok) {
        // Update UI to reflect order delivered status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "Delivered" } : order
          )
        );
        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Order marked as Delivered successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  // SweetAlert confirmation for removing a product
  const confirmRemoveProduct = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrder(orderId);
      }
    });
  };

  const confirmRemoveProduct2 = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        markAsDelivered(orderId);
      }
    });
  };
  // Filter orders based on the search query
  const filteredOrders = orders.filter((order) => {
    const searchString = searchQuery.toLowerCase();
    return (
      (order.id && order.id.toString().toLowerCase().includes(searchString)) ||
      (order.items &&
        order.items.length > 0 &&
        order.items[0].vendorId &&
        order.items[0].vendorId
          .toString()
          .toLowerCase()
          .includes(searchString)) ||
      (order.shippingAddress &&
        order.shippingAddress.toLowerCase().includes(searchString)) ||
      (order.paymentMethod &&
        order.paymentMethod.toLowerCase().includes(searchString)) ||
      (order.totalAmount &&
        order.totalAmount.toString().toLowerCase().includes(searchString)) ||
      new Date(order.orderDate)
        .toISOString()
        .split("T")[0]
        .includes(searchString)
    );
  });

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">{categoryName} Orders List</CardTitle>
              {/* Search input box on the right */}
              <Input
                type="text"
                placeholder="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "250px", marginRight: "30px" }}
              />
            </CardHeader>
            <CardBody style={{ paddingTop: "30px" }}>
              <Table className="tablesorter" responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Order ID</th>
                    <th>Vendor ID</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {order.items && order.items.length > 0
                          ? order.items[0].vendorId
                          : "Unknown Vendor"}
                      </td>
                      <td>{order.shippingAddress}</td>
                      <td>
                        {new Date(order.orderDate).toISOString().split("T")[0]}
                      </td>
                      <td>{order.paymentMethod}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        {/* Conditionally render buttons based on the category */}
                        {categoryName === "Processing" && (
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => confirmRemoveProduct(order.id)}
                          >
                            Cancel Order
                          </Button>
                        )}
                        {categoryName === "VendorReady" && (
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => confirmRemoveProduct2(order.id)}
                          >
                            Mark as Delivered
                          </Button>
                        )}
                        {/* No buttons for "Delivered" or "Canceled" */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Orders;