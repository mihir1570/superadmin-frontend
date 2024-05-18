import { useEffect } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui"
import { Link, useNavigate } from 'react-router-dom';
import { message, Popconfirm } from 'antd'
import profileimage from '../img/apple-touch-icon.png'
import pvotlogo from '../img/PVOT_Designs.png'
import BASE_URL from './config';



function Nav() {
    const navigator = useNavigate();

    useEffect(() => {

        const auth = localStorage.getItem('superadminlogin');
        if (!auth) {
            navigator("/");
        }

        const $body = $("body");
        const $modeToggle = $(".mode-toggle");
        let getMode = localStorage.getItem("mode");
        if (getMode && getMode === "dark") {
            $body.addClass("dark");
        }
        $modeToggle.on("click", () => {
            $body.toggleClass("dark");
            const mode = $body.hasClass("dark") ? "dark" : "light";
            localStorage.setItem("mode", mode);
        });
        return () => {
            $modeToggle.off("click");
        };

    }, []);

    const logout = () => {
        localStorage.removeItem("superadminlogin")
        message.success('Logout from super admin panel')
        navigator("/")
    }



    return (
        <nav>
            <div className="logo-name">
                <div className="logo-image">
                    <img src={pvotlogo} alt="profile image" />
                </div>

                {/* <span className="logo_name">PVOT Designs</span> */}
            </div>

            <div className="menu-items">
                <ul className="nav-links">

                    <li><Link to="/dashboard">
                        <i className="uil uil-estate"></i>
                        <span className="link-name">Dashboard</span>
                    </Link></li>
                    {/* 
                    <li><Link to="/analytics">
                        <i className="uil uil-chart"></i>
                        <span className="link-name">Analytics</span>
                    </Link></li> */}

                    <li><Link to="/addadmin">
                        <i className="uil uil-user-plus"></i>
                        <span className="link-name">Admin</span>
                    </Link></li>

                    {/* <li><a href="#">
                        <i className="uil uil-comments"></i>
                        <span className="link-name">Comment</span>
                    </a></li> */}

                    {/*                     
                    <li><a href="#">
                        <i className="uil uil-share"></i>
                        <span className="link-name">Share</span>
                    </a></li> */}
                </ul>

                <ul className="logout-mode">
                    <li><a className='logout'>
                        <i className="uil uil-signout" onClick={logout}></i>
                        <span className="link-name" onClick={logout}>Logout</span>
                    </a></li>

                    <li className="mode">
                        <a href="#">
                            <i className="uil uil-moon"></i>
                            <span className="link-name">Dark Mode</span>
                        </a>

                        <div className="mode-toggle">
                            <span className="switch"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default Nav;