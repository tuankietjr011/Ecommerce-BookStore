import React from 'react'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Space, Table, Select } from 'antd';

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../utils/apiURL';


function Dashboard() {
    // Khởi tạo state là mảng rỗng [] để tránh lỗi undefined ban đầu
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [books, setBooks] = useState([])
    const [reviews, setReviews] = useState([])

    // 1. Fetch Orders
    const fetchOrder = async () => {
        try {
            const res = await axios.get(`${BASE_URL}order`, { withCredentials: true })
            setOrders(res?.data?.data || []) // Thêm || [] để an toàn
        }
        catch (err) {
            setOrders([])
        }
    }

    // 2. Fetch Users
    const fetchUser = async () => {
        try {
            const res = await axios.get(`${BASE_URL}user`, { withCredentials: true })
            setUsers(res?.data?.data || [])
        }
        catch (err) {
            setUsers([])
        }
    }

    // 3. Fetch Products (Books)
    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${BASE_URL}book`, { withCredentials: true })
            setBooks(res?.data?.data || [])
        }
        catch (err) {
            setBooks([])
        }
    }
    
    // 4. Fetch Reviews
    const fetchReview = async () => {
        try {
            const res = await axios.get(`${BASE_URL}review`, { withCredentials: true })
            setReviews(res?.data?.data || [])
        }
        catch (err) {
            setReviews([])
        }
    }

    useEffect(() => {
        fetchProduct()
        fetchOrder()
        fetchUser()
        fetchReview()
    }, [])

    // --- XỬ LÝ DỮ LIỆU AN TOÀN (Thay thế vòng lặp for cũ) ---
    const processedOrders = (orders || []).map(order => {
        // Tìm user tương ứng (thêm ?. để không crash)
        const userMatch = users?.find(u => u.id === order.user_id);
        
        // Xử lý danh sách item trong order
        const processedItems = (order.items || []).map(item => {
            const bookMatch = books?.find(b => b.isbn === item.book_isbn);
            return {
                ...item,
                title: bookMatch ? bookMatch.title : item.book_isbn
            };
        });

        return {
            ...order,
            fullname: userMatch ? userMatch.fullname : 'Unknown',
            items: processedItems
        };
    });
    // -------------------------------------------------------

    const expandedRowRender = (record) => {
        const columns = [
            { title: 'Num', dataIndex: 'num', key: 'num' },
            { title: 'Books', dataIndex: 'books', key: 'books' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Price', dataIndex: 'price', key: 'price' },
        ];
        // Thêm ?. và || [] cho record.items
        const itemData = (record.items || []).map((item, index) => ({
            key: `${record.id}-${index}`,
            num: index + 1,
            books: item.title,
            quantity: item.quantity,
            price: item.price,
        }));

        return <Table columns={columns} dataSource={itemData} pagination={false} />;
    };

    const data = processedOrders.map((order) => ({
        key: order.id,
        name: order.name,
        user: order.fullname,
        email: order.email,
        address: order.address,
        telephone: order.telephone,
        createdAt: order.created_at,
        totalPrice: order.price,
        status: order.status,
        items: order.items,
    }));


    const [statuses, setStatuses] = useState([]);
    
    const handleSelectChange = async (value, index) => {
        const newStatuses = [...statuses]; 
        newStatuses[index] = value; 
        setStatuses(newStatuses); 
        try {
            await axios.patch(`${BASE_URL}order/${index}`, { status: value }, { withCredentials: true })
                .then(res => {
                    alert(res.data.message)
                })
                .catch(err => {
                    alert(err.response?.data?.message || "Error")
                })
        }
        catch (err) {
            console.log(err)
        }
    };

    const columns = [
        { title: 'User', dataIndex: 'user', key: 'user', width: 120 },
        { title: 'Name', dataIndex: 'name', key: 'name', width: 120 },
        { title: 'Email', dataIndex: 'email', key: 'email', width: 110 },
        { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
        { title: 'Telephone', dataIndex: 'telephone', key: 'telephone', width: 150 },
        { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
        { title: 'Total Price', dataIndex: 'totalPrice', key: 'totalPrice', width: 120 },
        {
            title: 'Status',
            key: 'status',
            width: 160,
            render: (text, record, index) => (
                <>
                    <Space size="middle">
                        <Select
                            defaultValue={record.status}
                            value={statuses[record.key]}
                            onChange={(value) => handleSelectChange(value, record.key)}
                            style={{ width: 100 }}
                            options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Done', label: 'Done' },
                                { value: 'Cancelled', label: 'Cancelled' }
                            ]}
                        />
                    </Space>
                </>),
        },
    ];

    return (
        <section id="content">
            <main>
                <div className="head-title">
                    <div className="left">
                        <h1>DashBoard</h1>
                    </div>
                </div>
                <ul className="box-info">
                    <li>
                        <ShoppingCartIcon className='bx' />
                        <span className="text">
                            {/* SỬA LỖI CHÍNH: Thêm ?. và || 0 */}
                            <h3>{orders?.length || 0}</h3>
                            <p>Orders</p>
                        </span>
                    </li>
                    <li>
                        <PeopleAltIcon className='bx' />
                        <span className="text">
                             {/* SỬA LỖI CHÍNH: Thêm ?. và || 0 */}
                            <h3>{users?.length || 0}</h3>
                            <p>Users</p>
                        </span>
                    </li>
                    <li>
                        <LocalAtmIcon className='bx' />
                        <span className="text">
                             {/* SỬA LỖI: Tính tổng tiền an toàn */}
                            <h3>${(orders || []).reduce((total, item) => {
                                return total + (parseFloat(item.price) || 0);
                            }, 0).toFixed(2)}</h3>
                            <p>Earning</p>
                        </span>
                    </li>
                    <li>
                        <ReviewsIcon className='bx' />
                        <span className="text">
                             {/* SỬA LỖI CHÍNH: Thêm ?. và || 0 */}
                            <h3>{reviews?.length || 0}</h3>
                            <p>Reviews</p>
                        </span>
                    </li>
                </ul>
                <div className="table-data">
                    <div className="order">
                        <div className="head">
                            <div className='head-title'>Recent Orders</div>
                        </div>
                        <Table
                            columns={columns}
                            expandable={{ expandedRowRender }}
                            // SỬA LỖI: Đảm bảo data không null
                            dataSource={data || []}
                        />

                    </div>
                </div>
            </main>
        </section >
    )
}

export default Dashboard