<?php
// 1. Bật hiển thị tất cả lỗi lên màn hình
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>🔍 Bắt đầu kiểm tra lỗi...</h1>";

// 2. Kiểm tra file Database
echo "<h3>1. Kiểm tra Database...</h3>";
$dbFile = __DIR__ . '/database.php';
if (file_exists($dbFile)) {
    require_once $dbFile;
    echo "✅ File database.php tồn tại.<br>";
    
    try {
        $db = new Database();
        $conn = $db->connect();
        if ($conn) {
            echo "✅ Kết nối MySQL thành công! (Host: 127.0.0.1:8889)<br>";
        } else {
            echo "❌ Kết nối thất bại (Conn null).<br>";
        }
    } catch (Throwable $e) {
        echo "❌ Lỗi khi kết nối Database: " . $e->getMessage() . "<br>";
    }
} else {
    echo "❌ Không tìm thấy file database.php!<br>";
}

// 3. Kiểm tra file UserModel
echo "<h3>2. Kiểm tra Model User...</h3>";
$userModelFile = __DIR__ . '/model/UserModel.php';
if (file_exists($userModelFile)) {
    echo "✅ File UserModel.php tồn tại.<br>";
    require_once $userModelFile;
    
    try {
        $userModel = new UserModel();
        echo "✅ Khởi tạo UserModel thành công.<br>";
        
        // Thử query thật vào bảng USER xem có lỗi cú pháp SQL không
        echo "➡️ Đang thử lấy danh sách User...<br>";
        $users = $userModel->read([], [], ['id', 'username']);
        
        if (is_array($users)) {
            echo "✅ Query bảng `USER` thành công! Tìm thấy " . count($users) . " users.<br>";
            echo "<pre>";
            print_r($users);
            echo "</pre>";
        } else {
            echo "⚠️ Query chạy được nhưng trả về null (Có thể chưa có user nào).<br>";
        }
        
    } catch (Throwable $e) {
        echo "❌ <b>LỖI CHẾT (FATAL ERROR) TRONG USERMODEL:</b><br>";
        echo "<span style='color:red'>" . $e->getMessage() . "</span><br>";
        echo "Tại file: " . $e->getFile() . " dòng " . $e->getLine();
    }
} else {
    echo "❌ Không tìm thấy file model/UserModel.php!<br>";
}

echo "<h3>🏁 Kết thúc kiểm tra.</h3>";
?>