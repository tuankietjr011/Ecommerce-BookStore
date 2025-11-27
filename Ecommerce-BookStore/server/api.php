<?php
// --- BẮT BUỘC: BẬT HIỂN THỊ LỖI ---
ini_set('display_errors', 0); // Tắt hiển thị lỗi ra màn hình để tránh hỏng JSON
error_reporting(E_ERROR | E_PARSE);
// -----------------------------------------------------------

// --- CẤU HÌNH CORS ĐỘNG (CHO PHÉP CẢ 5173 VÀ 5174) ---
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    // Mặc định cho 5173 nếu không xác định được origin
    header('Access-Control-Allow-Origin: http://localhost:5173');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// -----------------------------------------------------------

$request = $_SERVER['REQUEST_URI'];

// --- XỬ LÝ ĐƯỜNG DẪN MAMP ---
$pos = strpos($request, '/api.php');
if ($pos !== false) {
    $request = substr($request, $pos);
}
// -----------------------------

$method = $_SERVER['REQUEST_METHOD'];

// Data from post method
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$userLevel = 0 ;
$payload = [] ;

if (isset($_COOKIE['jwt'])) {
    $jwt = $_COOKIE['jwt'] ;
    $parts = explode('.', $jwt);
    if(count($parts) === 3) {
        $header = json_decode(base64_decode($parts[0]), true);
        $payload = json_decode(base64_decode($parts[1]), true);
        $secret_key = 'x3AQwlq^2LS1%q0%vg3P';
        $signature = hash_hmac('sha256', "$parts[0].$parts[1]", $secret_key, true);
        $signature = base64_encode($signature);
        if($signature === $parts[2]){
            if ( isset($payload['role']) && $payload['role'] == 'user' ) { $userLevel = 1 ; }
            else if ( isset($payload['role']) && $payload['role'] == 'admin' ) { $userLevel = 2 ;}
        }
    }
    $payload['user_level'] = $userLevel;
} 

$routes = [
    // authentication
    'POST /api.php/auth/register' => 'AuthController@register@0',
    'POST /api.php/auth/registeradmin' => 'AuthController@registerAdmin@2',
    'POST /api.php/auth/login' => 'AuthController@login@0',
    'POST /api.php/auth/updatepassword' => 'AuthController@updatePassword@1',
    'GET /api.php/auth/logout' => 'AuthController@logout@0',

    // user
    'GET /api.php/user' => 'UserController@getUsers@1',
    'GET /api.php/user/(\d+)' => 'UserController@getSingleUser@1',
    'GET /api.php/user/showme' => 'UserController@showMe@1',
    'PATCH /api.php/user/(\d+)' => 'UserController@updateUser@1',
    'DELETE /api.php/user/(\d+)' => 'UserController@deleteUser@2',

    //blog
    'POST /api.php/blog' => 'BlogController@createBlog@2',
    'GET /api.php/blog' => 'BlogController@getBlogs@0',
    'GET /api.php/blog/(\d+)' => 'BlogController@getSingleBlog@0',
    'PATCH /api.php/blog/(\d+)' => 'BlogController@updateBlog@2',
    'DELETE /api.php/blog/(\d+)' => 'BlogController@deleteBlog@2',

    //book
    'POST /api.php/book' => 'BookController@createBook@2',
    'GET /api.php/book' => 'BookController@getBooks@0',
    'GET /api.php/book/(\d+)' => 'BookController@getSingleBook@0',
    'PATCH /api.php/book/(\d+)' => 'BookController@updateBook@2',
    'DELETE /api.php/book/(\d+)' => 'BookController@deleteBook@2',

    //likelist
    'GET /api.php/likelist' => 'LikelistController@getLikelists@2',
    'GET /api.php/likelist/my' => 'LikelistController@getMyLikelist@1',
    'GET /api.php/likelist/(\d+)' => 'LikelistController@likeBook@1',
    'DELETE /api.php/likelist/(\d+)' => 'LikelistController@unlikeBook@1',

    //author
    'POST /api.php/author' => 'AuthorController@createAuthor@2',
    'GET /api.php/author' => 'AuthorController@getAuthors@0',
    'GET /api.php/author/(\d+)' => 'AuthorController@getSingleAuthor@0',
    'PATCH /api.php/author/(\d+)' => 'AuthorController@updateAuthor@2',
    'DELETE /api.php/author/(\d+)' => 'AuthorController@deleteAuthor@2',

    //review
    'POST /api.php/review' => 'ReviewController@createReview@1',
    'GET /api.php/review' => 'ReviewController@getReviews@0',
    'GET /api.php/review/(\d+)' => 'ReviewController@getSingleReview@0',
    'PATCH /api.php/review/(\d+)' => 'ReviewController@updateReview@1',
    'DELETE /api.php/review/(\d+)' => 'ReviewController@deleteReview@1',

    //contact
    'POST /api.php/contact' => 'ContactController@createContact@0',
    'GET /api.php/contact' => 'ContactController@getContacts@2',
    'GET /api.php/contact/(\d+)' => 'ContactController@getSingleContact@2',
    'PATCH /api.php/contact/(\d+)' => 'ContactController@updateContact@2',
    'DELETE /api.php/contact/(\d+)' => 'ContactController@deleteContact@2',

    //cart
    'POST /api.php/cart' => 'CartController@addToCart@1',
    'GET /api.php/cart' => 'CartController@getCart@1',
    'PATCH /api.php/cart/(\d+)' => 'CartController@updateCart@1',
    'DELETE /api.php/cart/(\d+)' => 'CartController@removeFromCart@1',

    //category
    'POST /api.php/category/(\d+)' => 'CategoryController@addCategory@2',
    'GET /api.php/category/(\d+)' => 'CategoryController@getBookCategory@0',
    'DELETE /api.php/category/(\d+)' => 'CategoryController@deleteCategory@2',

    //order
    'POST /api.php/order' => 'OrderController@createOrder@0',
    'GET /api.php/order' => 'OrderController@getOrders@2',
    'GET /api.php/order/my' => 'OrderController@getMyOrders@1',
    'PATCH /api.php/order/(\d+)' => 'OrderController@updateOrder@2',

    //recovery password
    'POST /api.php/forgot-password' => 'AuthController@forgotPassword@0',
    'POST /api.php/reset-password' => 'AuthController@resetPassword@0'
];

foreach ($routes as $routePattern => $action) {
    list($routeMethod, $routePath) = explode(' ', $routePattern, 2);
    if ($routeMethod == $method && preg_match("#^{$routePath}(\?.*)?$#", $request, $matches)) {
        $actionInfo = explode('@', $action) ;
        $controllerName = $actionInfo[0];
        $methodName = $actionInfo[1];
        $routeUserLevel = intval($actionInfo[2]);
        $params = isset($matches[1]) ? $matches[1] : null; 

        if ($routeUserLevel <= $userLevel) {
            $controllerFile = __DIR__ . '/controller/' . $controllerName . '.php';
            if (file_exists($controllerFile)) {
                require $controllerFile;
                $controller = new $controllerName();
                $response = call_user_func_array([$controller, $methodName], [$params, $_GET, $data, $payload]);
                echo json_encode($response);
            } else {
                die("Lỗi: Không tìm thấy file controller: " . $controllerFile);
            }
        } else {
            http_response_code(401);
            echo json_encode(["status" => "unauthorized"]);
        }
        exit;
    }
}

http_response_code(404);
echo json_encode([
    "status" => "not found",
    "message" => "Route not found", 
    "debug_request" => $request
]);
?>