<?php
// --- TẠM THỜI TẮT MAILER ĐỂ KHẮC PHỤC LỖI 500 ---
// Nguyên nhân: File mailer.php có thể bị lỗi thư viện trên MAMP
// if (file_exists(__DIR__ . '/../mailer.php')) {
//     require_once __DIR__ . '/../mailer.php';
// }
// -------------------------------------------------

require_once __DIR__ . '/../model/UserModel.php';

class AuthController {
    private $secret_key = 'x3AQwlq^2LS1%q0%vg3P';

    // Register
    public function register($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        
        if (!isset($postData['password']) || !isset($postData['email'])) {
             return ["status" => "error", "message" => "Missing data"];
        }

        $postData['password'] = password_hash($postData['password'], PASSWORD_DEFAULT);
        $email = $postData['email'];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["status" => "error", "message" => "Invalid email address."];
        }

        if ($user->create($postData, ['bday' , 'avt_url' , 'fullname' ,'email' , 'username' ,'password'])) {
            return ["status" => "success", "message" => "User registration completed successfully."];
        } else {
            return ["status" => "error", "message" => "Registration failed."];
        }
    }

    // Register Admin
    public function registerAdmin($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        $postData['role'] = 'admin';
        $postData['password'] = password_hash($postData['password'], PASSWORD_DEFAULT);

        if ($user->create($postData, ['bday' , 'avt_url' , 'fullname' ,'email' , 'role', 'username' ,'password'])) {
            return ["status" => "success", "message" => "User registration completed successfully."];
        } else {
            return ["status" => "error", "message" => "Registration failed."];
        }
    }

    // Login
    public function login($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        
        if (empty($postData) || !isset($postData['username']) || !isset($postData['password'])) {
             return ["status" => "error", "message" => "Missing username or password"];
        }

        $username = $postData['username'];
        $password = $postData['password'];
        
        if ($user->checkCredential($username, $password)) {
            $userRead = $user->read(['username' => $username], [], ['id', 'role', 'fullname','avt_url','email','bday']);
            
            if (empty($userRead)) {
                 return ["status" => "error", "message" => "User info not found."];
            }
            $userInfo = $userRead[0];

            $header = base64_encode(json_encode(["alg" => "HS256", "typ" => "JWT"]));
            $payload = base64_encode(json_encode([
                "id" => $userInfo['id'],
                "role" => $userInfo['role'],
                "fullname" => $userInfo['fullname'], 
                "avt_url" => $userInfo['avt_url'],
                "email" => $userInfo['email'],
                "bday" => $userInfo['bday'],
            ]));

            $signature = hash_hmac('sha256', "$header.$payload",$this->secret_key, true);
            $signature = base64_encode($signature);
            $token = "$header.$payload.$signature";

            // CẤU HÌNH COOKIE CHUẨN CHO MAMP
            setcookie('jwt', $token, [
                'expires' => time() + 60 * 60 * 24 * 7,
                'path' => '/', 
                'domain' => '', // Để rỗng
                'secure' => false, 
                'httponly' => true, 
                'samesite' => 'Lax', 
            ]);
            
            return array(
                "status" => "success",
                "message" => "User logged in successfully.",
                "id" => $userInfo['id'],
                "role" => $userInfo['role'],
                "fullname" => $userInfo['fullname'],
                "avt_url" => $userInfo['avt_url'],
                "email" => $userInfo['email'],
                "bday" => $userInfo['bday']
            );
        } else {
            return ["status" => "error", "message" => "Invalid username or password."];
        }
    }
    
    // Update Password
    public function updatePassword($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        $oldPassword = $postData['oldPassword'];
        $newPassword = $postData['newPassword'];

        $userInfo = $user->read(['id' => $fromUser['id']], [], ['id', 'password'])[0];
        if (!password_verify($oldPassword, $userInfo['password'])) {
            return ["status" => "error", "message" => "Incorrect old password."];
        }

        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $user->update($fromUser['id'], ['password' => $newPasswordHash]);

        return ["status" => "success", "message" => "Password updated successfully."];
    }

    // Forgot Password (Đã tắt gửi mail)
    public function forgotPassword($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        $email = $postData['email'];
    
        $userInfo = $user->read(['email' => $email], [], ['id', 'fullname'])[0];
        if (!$userInfo) {
            return ["status" => "error", "message" => "No user found."];
        }
    
        $token = bin2hex(random_bytes(32));
        $user->update($userInfo['id'], ['token' => $token]);
        $user->setTokenExpiry($userInfo['id']);

        // Chỉ trả về thông báo thành công giả, không gửi mail thực sự
        return ["status" => "success", "message" => "Reset link generated (Email disabled)."];
    }
    
    // Reset Password
    public function resetPassword($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        $user = new UserModel();
        $userInfo = $user->read($postData, ['token'], ['id', 'email', 'token_expiry'])[0];
        if (!$userInfo) {
            return ["status" => "error", "message" => "Invalid token."];
        }
        
        $password = $postData['new_password'];
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $user->update($userInfo['id'],['password' => $password_hash]);

        return ["status" => "success", "message" => "Password reset successfully."];
    }
    
    // Logout
    public function logout($idRoute = null, $queryParams = null, $postData = null, $fromUser = null) {
        unset($_COOKIE['jwt']);
        setcookie('jwt', '', time() - 3600, '/', '', false, true);
        return ["status" => "success", "message" => "User logged out successfully."];
    }
}
?>