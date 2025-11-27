import './DetailsProduct.scss'
import React, { useState, useEffect } from "react";
import SearchForm from '../../components/searchForm/SearchForm';
import { Avatar } from "@mui/material"
import Rating from '@mui/material/Rating';
import { Form, Modal } from "antd";
import { CheckCircleFilled, EditFilled, DeleteFilled, WarningFilled } from '@ant-design/icons'
import { useLocation } from 'react-router-dom';
import ScrollToTop from '../../utils/srcolltoTop';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearProductSingle, getProductSingle, getSingleProductStatus } from '../../store/productSlice';
import { fetchAsyncAuthor, fetchAsyncProductSingle } from '../../store/apiReq';
import { getAuthor, getAuthorStatus } from '../../store/authorSlice';
import { STATUS } from '../../utils/status';
import Loading from '../../components/loading/Loading';
import axios from 'axios';
import { BASE_URL } from '../../utils/apiURL';
import { Link } from 'react-router-dom';
import { addToCart } from "../../store/cartSlice";
const number_of_product = 20

function DetailsProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => window.scrollTo(0, 0), []);
    useEffect(() => {
        dispatch(clearProductSingle())
        dispatch(fetchAsyncProductSingle(id));
    }, [id]);

    const productSingle = useSelector(getProductSingle);

    const author = useSelector(getAuthor)

    const user = useSelector((state) => state?.auth?.login?.currentUser);

    const [AllUser, setAllUser] = useState([]);
    const [listReview, setlistReview] = useState([]);
    const [valueRating, setvalueRating] = useState(0);
    const [valueReview, setvalueReview] = useState("");
    const [listCategory, setListCategory] = useState([]);

    const [valueQuantity, setValueQuantity] = useState(1);

    const onSubmitReview = async (e) => {
        if (!user) return alert("Vui lòng đăng nhập để xem");
        e.preventDefault();
        const post = {
            rating: valueRating,
            review: valueReview,
            book_isbn: id
        };
        await axios.post(`${BASE_URL}review`, post, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const fetchReview = async () => {
        try {
            await axios.get(`${BASE_URL}review`, { withCredentials: true })
                .then(res => {
                    setlistReview(res.data.data)
                })
                .catch(err => {
                    setlistReview([])
                })
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAllUser();
    }, []);
    const fetchAllUser = async () => {
        await axios.get(`${BASE_URL}user`, { withCredentials: true })
            .then(res => {
                setAllUser(res.data.data);
            })
            .catch(err => {
                setAllUser([]);
            })
    };
    useEffect(() => {
        fetchReview();
    }, []);

    const filteredListReview = listReview?.filter(item => item.book_isbn === id);
    const updatedReview = filteredListReview?.map(item => {
        const userId = item.user_id;
        const userMatch = AllUser?.find(userItem => userItem.id === userId);
        if (userMatch) {
            return {
                ...item,
                fullname: userMatch?.fullname,
                avt_url: userMatch?.avt_url
            };
        }
        return item;
    });
    const avgRating = updatedReview?.reduce((total, item) => total + parseInt(item.rating), 0) / updatedReview?.length;

    useEffect(() => {
        if (productSingle && productSingle.author_id)
            dispatch(fetchAsyncAuthor(productSingle.author_id));
    }, [dispatch, productSingle.author_id]);

    const newprice = Math.round((productSingle.price - (productSingle.price * productSingle.on_sale / 100)) * 100) / 100;

    //list category
    const fetchCategory = async () => {
        await axios.get(`${BASE_URL}category/${id}`, { withCredentials: true })
            .then(res => {
                setListCategory(res.data.data)
            })
            .catch(err => {
                setListCategory([])
            })
    };
    useEffect(() => {
        fetchCategory();
    }, []);

    useEffect(() => {
        document.querySelector(".detail_product_wrapper input").setAttribute("value", 1);
        function translateImg() {
            const slideWidth = document.querySelector(".detail_product_wrapper .img_slide_wrapper").clientWidth;
            document.querySelector('.detail_product_wrapper .img_slide').style.transform = `translateX(${- imgId * slideWidth}px)`;
        }

        const tabSelectItems = document.querySelectorAll(".detail_product_wrapper .tab_list .tab_select");

        for (let i = 0; i < tabSelectItems.length; i++) {
            tabSelectItems[i].addEventListener('click', (event) => {
                tabSelectItems[(i + 1) % 2].setAttribute("aria-selected", false);
                tabSelectItems[i].setAttribute("aria-selected", true);
                if (i == 0) {
                    document.querySelector(".detail_product_wrapper .tab_panel_content .description_tab_panel").style.display = "flex";
                    document.querySelector(".detail_product_wrapper .tab_panel_content .reviews_tab_panel").style.display = "none";
                } else {
                    document.querySelector(".detail_product_wrapper .tab_panel_content .description_tab_panel").style.display = "none";
                    document.querySelector(".detail_product_wrapper .tab_panel_content .reviews_tab_panel").style.display = "flex";
                }
            });
        }
    }, []);
    //api get review id



    const handleAddtoCart = (id, title, newprice, img,) => {
        dispatch(addToCart({ id, title, newprice, img, quantity: valueQuantity }))
    }
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [modal4Open, setModal4Open] = useState(false);
    const [modal3Open, setModal3Open] = useState(false);

    const handleDeleteReview = async (id) => {
        try {
            await axios.delete(`${BASE_URL}review/${id}`, { withCredentials: true })
                .then(res => {
                    console.log(res.data.message)
                    setModal4Open(false)
                });
        }
        catch (err) {
            console.log(err)
        }
    }
    const [reviewId, setReviewId] = useState([]);

    const fetchReviewId = async (id_review) => {
        try {
            await axios.get(`${BASE_URL}review/${id_review}`, { withCredentials: true })
                .then(res => {
                    setReviewId(res.data.data)
                    setModal3Open(true)
                })
                .catch(err => {
                    setReviewId([])
                })
        }
        catch (err) {
            console.log(err)
        }

    }

    const handleEditReview = async (id) => {
        const dataUpdateReview = {
            rating: reviewId.rating,
            review: reviewId.review,
            book_isbn: reviewId.book_isbn,
        }
        console.log(id)
        try {
            await axios.patch(`${BASE_URL}review/${id}`, dataUpdateReview, { withCredentials: true })
                .then(res => {
                    console.log(res.data)
                    setModal3Open(false)
                });
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div className="detail_page_container">
                <SearchForm />
                <div className="detail_product_wrapper">
                    <div className="detail_product_container">
                        <div className="product_summary">
                            <div className="product_img_slider">
                                <div className="img_slide_wrapper">
                                    <div className="img_slide">
                                        <img src={productSingle?.image_url} alt="" />
                                    </div>
                                </div>
                            </div>

                            <div className="summarize">
                                <div className="product_title">
                                    {productSingle?.title}
                                </div>
                                <div className="product_rating">
                                    <Rating name="read-only" value={avgRating} precision={0.5} size='large' readOnly />
                                    <span className='number_of_review'>({updatedReview.length} Đánh giá)</span>
                                </div>
                                <div className="product_intro">
                                    Bạn có thể làm gì để tiết kiệm tiền khi mua sắm trực tuyến? Bạn có thể thắc mắc liệu việc tìm kiếm phiếu giảm giá và chương trình khuyến mãi có tốn thời gian không. Nếu bạn không thích điều đó, vẫn còn những lựa chọn khác. Bạn chỉ cần lưu ý những mẹo trong bài viết này và thực hiện theo..
                                </div>
                                <div className="product_buy">
                                    <div className="product_price">${newprice} {productSingle?.on_sale != 0 ? <><span>${productSingle?.price}</span> <p>(-{productSingle?.on_sale}%)</p></> : <></>}</div>
                                    <div className="number_of_product">{number_of_product} Trong kho</div>
                                    <div className="quantity_and_button">
                                        <div className="quantity">
                                            <input type="number" name="" min={1} max={number_of_product} onChange={(e) => setValueQuantity(parseInt(e.target.value))} />
                                        </div>
                                        <div className="add_button" onClick={() =>
                                            handleAddtoCart(id, productSingle?.title, newprice, productSingle?.image_url, valueQuantity)}>
                                            ADD TO CART
                                        </div>
                                    </div>
                                </div>
                                <div className="product_categories">
                                    <span>Thể loại:</span>
                                    {listCategory.map((item, index) => (
                                        <div key={index} style={{ display: 'inline' }}>
                                            <Link to={`/category/${item}`}>{item}</Link>
                                            {index !== listCategory.length - 1 ? ", " : "."}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="product_detail">
                            <div className="book_detail">
                                <div className="title">Chi tiết sách</div>
                                <table className="book_infor">
                                    <tbody>
                                        <tr>
                                            <th>Trang</th>
                                            <td>{productSingle?.pages} Trang</td>
                                        </tr>

                                        <tr>
                                            <th>Thiết kế bìa</th>
                                            <td>{productSingle?.cover_designer}</td>
                                        </tr>

                                        <tr>
                                            <th>Nhà xuất bản</th>
                                            <td>{productSingle?.publisher}</td>
                                        </tr>

                                        <tr>
                                            <th>Ngôn ngữ</th>
                                            <td>{productSingle?.lang}</td>
                                        </tr>

                                        <tr>
                                            <th>Phát hành</th>
                                            <td>{productSingle?.released}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="author">
                                <div className="title">Về tác giả</div>
                                <div className="author_infor">
                                    <div className="author_name">
                                        {author?.name}
                                    </div>
                                    <div className="author_description">
                                        {author?.description}
                                    </div>
                                </div>
                                <div className="author_img">
                                    <Avatar className='avatar_img' src={author?.img_url} />
                                </div>

                            </div>

                        </div>

                        <div className="description_and_review">
                            <div className="tab_list">
                                <div className="tab_select" aria-selected="true"> Mô tả</div>
                                <div className="tab_select" aria-selected="false">Đánh giá</div>
                            </div>
                            <div className="tab_panel_content">
                                <div className="description_tab_panel">
                                    {productSingle?.description}
                                </div>

                                <div className="reviews_tab_panel">
                                    <div className="reviews_quantity">{updatedReview?.length} đánh giá cho '{productSingle?.title}'</div>
                                    {updatedReview?.map((review, index) => (
                                        <div className="item_review" key={index}>
                                            <Avatar
                                                className='review_avatar'
                                                variant="square" src={review?.avt_url}
                                                sx={{ fontSize: '3rem' }}
                                            >
                                                {review.avt_url ? <></> : (review.fullname && review.fullname.charAt(0).toUpperCase())}
                                            </Avatar>
                                            <div className="review_detail">
                                                <div className="review_name">{review?.fullname}</div>
                                                <div className="review_content">{review?.review}</div>
                                                <div className="review_rating">
                                                    <Rating name="read-only" value={parseInt(review?.rating)} size='large' readOnly />
                                                </div>

                                            </div>

                                            {user?.role === 'admin' ?
                                                <div className='admin-edit' >
                                                    {user?.id === review?.user_id ?
                                                        <EditFilled className='edit' onClick={() => {setSelectedReview(review.id);fetchReviewId(review.id)}} /> : <></>}
                                                    <DeleteFilled className='delete' onClick={() => { setSelectedDelete(review.id); setModal4Open(true) }} />
                                                </div>
                                                : <></>}
                                            {user?.role === 'user' && user?.id === review?.user_id ?
                                                <div className='admin-edit' >
                                                    <EditFilled className='edit' onClick={() => {setSelectedReview(review.id);fetchReviewId(review.id)}} />
                                                </div>
                                                : <></>}

                                        </div>
                                    ))}
                                    <Modal
                                        centered

                                        open={modal4Open}
                                        onOk={() => handleDeleteReview(selectedDelete)}
                                        onCancel={() => setModal4Open(false)}
                                    >
                                        <h1><WarningFilled style={{ color: 'red' }} /> Cảnh báo </h1>
                                        <h2>Bạn có chắc chắn muốn xóa đánh giá này không?</h2>
                                    </Modal>
                                    <Modal
                                        centered
                                        open={modal3Open}
                                        onOk={() => handleEditReview(selectedReview)}
                                        onCancel={() => setModal3Open(false)}
                                    >
                                        <h1>Chỉnh sửa đánh giá</h1>
                                        <Form className='form_content'>
                                            <div className="form_input_row">
                                                <div className='label'>Đánh giá của bạn *</div>
                                                <Rating
                                                    className='rating'
                                                    name="rating"
                                                    value={parseInt(reviewId?.rating)}
                                                    onChange={(e) =>
                                                        setReviewId(prevState => ({ ...prevState, rating: e.target.value }))}
                                                    size='large'
                                                />
                                            </div>
                                            <div className="form_input_row">
                                                <div className='label'>Viết đánh giá *</div>
                                                <textarea
                                                    name="review"
                                                    id=""
                                                    cols="30"
                                                    rows="5"
                                                    value={reviewId?.review}
                                                    placeholder='Please write your thoughts...'
                                                    onChange={(e) =>
                                                        setReviewId(prevState => ({ ...prevState, review: e.target.value }))}
                                                >
                                                </textarea>
                                            </div>
                                        </Form>
                                    </Modal>

                                    <div className="review_add_form">
                                        {updatedReview?.some(item => item.user_id === user?.id) ?
                                            <div className="thanks-for-review">
                                                <CheckCircleFilled style={{ color: '#22d122' }} /> Cảm ơn đã đánh giá !
                                            </div>
                                            :
                                            <>
                                                <div className="form_title">
                                                    <span>Xem thêm đánh giá</span>
                                                    {user ? <>Bạn chỉ được phép đánh giá một lần, vì vậy hãy cân nhắc kỹ lưỡng !</> : <>Vui lòng đăng nhập trước khi xem xét *</>}
                                                </div>
                                                <Form className='form_content'>
                                                    <div className="form_input_row">
                                                        <div className='label'>Đánh giá của bạn *</div>
                                                        <Rating
                                                            className='rating'
                                                            name="rating"
                                                            value={valueRating}
                                                            onChange={(e) => {
                                                                setvalueRating(parseInt(e.target.value));
                                                            }}
                                                            size='large'
                                                        />
                                                    </div>
                                                    <div className="form_input_row">
                                                        <div className='label'>Viết đánh giá *</div>
                                                        <textarea
                                                            name="review"
                                                            id=""
                                                            cols="30"
                                                            rows="5"
                                                            placeholder='Please write your thoughts...'
                                                            onChange={(e) => {
                                                                setvalueReview(e.target.value);
                                                            }}
                                                        >
                                                        </textarea>
                                                    </div>
                                                    <div className="form_input_row">
                                                        <div className=""></div>
                                                        <button className='submit_review' onClick={onSubmitReview}>Gửi</button>
                                                    </div>
                                                </Form>
                                            </>
                                        }
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailsProduct;