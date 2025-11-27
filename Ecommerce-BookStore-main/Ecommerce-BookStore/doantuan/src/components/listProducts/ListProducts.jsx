import BookCard from "../book-card/BookCard";
import './ListProducts.scss'


function ListProducts({ products = [], title, liked }) { // FIX 1: Thêm default value = [] cho products

    const displayTitle = title ? <h1 className="list-title">{title}</h1> : <></>;

    const cardElements = products.map((card, index) => (
        <BookCard key={index} {...card} liked= {liked}  />
    ));
    
    const cardElementsSale = products.filter((card) => (card.onsale > 0)).map((card, index) => (
        <BookCard key={index} {...card} liked= {liked} />
    ));
    
    return (
        <div className="list">
            {displayTitle}
            
            {title === "Giảm giá" ?
                <div className="card-container">
                    {cardElementsSale}
                </div>
                :
                <div className="card-container">
                    {cardElements}
                </div>
            }

        </div>
    );
}

export default ListProducts;