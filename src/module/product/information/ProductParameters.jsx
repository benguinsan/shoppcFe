import React from "react";

const ProductParameters = () => {
  return (
    <div className="product-parameters px-5">
      <div className="text-2xl font-semibold mb-8">Thông tin chi tiết</div>
      <table>
        <tr>
          <td>Thương hiệu</td>
          <td>Apple</td>
        </tr>
        <tr>
          <td>Bảo hành</td>
          <td>12</td>
        </tr>
        <tr>
          <td>Series laptop</td>
          <td>Macbook Air</td>
        </tr>
        <tr>
          <td>CPU</td>
          <td>Apple M1</td>
        </tr>
        <tr>
          <td>Chip đồ họa</td>
          <td>Onboard</td>
        </tr>
        <tr>
          <td>RAM</td>
          <td>8GB Onboard LPDDR4 3733MHz</td>
        </tr>
        <tr>
          <td>Màn hình</td>
          <td>13.3" ( 2560 x 1600 ) IPS không cảm ứng , HD webcam</td>
        </tr>
        <tr>
          <td>Lưu trữ</td>
          <td>512GB SSD </td>
        </tr>
        <tr>
          <td>Kết nối không dây</td>
          <td>WiFi 802.11ax (Wifi 6) , Bluetooth 5.0</td>
        </tr>
        <tr>
          <td>Hệ điều hành</td>
          <td>macOS</td>
        </tr>
        <tr>
          <td>Kích thước</td>
          <td>30.41 x 21.24 x 0.41–1.61 cm</td>
        </tr>
        <tr>
          <td>Pin</td>
          <td>Pin liền</td>
        </tr>
        <tr>
          <td>Khối lượng</td>
          <td>1.3 kg</td>
        </tr>
        <tr>
          <td>Bảo mật</td>
          <td>Vân tay</td>
        </tr>
      </table>
    </div>
  );
};

export default ProductParameters;
