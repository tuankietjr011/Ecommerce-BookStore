<?php
class Database {
    // 1. MAMP thích dùng IP này hơn là 'localhost' để tránh lỗi kết nối
    private $host = '127.0.0.1'; 
    
    private $user = 'root';
    
    // 2. QUAN TRỌNG: MAMP bắt buộc mật khẩu là 'root'
    private $password = 'root'; 
    
    // 3. Tên database phải khớp với phpMyAdmin (lúc nãy bạn tạo là bookstore_db)
    private $database = 'bookstore_db'; 
    
    // 4. Cổng mặc định của MAMP MySQL
    private $port = 8889; 

    public function connect() {
        // 5. Thêm tham số $this->port vào cuối hàm kết nối
        $connection = new mysqli($this->host, $this->user, $this->password, $this->database, $this->port);

        if ($connection->connect_error) {
            // In ra lỗi chi tiết nếu không kết nối được
            die('Connection failed: ' . $connection->connect_error);
        }

        // 6. Thêm dòng này để không bị lỗi font tiếng Việt
        $connection->set_charset("utf8mb4");

        return $connection;
    }
}
?>