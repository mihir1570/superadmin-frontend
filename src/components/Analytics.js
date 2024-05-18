import { useEffect } from 'react'
import $ from 'jquery'
import "jquery-ui-dist/jquery-ui"
import Nav from './Nav';

function Analytics() {

    useEffect(() => {
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

    return (
        <>

            <Nav />
            <section class="dashboard">
                <div class="top">
                    <i class="uil uil-bars sidebar-toggle"></i>
                    <div class="search-box">
                        <i class="uil uil-search"></i>
                        <input type="text" placeholder="Search here..." />
                    </div>
                </div>

                <div class="dash-content">
                    <div className='main-title'>
                        <h1>Analytics</h1>
                    </div>
                </div>

            </section>
        </>
    )
}
export default Analytics;
