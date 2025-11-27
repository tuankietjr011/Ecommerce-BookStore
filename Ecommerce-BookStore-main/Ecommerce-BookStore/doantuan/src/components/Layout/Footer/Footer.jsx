import './Footer.scss'
import { PhoneFilled, MailFilled, FacebookFilled, InstagramOutlined, TwitterOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom';
import map from '../../imgs/map.png'


function Footer() {
    return (
        <footer>
            <div className="box-container">
                <div className="box box-tilte">
                    <div className='style-border-top'></div>
                    <div className='style-border-bottom'></div>
                    <h3 className='tilte'>Book<span className='color-orange highlight'>S</span></h3>
                    <p>"Càng đọc nhiều, bạn càng biết nhiều điều. Càng học nhiều, bạn càng được đi nhiều nơi."</p>
                </div>
                <div className="box">
                    <h3>Liên hệ chúng tôi</h3>
                    <div className='box-contact'><PhoneFilled className='color-orange icons-g' /><p>Hotline: 1999-1010</p></div>
                    <div className='box-contact'><MailFilled className='color-orange icons-g' /><p>Mail: books@gmail.com</p></div>
                    <div className='icons-contact'>
                        <Link to=''><FacebookFilled className='icons-g' /></Link>
                        <Link to=''><InstagramOutlined className='icons-g' /></Link>
                        <Link to=''><TwitterOutlined className='icons-g' /></Link>
                    </div>

                </div>
                <div className="box box-img">
                    <h3>Giao hàng quốc tế</h3>
                    <img src={map} alt="" />
                </div>
                <div className="box box-links">
                    <h3>Liên kết nhanh</h3>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Trang chủ</Link></div>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Sản phẩm</Link></div>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Bài viết</Link></div>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Về chúng tôi</Link></div>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Liên hệ</Link></div>
                    <div className='link-items'><CaretRightOutlined className='color-orange' /><Link className='links' to=''>Thanh toán</Link></div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;