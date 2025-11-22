<?php

require_once __DIR__ . '/../database.php';

class UserModel {
    private $connection;

    public function __construct() {
        $database = new Database();
        $this->connection = $database->connect();
        
        // Kiểm tra nếu kết nối thất bại thì dừng ngay để không lỗi 500
        if (!$this->connection) {
            die(json_encode(["status" => "error", "message" => "Database connection failed inside UserModel."]));
        }
    }

    public function __destruct() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    public function create($data , $allowedKeys = []) {
        if (!empty($allowedKeys)) {
            $data = array_intersect_key($data, array_flip($allowedKeys));
        }

        $keys = array_keys($data);
        $values = array_values($data);
        
        // SỬA LỖI: Thêm dấu huyền `USER`
        $query = "INSERT INTO `USER` (" . implode(", ", $keys) . ") VALUES ('" . implode("', '", $values) . "')";
        
        if ($this->connection->query($query)) {
            return true;
        } else {
            return false;
        }
    }

    public function read($queryParams , $allowedKeys = [] , $select = []) {
        if (!empty($allowedKeys)) {
            $queryParams = array_intersect_key($queryParams, array_flip($allowedKeys));
        }

        $selectClause = empty($select) ? '*' : implode(', ', $select);

        $conditions = [];
        foreach ($queryParams as $key => $value) {
            $safeValue = $this->connection->real_escape_string($value);
            $conditions[] = "$key='$safeValue'";
        }
        $whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
        
        // SỬA LỖI: Thêm dấu huyền `USER`
        $query = "SELECT $selectClause FROM `USER` $whereClause";
        
        $result = $this->connection->query($query);
        
        if ($result && $result->num_rows > 0) {
            $users = [];
            while ($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            return $users;
        } else {
            return []; // Trả về mảng rỗng an toàn
        }
    }

    public function update($id, $data, $allowedKeys = []) {
        if (!empty($allowedKeys)) {
            $data = array_intersect_key($data, array_flip($allowedKeys));
        }

        $updates = [];
        foreach ($data as $key => $value) {
            $safeValue = $this->connection->real_escape_string($value);
            $updates[] = "$key='$safeValue'";
        }
        
        // SỬA LỖI: Thêm dấu huyền `USER`
        $query = "UPDATE `USER` SET " . implode(", ", $updates) . " WHERE id='$id'";
        
        if ($this->connection->query($query)) {
            return true;
        } else {
            return false;
        }
    }

    public function delete($id) {
        // SỬA LỖI: Thêm dấu huyền `USER`
        $query = "DELETE FROM `USER` WHERE id='$id'";
        if ($this->connection->query($query)) {
            return true;
        } else {
            return false;
        }
    }

    // --- ĐÂY LÀ HÀM GÂY LỖI 500 LÚC NÃY ---
    public function checkCredential($username, $password) {
        $safeUsername = $this->connection->real_escape_string($username);
        
        // SỬA LỖI QUAN TRỌNG: Phải có dấu huyền ở `USER`
        $query = "SELECT * FROM `USER` WHERE username='$safeUsername'";
        
        $result = $this->connection->query($query);
        
        if ($result && $result->num_rows == 1) {
            $user = $result->fetch_assoc();
            return password_verify($password, $user['password']);
        } else {
            return false;
        }
    }
    
    public function setTokenExpiry($userId, $expiryTime = 5) {
        // SỬA LỖI: Thêm dấu huyền `USER`
        $query = "UPDATE `USER` SET token_expiry= DATE_ADD(NOW(), INTERVAL $expiryTime MINUTE) WHERE id='$userId'";
        if ($this->connection->query($query)) {
            return true;
        } else {
            return false;
        }
    }

}
?>