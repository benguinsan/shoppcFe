import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import paymentApi from "../api/paymentApi";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const createOrder = async () => {
      try {
        // Lấy thông tin user và cart từ localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (!user || !cart.length) {
          setMessage("Không đủ thông tin để tạo hóa đơn!");
          setLoading(false);
          return;
        }
        
        // Tính tổng tiền
        const tongTien = cart.reduce((sum, item) => {
          const itemPrice = item.product.promotion || item.product.price;
          const quantity = item.quantity || 1;
          console.log(`Sản phẩm: ${item.product.TenSP || item.product.name}, Đơn giá: ${itemPrice}, Số lượng: ${quantity}, Thành tiền: ${itemPrice * quantity}`);
          return sum + (itemPrice * quantity);
        }, 0);
        
        console.log("Tổng tiền đơn hàng:", tongTien);
        
        // Tạo hóa đơn - KHÔNG gửi TongTien để server tự tính
        const orderData = {
          MaNguoiDung: user.nguoiDung?.MaNguoiDung || user.MaNguoiDung,
          MaNhanVien: "ND67f7ba8fe415b", // Có thể lấy động nếu có
          NgayLap: new Date().toISOString().slice(0, 19).replace("T", " "),
          // Không gửi TongTien, để server tự tính từ các chi tiết
          TrangThai: 1,
        };
        
        const dataOrder = await paymentApi.createOrder(orderData);
        console.log("Kết quả tạo hóa đơn:", dataOrder);
        
        if (dataOrder.status !== "success") {
          setMessage("Tạo hóa đơn thất bại: " + (dataOrder.message || ''));
          setLoading(false);
          return;
        }
        
        const MaHD = dataOrder.data.MaHD;
        console.log("Mã hóa đơn đã tạo:", MaHD);
        
        // Tạo chi tiết hóa đơn cho từng sản phẩm
        for (const item of cart) {
          const maSP = item.product.id || item.product.MaSP || item.product._id;
          // Chỉ gửi đơn giá gốc, không nhân với số lượng
          const donGia = item.product.promotion || item.product.price;
          const soLuong = item.quantity || 1;
          
          if (!maSP) {
            console.error("Không tìm thấy MaSP cho sản phẩm:", item.product);
            continue;
          }
          
          const orderDetailData = {
            MaHD: MaHD,
            MaSP: maSP,
            DonGia: donGia,
            SoLuong: soLuong
          };
          
          console.log("Body gửi tới chitiethoadon:", orderDetailData);
          
          const dataDetail = await paymentApi.createOrderDetail(orderDetailData);
          console.log("Kết quả tạo chi tiết hóa đơn:", dataDetail);
          
          if (dataDetail.status !== "success") {
            console.error("Lỗi tạo chi tiết hóa đơn:", dataDetail);
            setMessage("Tạo chi tiết hóa đơn thất bại: " + (dataDetail.message || ''));
            setLoading(false);
            return;
          }
        }
        
        // Cập nhật lại tổng tiền chính xác nếu cần
        try {
          const totalData = { TongTien: tongTien };
          const dataUpdateTotal = await paymentApi.updateOrderTotal(MaHD, totalData);
          console.log("Kết quả cập nhật tổng tiền:", dataUpdateTotal);
        } catch (error) {
          console.log("Không thể cập nhật lại tổng tiền:", error);
          // Tiếp tục xử lý ngay cả khi không cập nhật được tổng tiền
        }
        
        setSuccess(true);
        setMessage("Giao dịch thành công! Đơn hàng của bạn đã được ghi nhận.");
        setLoading(false);
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Lỗi tạo hóa đơn:", error);
        setMessage("Có lỗi xảy ra khi tạo hóa đơn: " + (error.message || ''));
        setLoading(false);
      }
    };
    createOrder();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {loading ? (
        <div className="text-xl font-medium">Đang xử lý giao dịch...</div>
      ) : (
        <>
          <div className={`text-2xl font-bold mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
          <button
            className="bg-blue-700 text-white rounded-lg px-6 py-2 mt-4"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccessPage; 