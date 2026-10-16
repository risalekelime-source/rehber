<?php
// Sadece POST isteklerini kabul et
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = file_get_contents('php://input');
    
    // Gelen veriyi kontrol et ve rehber.txt dosyasına yaz
    if ($inputData !== false) {
        // Güvenlik için veriyi satırlara ayırıp düzenleyebiliriz
        file_put_contents('rehber.txt', $inputData);
        echo json_encode(["status" => "success", "message" => "Başarıyla kaydedildi"]);
        exit;
    }
}
http_response_code(400);
echo json_encode(["status" => "error", "message" => "Geçersiz istek"]);
?>
