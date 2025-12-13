import './SearchForm.scss'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';

function SearchForm() {
    const [inputData, setInputData] = useState(""); 
    const navigate = useNavigate(); 

    
    const handleSearch = () => {
        
        if (inputData.trim() !== "") {
            navigate(`/search/${inputData}`);
        }
    }

    return (
        <>
            <div className='search-form'>
                <input
                    className="search__input"
                    type="text"
                    placeholder="Tìm kiếm sách, tác giả..."
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
                
                <div 
                    className='btn' 
                    onClick={handleSearch} 
                    style={{cursor: 'pointer'}} 
                >
                    <SearchOutlined />
                    <p>Search</p> 
                </div>
            </div>
        </>
    );
}

export default SearchForm;