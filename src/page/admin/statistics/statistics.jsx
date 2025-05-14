import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Statistic,
  Spin,
} from "antd";
import { Column } from "@ant-design/plots"; // Giữ lại biểu đồ cột
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"; // Thêm Recharts
import dayjs from "dayjs";

const BASE_URL = "http://localhost/shoppc/api";

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("day");
  const [dateValue, setDateValue] = useState(dayjs());
  const [statisticType, setStatisticType] = useState("revenue");
  const [statData, setStatData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gọi API thống kê
  const fetchStatistics = async () => {
    setLoading(true);
    let value = "";
    if (timeRange === "day") value = dateValue.format("YYYY-MM-DD");
    else if (timeRange === "month") value = dateValue.format("YYYY-MM");
    else value = dateValue.format("YYYY");

    // Thống kê tổng hợp
    let url = "";
    if (timeRange === "day") url = `${BASE_URL}/thongke/ngay?value=${value}`;
    else if (timeRange === "month")
      url = `${BASE_URL}/thongke/thang?value=${value}`;
    else url = `${BASE_URL}/thongke/nam?value=${value}`;

    const res = await fetch(url);
    if (!res.ok) {
      // Xử lý lỗi
      return [];
    }
    const data = await res.json();
    setStatData(data && data.length > 0 ? data : []);

    // Thống kê theo sản phẩm
    let urlProduct = `${BASE_URL}/thongke/sanpham?type=${timeRange}&value=${value}`;
    const res2 = await fetch(urlProduct);
    const data2 = await res2.json();
    setProductData(data2 && data2.length > 0 ? data2 : []);

    // Thống kê theo loại sản phẩm (Pie chart)
    let urlCategory = `${BASE_URL}/thongke/loaisanpham?type=${timeRange}&value=${value}`;
    const res3 = await fetch(urlCategory);
    const data3 = await res3.json();
    setCategoryData(data3 && data3.length > 0 ? data3 : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line
  }, [timeRange, dateValue, statisticType]);

  useEffect(() => {
    console.log("statData", statData);
  }, [statData]);

  // Tổng hợp số liệu cho Statistic
  const totalRevenue = statData.reduce(
    (sum, item) => sum + (item.DoanhThu || 0),
    0
  );
  const totalOrders = statData.reduce(
    (sum, item) => sum + (item.SoDonHang || 0),
    0
  );
  const totalSold = statData.reduce(
    (sum, item) => sum + (item.SoLuongBan || 0),
    0
  );

  // Dữ liệu cho biểu đồ thời gian
  const timeChartConfig = {
    data: statData.map((item) => ({
      ...item,
      value:
        statisticType === "revenue"
          ? item.DoanhThu
          : statisticType === "orders"
          ? item.SoDonHang
          : item.SoLuongBan,
      x:
        timeRange === "day"
          ? item.Ngay
          : timeRange === "month"
          ? item.Thang
          : item.Nam,
    })),
    xField: "x",
    yField: "value",
    point: { size: 5, shape: "diamond" },
    label: { style: { fill: "#aaa" } },
    minColumnWidth: statData.length === 1 ? 80 : undefined,
    maxColumnWidth: statData.length === 1 ? 80 : undefined,
    autoFit: statData.length === 1 ? false : true,
    width: statData.length === 1 ? 220 : undefined,
    height: 300,
  };

  // Dữ liệu cho Pie chart sản phẩm với Recharts
  let productPieData = productData
    .map((item) => ({
      name:
        item.TenSP ||
        item.title ||
        item.name ||
        item.productName ||
        "Sản phẩm không tên",
      value: Number(
        statisticType === "revenue"
          ? item.DoanhThu
          : statisticType === "orders"
          ? item.SoDonHang
          : item.SoLuongBan
      ),
    }))
    .filter((item) => item.value > 0);

  if (productPieData.length === 0) {
    productPieData = [
      { name: "Sản phẩm A", value: 100 },
      { name: "Sản phẩm B", value: 50 },
    ];
  }
  if (productPieData.length === 1) {
    productPieData.push({ name: "Ẩn", value: 0.00001 });
  }

  // Dữ liệu cho Pie chart loại sản phẩm với Recharts
  let categoryPieData = categoryData
    .map((item) => ({
      name:
        item.TenLoaiSP || item.categoryName || item.name || "Loại không tên",
      value: Number(
        statisticType === "revenue"
          ? item.DoanhThu
          : statisticType === "orders"
          ? item.SoDonHang
          : item.SoLuongBan
      ),
    }))
    .filter((item) => item.value > 0);

  if (categoryPieData.length === 0) {
    categoryPieData = [
      { name: "Loại A", value: 80 },
      { name: "Loại B", value: 120 },
    ];
  }
  if (categoryPieData.length === 1) {
    categoryPieData.push({ name: "Ẩn", value: 0.00001 });
  }

  // Màu sắc cho biểu đồ
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
  ];

  // Component hiển thị nhãn bên ngoài biểu đồ tròn
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
    value,
  }) => {
    if (name === "Ẩn") return null;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000000"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  // UI bộ lọc ngày/tháng/năm
  const getDatePicker = () => {
    if (timeRange === "day") {
      return (
        <DatePicker
          style={{ width: "100%" }}
          value={dateValue}
          onChange={setDateValue}
          format="YYYY-MM-DD"
        />
      );
    } else if (timeRange === "month") {
      return (
        <DatePicker
          picker="month"
          style={{ width: "100%" }}
          value={dateValue}
          onChange={setDateValue}
          format="YYYY-MM"
        />
      );
    } else {
      return (
        <DatePicker
          picker="year"
          style={{ width: "100%" }}
          value={dateValue}
          onChange={setDateValue}
          format="YYYY"
        />
      );
    }
  };

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Select
                    style={{ width: "100%" }}
                    value={timeRange}
                    onChange={setTimeRange}
                    options={[
                      { value: "day", label: "Theo ngày" },
                      { value: "month", label: "Theo tháng" },
                      { value: "year", label: "Theo năm" },
                    ]}
                  />
                </Col>
                <Col span={8}>{getDatePicker()}</Col>
                <Col span={8}>
                  <Select
                    style={{ width: "100%" }}
                    value={statisticType}
                    onChange={setStatisticType}
                    options={[
                      { value: "revenue", label: "Doanh thu" },
                      { value: "orders", label: "Đơn hàng" },
                      { value: "products", label: "Sản phẩm" },
                    ]}
                  />
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng doanh thu"
                  value={totalRevenue}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix="₫"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng đơn hàng"
                  value={totalOrders}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="đơn"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Tổng sản phẩm đã bán"
                  value={totalSold}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="sản phẩm"
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={12}>
          <Card title="Doanh thu theo sản phẩm">
            {loading ? (
              <Spin />
            ) : productPieData.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
                Không có dữ liệu
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={productPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${(
                        (value /
                          productPieData.reduce((a, b) => a + b.value, 0)) *
                        100
                      ).toFixed(1)}%)`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Doanh thu theo loại sản phẩm">
            {loading ? (
              <Spin />
            ) : categoryPieData.length === 0 ||
              categoryPieData.every((item) => !item.value) ? (
              <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
                Không có dữ liệu
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} (${(
                        (value /
                          categoryPieData.reduce((a, b) => a + b.value, 0)) *
                        100
                      ).toFixed(1)}%)`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
