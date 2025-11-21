import React, { useState } from 'react'
import './SideMenu.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
// Hãy kiểm tra lại đường dẫn này xem có đúng trỏ tới file apiReq không
import { logoutUser } from '../../../../store/apiReq';

export default function SideMenu() {
    const [selected, setSelected] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSelect = (option) => {
        setSelected(option);
    };

    // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
    const handleLogout = (e) => {
        e.preventDefault(); // Ngăn chặn tải lại trang
        logoutUser(dispatch, navigate); // Gọi API đăng xuất
    };

    return (
        <section id="sidebar">
            <Link to='/' className="brand">
                <i className='bx bxs-smile'></i>
                <span className="logoName">Book<span>S</span></span>
            </Link>
            <ul className="side-menu top">
                <li className={selected === "dashboard" ? "active" : ""} onClick={() => handleSelect("dashboard")}>
                    <Link to="/admin">
                        <i className='bx bxs-dashboard'></i>
                        <span className="text">Dashboard</span>
                    </Link>
                </li>
                <li className={selected === "products" ? "active" : ""} onClick={() => handleSelect("products")}>
                    <Link to="/admin/products">
                        <i className='bx bxs-dashboard'></i>
                        <span className="text">Products</span>
                    </Link>
                </li>
                <li className={selected === "users" ? "active" : ""} onClick={() => handleSelect("users")}>
                    <Link to="/admin/users">
                        <i className='bx bxs-shopping-bag-alt' ></i>
                        <span className="text">Users</span>
                    </Link>
                </li>
                <li className={selected === "admins" ? "active" : ""} onClick={() => handleSelect("admins")}>
                    <Link to="/admin/admins">
                        <i className='bx bxs-shopping-bag-alt' ></i>
                        <span className="text">Admins</span>
                    </Link>
                </li>
                <li className={selected === "blogs" ? "active" : ""} onClick={() => handleSelect("blogs")}>
                    <Link to="/admin/blogs">
                        <i className='bx bxs-doughnut-chart' ></i>
                        <span className="text">Blogs</span>
                    </Link>
                </li>
                <li className={selected === "contacts" ? "active" : ""} onClick={() => handleSelect("contacts")}>
                    <Link to="/admin/contacts">
                        <i className='bx bxs-message-dots' ></i>
                        <span className="text">Contacts</span>
                    </Link>
                </li>
            </ul>
            
            {/* --- NÚT LOGOUT ĐÃ SỬA --- */}
            <ul className="side-menu">
                <li>
                    <Link to="#" className="logout" onClick={handleLogout}>
                        <i className='bx bxs-log-out-circle' ></i>
                        <span className="text">Logout</span>
                    </Link>
                </li>
            </ul>
        </section>
    )
}