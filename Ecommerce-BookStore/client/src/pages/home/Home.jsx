// import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Banner from '../../components/banner/Banner';
import SearchForm from '../../components/searchForm/SearchForm';

import featuredBook1 from '../../components/imgs/home1-featured-01.jpg'
import featuredBook2 from '../../components/imgs/home1-featured-02.jpg'
import book1 from '../../components/imgs/book1.jpg'
import book2 from '../../components/imgs/book2.jpg'
import book3 from '../../components/imgs/book3.jpg'
import book4 from '../../components/imgs/book4.jpg'
import book5 from '../../components/imgs/book5.jpg'
// import blog from '../../components/imgs/blog.jpg' // Bỏ comment nếu dùng
// import Button from '@mui/material/Button'; // Bỏ comment nếu dùng

import { ReadOutlined, EditTwoTone, SafetyCertificateTwoTone } from '@ant-design/icons';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import NotificationsActiveSharpIcon from '@mui/icons-material/NotificationsActiveSharp';
import QuestionAnswerSharpIcon from '@mui/icons-material/QuestionAnswerSharp';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';


import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { EffectCoverflow } from "swiper";

import './Home.scss'
import ListProducts from '../../components/listProducts/ListProducts';
import ListReview from '../../components/listReview/ListReview';

// import { reviews } from '../../components/data/reviews'; // Không dùng nữa thì có thể bỏ
import { getAllProducts } from '../../store/productSlice';
import { fetchAsyncProducts } from '../../store/apiReq';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../../utils/apiURL';

function Home() {
    window.scrollTo(0, 0);
    const [expanded, setExpanded] = React.useState('');

    const handleChange1 = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAsyncProducts());
    }, []);

    // Sửa lỗi: Đảm bảo products luôn là mảng
    const products = useSelector(getAllProducts) || [];

    const [AllUser, setAllUser] = useState([]);
    const [listReview, setlistReview] = useState([]);

    useEffect(() => {
        fetchReview();
    }, []);

    const fetchReview = async () => {
        try {
            await axios.get(`${BASE_URL}review`, { withCredentials: true })
                .then(res => {
                    // Sửa lỗi: Thêm || [] để tránh undefined
                    setlistReview(res?.data?.data || [])
                })
                .catch(err => {
                    setlistReview([])
                })
        }
        catch (err) {
            console.log(err);
            setlistReview([])
        }
    };

    useEffect(() => {
        fetchAllUser();
    }, []);

    const fetchAllUser = async () => {
        try {
            await axios.get(`${BASE_URL}user`, { withCredentials: true })
                .then(res => {
                    // Sửa lỗi: Thêm || [] để tránh undefined
                    setAllUser(res?.data?.data || []);
                })
                .catch(err => {
                    setAllUser([]);
                })
        } catch (err) {
            setAllUser([]);
        }
    };

    // --- ĐOẠN CODE QUAN TRỌNG ĐÃ SỬA ---
    // Sử dụng Optional Chaining (?.) và Fallback (|| []) để không bị lỗi map
    const userReview = listReview?.map(item => {
        const userId = item.user_id;
        // Thêm ?. vào AllUser và products để tránh lỗi nếu chưa tải xong
        const userMatch = AllUser?.find(userItem => userItem.id === userId);
        const bookMatch = products?.find(bookItem => bookItem.isbn === item.book_isbn);
        
        if (userMatch && bookMatch) {
            return {
                ...item,
                fullname: userMatch.fullname,
                avt_url: userMatch.avt_url,
                title: bookMatch.title,
            };
        }
        return item;
    }) || []; 
    // -----------------------------------

    return (

        <div id="container-home">
            <Banner />
            <SearchForm />
            <div className="list-products">
                <h1>Phổ Biến Book<span>S</span></h1>
                <Swiper
                    style={{ width: '100%', padding: '50px 0' }}
                    effect={"coverflow"}
                    centeredSlides={true}
                    initialSlide={2}
                    slidesPerView={"auto"}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2,
                        slideShadows: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    modules={[EffectCoverflow]}
                    className="mySwiper swiper-books"
                >
                    <SwiperSlide style={{ width: "300px", height: "400px" }}>
                        <img src={book1} style={{ width: '100%', display: 'block' }} />
                    </SwiperSlide>
                    <SwiperSlide style={{ width: "300px", height: "400px" }}>
                        <img src={book2} style={{ width: '100%', display: 'block' }} />
                    </SwiperSlide>
                    <SwiperSlide style={{ width: "300px", height: "400px" }}>
                        <img src={book3} style={{ width: '100%', display: 'block' }} />
                    </SwiperSlide>
                    <SwiperSlide style={{ width: "300px", height: "400px" }}>
                        <img src={book4} style={{ width: '100%', display: 'block' }} />
                    </SwiperSlide>
                    <SwiperSlide style={{ width: "300px", height: "400px" }}>
                        <img src={book5} style={{ width: '100%', display: 'block' }} />
                    </SwiperSlide>

                </Swiper>
            </div>
            <div className='sticker-mark'>
                <div className="card tonsofbook">
                    <div className="overlay"></div>
                    <div className="circle">
                        <ReadOutlined style={{ fontSize: '5rem' }} />
                    </div>
                    <h3>Hàng Tấn Sách</h3>
                    <p>Hiệu sách có thể là kho báu cho những người đam mê sách,
cung cấp nhiều đầu sách đa dạng, từ những cuốn sách bán chạy nhất
đến những phiên bản hiếm</p>
                </div>
                <div className="card authorWrite">
                    <div className="overlay"></div>
                    <div className="circle">
                        <EditTwoTone style={{ fontSize: '5rem' }} />
                    </div>
                    <h3>Hàng trăm tác giả</h3>
                    <p>Hiệu sách cung cấp cho độc giả nhiều lựa chọn tác phẩm đa dạng của các nhà văn nổi tiếng và mới nổi,
và cơ hội khám phá các phong cách viết khác nhau</p>
                </div>
                <div className="card SafeTransaction">
                    <div className="overlay"></div>
                    <div className="circle">
                        <SafetyCertificateTwoTone style={{ fontSize: '5rem', color: 'black' }} />
                    </div>
                    <h3>Thanh toán dễ dàng</h3>
                    <p>Nhà sách cung cấp hệ thống thanh toán nhanh chóng và an toàn.
Chúng tôi cung cấp nhiều lựa chọn thanh toán, bao gồm thẻ tín dụng, ngân hàng trực tuyến,
và thanh toán khi nhận hàng.</p>
                </div>
            </div>
            <div className="outstanding">
                <div className='introcduce-book'>
                    <h3>Sách nổi bật</h3>
                    <h1>Cẩm nang thiết kế đồ họa hoàn chỉnh dành cho người mới bắt đầu</h1>
                    <h4>Tuấn Kiệt</h4>
                    <p>Bao gồm các vật dụng nghệ thuật, phần mềm, phát triển ý tưởng, nhu cầu sao chép và nhiều hơn nữa.

Các dự án mẫu bao gồm danh thiếp, quảng cáo in ấn và quảng cáo trên web, và áo phông đồ họa.

Tiếp nối thành công của các đầu sách khác dành cho các nghệ sĩ đầy tham vọng, bao gồm các đầu sách Complete Idiot’s Guide® về nhiếp ảnh kỹ thuật số, hội họa và manga.

                    </p>
                    <a className='btn-featured'>Xem thêm</a>
                </div>
                <div className='featured-book'>
                    <img src={featuredBook1} alt="" />
                </div>
                <div className='featured-category' >
                    <img src={featuredBook2} alt="" />
                    <h3>Danh mục nổi bật</h3>
                    <p>Hướng dẫn lập trình hoàn chỉnh cho người mới bắt đầu</p>
                </div>
            </div><br></br>

            <ListProducts title="Giảm giá" products={products} style={{ backgroundColor: '#eee' }} />

            <ListReview title="Đánh Giá" reviews={userReview} />

            <div className="FAQs">
                <QuestionAnswerSharpIcon sx={{ fontSize: '2.8rem' }} />&nbsp;&nbsp;<h1 className='list-title'> FA<span className='highlight'>Q</span>s </h1>
                <br></br>
                <div className="tag111">
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange1('panel1')} style={{ border: '1px solid', backgroundColor: 'white' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '20%', }}>
                                <ManageAccountsSharpIcon sx={{ fontSize: 30 }} />
                            </Typography>
                            <Typography sx={{ width: '80%', textAlign: 'left', fontSize: "20px" }}>
Phải mất bao lâu để tôi nhận được đơn hàng?
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ textAlign: 'left', fontSize: '1.6rem' }}>
                                Thông thường mất 2-3 ngày đối với khách hàng sống ở thành phố, khoảng 5-6 ngày đối với khách hàng sống ở nông thôn.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange1('panel2')} style={{ border: '1px solid', background: 'white' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ width: '20%', }}>
                                <PaymentsSharpIcon sx={{ fontSize: 30 }} />
                            </Typography>
                            <Typography sx={{ width: '80%', textAlign: 'left', fontSize: "20px" }}>
Bạn có bán sách điện tử không?
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ textAlign: 'left', fontSize: '1.6rem' }}>
Không. Chúng tôi nghĩ rằng không gì tuyệt vời hơn cảm giác cầm trên tay một cuốn sách giấy thực sự.                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className="tag111">
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange1('panel3')} style={{ border: '1px solid', background: 'white' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ width: '20%', }}>
                                <ManageAccountsSharpIcon sx={{ fontSize: 30 }} />
                            </Typography>
                            <Typography sx={{ width: '80%', textAlign: 'left', fontSize: "20px" }}>
Làm thế nào để trả lại đơn hàng mà tôi không muốn nhận?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ textAlign: 'left', fontSize: '1.6rem' }}>
                                Nếu bạn đã nhận được một cuốn sách mà bạn không còn muốn nữa, bạn có thể trả lại trong vòng 14 ngày kể từ ngày giao hàng để được hoàn tiền đầy đủ.
Số tiền hoàn lại sẽ bao gồm chi phí của những cuốn sách đã trả lại cộng với chi phí vận chuyển ban đầu để bù đắp cho chi phí vận chuyển trả lại.
                                <br></br>
Để đảm bảo gói hàng của bạn được trả lại đúng cách, vui lòng ghi rõ số đơn đặt hàng trên bao bì.                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange1('panel4')} style={{ border: '1px solid', }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '20%', }}>
                                <NotificationsActiveSharpIcon sx={{ fontSize: 30 }} />
                            </Typography>
                            <Typography sx={{ width: '80%', textAlign: 'left', fontSize: "20px" }}>
Tôi nhận được sản phẩm không đúng. Tôi phải làm sao?
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ textAlign: 'left', fontSize: '1.6rem' }}>
                                Đôi khi, lỗi của con người có thể dẫn đến việc đơn hàng bị sai sách!
Nếu bạn nhận được sai sản phẩm, vui lòng liên hệ với bộ phận chăm sóc khách hàng để yêu cầu gửi lại
hoặc hoàn tiền cho đơn hàng của bạn. Vui lòng gửi kèm hình ảnh sản phẩm bị sai nếu có thể.
Xin hãy kiên nhẫn vì chúng tôi sẽ liên hệ để báo cáo bất kỳ và tất cả các trường hợp đóng gói sai.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </div>

        </div>

    );
}

export default Home;