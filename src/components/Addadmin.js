import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import "jquery-ui-dist/jquery-ui";
import Nav from './Nav';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { message as antdMessage } from 'antd'; // Importing message from antd as antdMessage
import BASE_URL from './config';


const config = {
    cUrl: 'https://api.countrystatecity.in/v1/countries',
    ckey: 'cnNiS2lrQVhzZEJMV2JGanc4MHRIeEhoRzBzWkZNc1QxOGtQUmpScQ=='
};



// Regular expression patterns for email and phone number validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?\d{1,3}\d{9,15}$/;


function Addadmin() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [password, setPassword] = useState('admin@123');
    // City State Country
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    // const [value, setValue] = useState(null);





    useEffect(() => {
        loadCountries();
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


    const submitData = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim() || !companyName.trim() || !companyAddress.trim() || !selectedCountry || !selectedState || !selectedCity || !message.trim()) {
            setError(true);
            antdMessage.info("Please fill out all fields.");
            return;
        } else if (!emailPattern.test(email.trim())) {
            setError(true);
            antdMessage.error("Please enter a valid email address.");
            return;
        } else if (!phonePattern.test(phoneNumber.trim())) {
            setError(true);
            antdMessage.error("Please enter a valid phone number.");
            return;
        }

        const confirmation = window.confirm("Please review your details carefully before proceeding. \nPress OK to submit.");
        if (confirmation) {
            const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const date = new Date()
            const day = date.getDate()
            const month = monthName[date.getMonth()]
            const year = date.getFullYear()
            const status = "inactive"

            const datas = await fetch(`${BASE_URL}/validatedetail`, {
                method: "post",
                body: JSON.stringify({ email }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const result = await datas.json()
            if (result.error) {
                const finaldata = await fetch(`${BASE_URL}/registeradmin`, {
                    method: "post",
                    body: JSON.stringify({
                        firstName, lastName, email, phoneNumber, companyName, companyAddress, selectedCountry,
                        selectedState, selectedCity, message, password, day, month, year, status
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const finalresult = await finaldata.json()
                if (finaldata) {
                    antdMessage.success("Success: Data Submitted Successfully!")
                    // setFirstName(" ")
                    // setLastName(" ")
                    // setEmail(" ")
                    // setPhoneNumber(" ")
                    // setCompanyName(" ")
                    // setCompanyAddress(" ")
                    // setSelectedCountry(" ")
                    // setSelectedState(" ")
                    // setSelectedCity(" ")
                    // setMessage(" ")
                    // document.getElementById("addAdminForm").reset();
                } else {
                    antdMessage.error("Submission Error: Unable to Submit Data")
                }
            } else {
                antdMessage.info("Error: Email Already Registered")
            }
        }
    };


    const loadCountries = () => {
        fetch(config.cUrl, { headers: { "X-CSCAPI-KEY": config.ckey } })
            .then(response => response.json())
            .then(data => {
                setCountries(data);
            })
            .catch(error => console.error('Error loading countries:', error));
    };

    const loadStates = (countryCode) => {
        fetch(`${config.cUrl}/${countryCode}/states`, { headers: { "X-CSCAPI-KEY": config.ckey } })
            .then(response => response.json())
            .then(data => {
                setStates(data);
            })
            .catch(error => console.error('Error loading states:', error));
    };

    const loadCities = (countryCode, stateCode) => {
        fetch(`${config.cUrl}/${countryCode}/states/${stateCode}/cities`, { headers: { "X-CSCAPI-KEY": config.ckey } })
            .then(response => response.json())
            .then(data => {
                setCities(data);
            })
            .catch(error => console.error('Error loading cities:', error));
    };

    const handleCountryChange = (e) => {
        const countryCode = e.target.value;
        if (countryCode) {
            setSelectedCountry(countryCode);
            setSelectedState(''); // Reset selected state
            setSelectedCity(''); // Reset selected city
            setCities([]); // Reset cities
            loadStates(countryCode);
        } else {
            setSelectedCountry('');
            setSelectedState('');
            setSelectedCity('');
            setStates([]);
            setCities([]);
        }
    };

    const handleStateChange = (e) => {
        const stateCode = e.target.value;
        if (stateCode) {
            setSelectedState(stateCode);
            setSelectedCity(''); // Reset selected city
            setCities([]); // Reset cities
            loadCities(selectedCountry, stateCode);
        } else {
            setSelectedState('');
            setSelectedCity('');
            setCities([]);
        }
    };

    const handleCityChange = (e) => {
        const cityCode = e.target.value;
        if (cityCode) {
            setSelectedCity(cityCode);
        } else {
            setSelectedCity('');
        }
    };


    return (
        <>
            <Nav />
            <section className="dashboard">
                <div className="top">
                    <i className="uil uil-bars sidebar-toggle"></i>
                    <div className="search-box">
                        <i className="uil uil-search"></i>
                        <input type="text" placeholder="Search here..." />
                    </div>
                </div>
                <div className="dash-content">
                    <div className='main-title'>
                        <div className='container addadmin'>
                            <h4>Admin Registration Form</h4>

                            <form id="addAdminForm" className="row g-3">


                                {/* Name */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="inputname" className="form-label">First Name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="name4" value={firstName} onChange={(e) => { setFirstName(e.target.value) }} required />
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="tooltip-error">
                                                    {error && !firstName.trim() ? 'Please enter your first name' : '👤'}
                                                </Tooltip>
                                            }
                                        >
                                            <span className="input-group-text">
                                                <i className={`uil uil-user ${error && !firstName.trim() ? 'text-danger' : ''}`}></i>
                                            </span>
                                        </OverlayTrigger>
                                    </div>
                                </div>


                                {/* Last Name */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="inputlastname" className="form-label">Last Name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="lastname4" value={lastName} onChange={(e) => { setLastName(e.target.value) }} required />
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !lastName.trim() ? 'Please enter your last name' : '👤'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-user ${error && !lastName.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* Email */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                                    <div className="input-group">
                                        <input type="email" className="form-control" id="inputEmail4" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !email.trim() ? 'Please enter a valid email' : '📧'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-envelope ${error && !email.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* Phone number */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="inputPhoneNumber" className="form-label">Phone Number</label>
                                    <div className="input-group">
                                        <PhoneInput
                                            country={'in'}
                                            value={phoneNumber}
                                            onChange={setPhoneNumber}
                                            inputClass="form-control"
                                            enableSearch={true}
                                            enableAreaCodes={true}
                                            inputProps={{
                                                name: 'phone',
                                                required: true,
                                                autoComplete: 'off-phone-number' // auto fill of
                                            }}
                                            containerStyle={{ width: '90.7%', borderRadius: '' }}
                                            buttonStyle={{ height: '2.85rem', borderRadius: '' }}
                                            inputStyle={{
                                                height: '2.9rem',
                                                width: '100%',
                                                borderRadius: '0',
                                                borderTopLeftRadius: '',
                                                borderBottomLeftRadius: ''
                                            }}
                                        />

                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !phoneNumber.trim() ? 'Please enter a valid phone number' : '📞'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-phone ${error && !phoneNumber.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>



                                {/* Company Name */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="companyname4" className="form-label">Company Name</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="companyname4" value={companyName} onChange={(e) => { setCompanyName(e.target.value) }} required />
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !companyName.trim() ? 'Please enter your company name' : '🏢'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-building ${error && !companyName.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* Company address */}
                                <div className="col-md-6 input-container">
                                    <label htmlFor="inputAddress" className="form-label">Company Address</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" value={companyAddress} onChange={(e) => { setCompanyAddress(e.target.value) }} required />
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !companyAddress.trim() ? 'Please enter your company address' : '🗺️'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-home ${error && !companyAddress.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* Country */}
                                <div className="col-md-4 input-container">
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <div className="input-group">
                                        <select className="form-select" id="country" onChange={handleCountryChange} >
                                            <option value="">Select Country</option>
                                            {countries.map(country => (
                                                <option key={country.iso2} value={country.iso2}>{country.name}</option>
                                            ))}
                                        </select>
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !selectedCountry.trim() ? 'Please select a country' : '🌍'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-globe ${error && !selectedCountry.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* State */}
                                <div className="col-md-4 input-container">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <div className="input-group">
                                        <select className="form-select" id="state" onChange={handleStateChange} disabled={!states.length}>
                                            <option value="">Select State</option>
                                            {states.map(state => (
                                                <option key={state.iso2} value={state.iso2}>{state.name}</option>
                                            ))}
                                        </select>
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !selectedState.trim() ? 'Please select a state' : '🌐'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-map-marker-alt ${error && !selectedState.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* City */}
                                <div className="col-md-4 input-container">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <div className="input-group">
                                        <select className="form-select" id="city" onChange={handleCityChange} disabled={!cities.length}>
                                            <option value="">Select City</option>
                                            {cities.map(city => (
                                                <option key={city.iso2} value={city.iso2}>{city.name}</option>
                                            ))}
                                        </select>
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !selectedCity.trim() ? 'Please select a city' : '🏙️'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-location-pin-alt ${error && !selectedCity.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                {/* Profile Picture */}
                                {/* <div className="mb-3">
                                    <label htmlFor="inputProfilePicture" className="form-label">Upload Profile Picture</label>
                                    <div className="input-group">
                                        <input type="file" className="form-control" name="profileimage" id="inputProfilePicture" />
                                        <span className="input-group-text">
                                            <i className="uil uil-upload-alt" style={{ fontSize: "1rem" }}></i>
                                        </span>
                                    </div>
                                </div> */}


                                {/* Message */}
                                <div className="md-3 input-container">
                                    <label htmlFor="inputMessage" className="form-label">Message</label>
                                    <div className="input-group">
                                        <textarea className="form-control" id="inputMessage" rows="2" value={message} onChange={(e) => { setMessage(e.target.value) }} required></textarea>
                                        <span className="input-group-text">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="tooltip-error">
                                                        {error && !message.trim() ? 'Please enter a message' : '💬'}
                                                    </Tooltip>
                                                }
                                            >
                                                <i className={`uil uil-comment-alt ${error && !message.trim() ? 'text-danger' : ''}`}></i>
                                            </OverlayTrigger>
                                        </span>
                                    </div>
                                </div>


                                <div className="col-12 d-flex justify-content-center" style={{ marginTop: '20px' }}>
                                    <button type="button" onClick={submitData} className="btn btn-primary" style={{ height: '40px', width: '100%' }}>
                                        Add Admin
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Addadmin;

















