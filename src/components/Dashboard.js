import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import "jquery-ui-dist/jquery-ui";
import Nav from './Nav';
import Login from './Login';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { message, Popconfirm } from 'antd';
import './updatepopup.css';
import BASE_URL from './config';


function Dashboard() {
    const auth = localStorage.getItem("superadminlogin");
    const navigator = useNavigate();
    const [admin, setAdmin] = useState([]);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [active, setActive] = useState(0);
    const [inactive, setInactive] = useState(0);
    const [editAdminData, setEditAdminData] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        companyAddress: ''
    });

    useEffect(() => {
        const authOne = localStorage.getItem("superadminlogin");
        if (!authOne) {
            navigator("/");
        } else {
            showAdmins();
        }

        const $sidebarToggle = $(".sidebar-toggle");
        const $sidebar = $("nav");
        let getStatus = localStorage.getItem("status");
        if (getStatus && getStatus === "close") {
            $sidebar.addClass("close");
        }
        $sidebarToggle.on("click", () => {
            $sidebar.toggleClass("close");
            const status = $sidebar.hasClass("close") ? "close" : "open";
            localStorage.setItem("status", status);
        });
        return () => {
            $sidebarToggle.off("click");
        };
    }, []);

    const showAdmins = async () => {
        try {
            const response = await fetch(`${BASE_URL}/showadmin`);
            const data = await response.json();
            if (data.error) {
                setAdmin([]);
            } else {
                setAdmin(data);
                setTotalAdmins(data.length);

                let activeAdmin = 0;
                let inactiveAdmin = 0;
                data.forEach(person => {
                    if (person.status === 'inactive') {
                        inactiveAdmin++;
                    } else if (person.status === 'active') {
                        activeAdmin++;
                    }
                });
                setActive(activeAdmin);
                setInactive(inactiveAdmin);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    const deleteAdmin = async (_id) => {
        try {
            const response = await fetch(`${BASE_URL}/deleteadmin/${_id}`, {
                method: "DELETE"
            });
            const data = await response.json();
            if (data.ok) {
                showAdmins();
            } else {
                console.error("Failed to delete admin");
            }
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    const handleDeleteConfirmation = (_id) => {
        const confirmAction = () => deleteAdmin(_id);

        return (
            <Popconfirm
                title="Are you sure you want to delete this record?"
                onConfirm={confirmAction}
                okText="Yes"
                cancelText="No"
            >
                <button className="btn btn-outline-danger border-0" style={{ marginRight: "3px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                    </svg>
                </button>
            </Popconfirm>
        );
    };

    const handleEditClick = (adminData) => {
        setEditAdminData(adminData);
        setShowEditPopup(true);
        setFormValues({
            firstName: adminData.firstName,
            lastName: adminData.lastName,
            email: adminData.email,
            phoneNumber: adminData.phoneNumber,
            companyName: adminData.companyName,
            companyAddress: adminData.companyAddress
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Check if any changes are made in the form without counting white spaces
        const formChanged = Object.keys(formValues).some(key => formValues[key].trim() !== editAdminData[key].trim());

        if (!formChanged) {
            message.error("No changes made. Please update the form before submitting.");
            return;
        }

        const confirmUpdate = window.confirm("Are you sure you want to update?");
        if (!confirmUpdate) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/updateadmin/${editAdminData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formValues)
            });
            const data = await response.json();
            if (data.ok) {
                setShowEditPopup(false);
                showAdmins();
                // Conditionally refresh the page only if the user confirms the update
                window.location.reload(confirmUpdate);
            } else {
                console.error("Failed to update admin details");
            }
        } catch (error) {
            console.error("Error updating admin details:", error);
        }
    };

    const handleCloseEditPopup = () => {
        showAdmins();
        setShowEditPopup(false);
    };

    const adminDetails = [
        {
            name: "Name",
            selector: row => `${row.firstName} ${row.lastName}`,
            sortable: true
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true
        },
        {
            name: "Company Name",
            selector: row => row.companyName,
            sortable: true
        },
        {
            name: "Status",
            selector: row => row.status,
            sortable: true
        },
        {
            name: 'Action',
            cell: row => (
                <>
                    {handleDeleteConfirmation(row._id)}
                    <button className="btn btn-outline-primary border-0" onClick={() => handleEditClick(row)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                    </button>
                </>
            ),
            sortable: false
        }
    ];

    return (
        <>
            {auth ?
                <>
                    <Nav />
                    <section className="dashboard">

                        <div class="top">
                            <i class="uil uil-bars sidebar-toggle"></i>
                            <div class="search-box">
                                <i class="uil uil-search"></i>
                                <input type="text" placeholder="Search here..." />
                            </div>
                        </div>

                        <div class="dash-content">
                            <div class="overview">
                                <div class="title">
                                    <i class="uil-dashboard"></i>
                                    <span class="text">Dashboard</span>
                                </div>

                                <div class="boxes">
                                    <div class="box box1">
                                        <i class="uil uil-users-alt"></i>
                                        <span class="text">Total Admins</span>
                                        <span class="number">{totalAdmins}</span>
                                    </div>
                                    <div class="box box2">
                                        <i class="uil uil-user-plus"></i>
                                        <span class="text">Active</span>
                                        <span class="number">{active}</span>
                                    </div>
                                    <div class="box box3">
                                        <i class="uil uil-user-times"></i>
                                        <span class="text">Inactive</span>
                                        <span class="number">{inactive}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="activity">
                                <div class="title">
                                    <i class="uil-info-circle"></i>
                                    <span class="text">Admin Detail</span>
                                </div>

                                <div class="activity-data">
                                    <DataTable
                                        columns={adminDetails}
                                        data={admin}
                                        fixedHeader
                                        highlightOnHover
                                        pointerOnHover
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Popup Form */}
                        {showEditPopup && editAdminData && (
                            <div className="popup-container">
                                <div className="edit-popup">
                                    <div className="edit-popup-content">
                                        {/* <span className="close" onClick={handleCloseEditPopup}>×</span> */}
                                        <div class="close-container" onClick={handleCloseEditPopup}>
                                            <div class="close-icon-leftright"></div>
                                            <div class="close-icon-rightleft"></div>
                                        </div>

                                        <div class="update-container">
                                            <div class="update-title" style={{ textAlign: "start" }}>Update Details</div>
                                            <div class="update-content">
                                                <form onSubmit={handleFormSubmit}>
                                                    <div class="update-user-details">
                                                        <div class="update-input-box">
                                                            <span class="update-details">First Name</span>
                                                            <input type="text" name="firstName" value={formValues.firstName} onChange={handleInputChange} required />
                                                        </div>
                                                        <div class="update-input-box">
                                                            <span class="update-details">Last Name</span>
                                                            <input type="text" name="lastName" value={formValues.lastName} onChange={handleInputChange} required />
                                                        </div>
                                                        <div class="update-input-box">
                                                            <span class="update-details">Email</span>
                                                            <input type="text" name="email" value={formValues.email} onChange={handleInputChange} required />
                                                        </div>
                                                        <div class="update-input-box">
                                                            <span class="update-details">Phone Number</span>
                                                            <input type="text" name="phoneNumber" value={formValues.phoneNumber} onChange={handleInputChange} required />
                                                        </div>
                                                        <div class="update-input-box">
                                                            <span class="update-details">Company Name</span>
                                                            <input type="text" name="companyName" value={formValues.companyName} onChange={handleInputChange} required />
                                                        </div>
                                                        <div class="update-input-box">
                                                            <span class="update-details">Company Address</span>
                                                            <input type="text" name="companyAddress" value={formValues.companyAddress} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>
                                                    <div class="update-button">
                                                        <button type="submit" class="update-btn">Update</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </section>

                </> :
                <Login />
            }
        </>
    );
}

export default Dashboard;




