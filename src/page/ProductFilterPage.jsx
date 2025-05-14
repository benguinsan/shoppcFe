import React, { useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FilterProduct from "../module/filter/FilterProduct";
import { useEffect } from "react";
import { useState } from "react";
import Pagination from "react-js-pagination";
import FilterSort from "../module/filter/FilterSort";
import queryString from "query-string";
import FilterPrice from "../module/filter/FilterPrice";
import { colorData } from "../api/colorData";
import Accordion from "../components/accordion/Accordion";
import Filter from "../components/filter/Filter";
import { ramData } from "../api/ramData";
// import { demandData } from "../api/demandData";
// import { productData, brandData } from "../data/productData";
import productApi from "../api/productApi";
import brandApi from "../api/Brandapi";
import { useDispatch, useSelector } from "react-redux";

const ProductFilterPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = queryString.parse(location.search);

  console.log(items);

  // Extract keyword from URL params
  const keyword = params.keyword || "";
  console.log("Keyword từ URL:", keyword);

  const queryParams = useMemo(() => {
    return {
      ...params,
      page: Number.parseInt(params.page) || 1,
      limit: 8,
      min_price: params.min_price || 0,
      max_price: params.max_price || 50000,
      RAM: params.RAM || "",
    };
  }, [location.search]);

  const [page, setPage] = useState(queryParams.page);
  const [sort, setSort] = useState(queryParams.sort);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [brandData, setBrandData] = useState([]);
  const navigate = useNavigate();

  // Access search results from Redux store
  const { items: products = [], status: searchStatus } = useSelector(
    (state) => state.products || {}
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Lấy dữ liệu thương hiệu
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const result = await brandApi.getBrand();
        console.log("Dữ liệu thương hiệu:", result);

        // Chuyển đổi định dạng data từ API thành định dạng phù hợp với Filter component
        if (result && result.data) {
          const formattedBrands = result.data.map((brand) => ({
            id: brand.MaLoaiSP,
            name: brand.TenLoaiSP,
            count: 0, // Có thể cập nhật số lượng sản phẩm nếu API cung cấp
          }));

          setBrandData(formattedBrands);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thương hiệu:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    // Fetch initial products with query params
    const fetchProducts = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        // Chuẩn hóa keyword - đảm bảo là "Laptop" thay vì "laptop" nếu cần
        const searchKeyword = keyword ? keyword.trim() : undefined;
        console.log("Keyword sẽ sử dụng để tìm kiếm:", searchKeyword);

        // Chuyển đổi giá trị min_price và max_price thành số
        const min_price = queryParams.min_price
          ? parseInt(queryParams.min_price)
          : 0;
        const max_price = queryParams.max_price
          ? parseInt(queryParams.max_price)
          : 50000;

        // RAM từ URL đã có định dạng GB từ ramData
        const ramValue = queryParams.RAM;

        const apiParams = {
          page: queryParams.page - 1, // API bắt đầu từ page=0 nhưng UI hiển thị từ page=1
          limit: queryParams.limit || 20, // Đảm bảo trùng với Postman
          TenSP: searchKeyword,
          min_price: min_price,
          max_price: max_price,
          RAM: ramValue, // RAM đã có định dạng GB
          MaLoaiSP: queryParams.MaLoaiSP, // Đúng tên là MaLoaiSP (không phải MaLSP)
        };

        console.log("Tham số gửi đến API từ ProductFilterPage:", apiParams);
        console.log("MaLoaiSP:", apiParams.MaLoaiSP);
        console.log("RAM:", apiParams.RAM);
        console.log(
          "min_price:",
          apiParams.min_price,
          "- Kiểu:",
          typeof apiParams.min_price
        );
        console.log(
          "max_price:",
          apiParams.max_price,
          "- Kiểu:",
          typeof apiParams.max_price
        );

        const result = await productApi.getSanPhamFilter(apiParams);

        console.log("Kết quả trả về:", result);

        if (result && result.dataSource) {
          console.log("Số lượng sản phẩm nhận được:", result.dataSource.length);
          // Cấu trúc response API: { dataSource: [...], pageNo, pageSize, totalElements }
          setFilteredProducts(result.dataSource || []);
          // Tính totalPages dựa vào totalElements và pageSize
          const calculatedTotalPages = Math.ceil(
            (result.totalElements || 0) / (result.pageSize || 1)
          );
          setTotalPages(calculatedTotalPages);
          setTotalItems(result.totalElements || 0);
        } else {
          setFilteredProducts([]);
          setTotalPages(0);
          setTotalItems(0);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        setIsError(true);
        setIsLoading(false);
        setFilteredProducts([]);
        setTotalPages(0);
        setTotalItems(0);
      }
    };

    fetchProducts();
  }, [location.search, queryParams, keyword]);

  // Không cần filterProducts nữa vì API đã xử lý lọc và phân trang
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.search]);

  const handleClickSort = (values) => {
    setSort(values);
    setPage(1);
    const filters = {
      ...queryParams,
      sort: values,
      page: 1,
    };
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters),
    });
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    const filters = {
      ...queryParams,
      page: pageNumber,
    };
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters),
    });
  };

  const handleChangePrice = (values) => {
    // Kiểm tra giá trị hợp lệ trước khi cập nhật
    if (values.min_price !== undefined && values.max_price !== undefined) {
      const filters = {
        ...queryParams,
        min_price: values.min_price,
        max_price: values.max_price,
        page: 1,
      };
      setPage(1);
      navigate({
        pathname: "/product",
        search: queryString.stringify(filters),
      });
    }
  };  

  const initFilter = {
    RAM: params?.RAM?.split(",") || [],
    MaLoaiSP: params?.MaLoaiSP?.split(",") || [],
  };

  const [filter, setFilter] = useState(initFilter);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      switch (type) {
        case "Rams":
          if (!filter.RAM.includes(item.name)) {
            setFilter({
              ...filter,
              RAM: [...filter.RAM, item.name],
            });
          }
          break;
        case "Brands":
          if (!filter.MaLoaiSP.includes(item.id)) {
            setFilter({
              ...filter,
              MaLoaiSP: [...filter.MaLoaiSP, item.id],
            });
          }
          break;
        default:
      }
    } else {
      switch (type) {
        case "Rams":
          const newRams = filter.RAM.filter((e) => e !== item.name);
          setFilter({ ...filter, RAM: newRams });
          break;
        case "Brands":
          const newBrands = filter.MaLoaiSP.filter((e) => e !== item.id);
          setFilter({ ...filter, MaLoaiSP: newBrands });
          break;
        default:
      }
    }
  };

  useEffect(() => {
    // Chỉ cập nhật URL khi filter thay đổi
    const hasRamFilter = filter.RAM.length !== 0;
    const hasBrandFilter = filter.MaLoaiSP.length !== 0;
    let filters = { ...queryParams };

    if (hasRamFilter) {
      filters = {
        ...filters,
        RAM: filter.RAM.join(","),
      };
    } else {
      delete filters.RAM;
    }

    if (hasBrandFilter) {
      filters = {
        ...filters,
        MaLoaiSP: filter.MaLoaiSP.join(","),
      };
    } else {
      delete filters.MaLoaiSP;
    }

    // Nếu có thay đổi filter, reset về trang 1
    if (hasRamFilter || hasBrandFilter) {
      filters.page = 1;
      setPage(1);
    }

    navigate({
      pathname: "/product",
      search: queryString.stringify(filters, {
        arrayFormat: "comma",
      }),
    });
  }, [filter, navigate]);

  // Hiển thị sản phẩm từ state local thay vì từ Redux
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : [];

  return (
    <>
      <div className="mt-10">
        <div className="container">
          {" "}
          <div className="flex items-center">
            <Link
              to="/"
              className=" text-base text-[#a8b4c9] flex items-center font-medium"
            >
              Trang chủ
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 mx-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
            <span className="text-base text-[#a8b4c9] font-medium">
              Laptop chính hãng
            </span>
          </div>
          <div className="wrapper-product">
            <div className="product-filter w-full  bg-white rounded-lg flex flex-col items-start">
              <FilterPrice
                handleChangePrice={handleChangePrice}
                queryParams={queryParams}
              />
              <div className="flex flex-col m-4">
                <Accordion title="Thương hiệu">
                  <Filter
                    data={items.TenLoaiSP}
                    type="Brands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div>
              {/* <div className="flex flex-col m-4">
                <Accordion title="Màu sắc">
                  <Filter
                    data={colorData}
                    type="Colors"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div> */}
              <div className="flex flex-col m-4">
                <Accordion title="RAM">
                  <Filter
                    data={ramData}
                    type="Rams"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div>
              {/* <div className="flex flex-col m-4">
                <Accordion title="Nhu cầu">
                  <Filter
                    data={demandData}
                    type="Demands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div> */}
            </div>

            {/* product list */}
            <div className="product-list">
              <div className="flex flex-col container rounded-lg bg-white ">
                {isLoading && (
                  <div className="flex justify-center items-center p-10">
                    <p>Đang tải sản phẩm...</p>
                  </div>
                )}

                {isError && (
                  <div className="flex justify-center items-center p-10">
                    <p>Có lỗi xảy ra khi tải sản phẩm</p>
                  </div>
                )}

                {!isLoading && !isError && displayProducts.length === 0 && (
                  <div className="flex justify-center items-center p-10">
                    <p>Không tìm thấy sản phẩm phù hợp</p>
                  </div>
                )}

                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  style={{ minHeight: "700px" }}
                >
                  {displayProducts.map((item) => (
                    <FilterProduct key={item.MaSP} data={item} />
                  ))}
                </div>
              </div>
              {totalPages > 0 && (
                <div className="flex items-center justify-center mt-10">
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={queryParams.limit}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={5}
                    onChange={handlePageClick}
                    nextPageText={">"}
                    prevPageText={"<"}
                    firstPageText={"<<"}
                    lastPageText={">>"}
                    innerClass="flex items-center gap-x-2"
                    itemClass="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 cursor-pointer"
                    linkClass="w-full h-full flex items-center justify-center"
                    activeClass="bg-[#0070f3] text-white"
                    activeLinkClass="text-white font-medium"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilterPage;
