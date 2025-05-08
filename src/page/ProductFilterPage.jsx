import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { fetchSearch } from "../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductFilterPage = () => {
  const dispatch = useDispatch();
  const { searchResults, searchStatus } = useSelector((state) => state.product);

  const params = queryString.parse(location.search);
  console.log(params);

  const keyword = localStorage.getItem("keyword");

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
  const [totalPageFilter, setTotalPageFilter] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial products with query params
    dispatch(
      fetchSearch({
        page: queryParams.page, // page bắt đầu từ 1
        limit: queryParams.limit,
        TenSP: keyword || undefined,
        min_price: queryParams.min_price,
        max_price: queryParams.max_price,
        RAM: queryParams.RAM,
      })
    );
  }, [dispatch, location.search, queryParams]);

  // Không cần filterProducts nữa vì API đã xử lý lọc và phân trang
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.search]);

  // Sử dụng dữ liệu từ Redux store
  const products = searchResults?.dataSource || [];
  const totalItems = searchResults?.totalElements || 0;
  const totalPages = Math.ceil(totalItems / queryParams.limit); // Sửa lại công thức tính số trang

  const handlePageClick = (values) => {
    setPage(values);
    const filters = {
      ...queryParams,
      page: values,
    };
    dispatch(
      fetchSearch({
        ...filters,
        page: values, // page bắt đầu từ 1
        TenSP: keyword || "",
        min_price: filters.min_price,
        max_price: filters.max_price,
        RAM: filters.RAM,
      })
    );
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters),
    });
  };

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
        default:
      }
    } else {
      switch (type) {
        case "Rams":
          const newRams = filter.RAM.filter((e) => e !== item.name);
          setFilter({ ...filter, RAM: newRams });
          break;
        default:
      }
    }
  };

  useEffect(() => {
    // Chỉ cập nhật URL khi filter thay đổi
    const hasRamFilter = filter.RAM.length !== 0;
    let filters = { ...queryParams };
    if (hasRamFilter) {
      filters = {
        ...filters,
        RAM: filter.RAM.join(","),
        page: 1,
      };
      setPage(1);
    } else {
      delete filters.RAM;
    }
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters, {
        arrayFormat: "comma",
      }),
    });
  }, [filter, navigate]);

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
              {/* <div className="flex flex-col m-4">
                <Accordion title="Thương hiệu">
                  <Filter
                    data={brandData}
                    type="Brands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div> */}
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
                <div className="flex items-center p-5 gap-x-5 ">
                  <span className="font-medium text-base ">Sắp xếp theo</span>
                  <FilterSort onChange={handleClickSort} />
                </div>

                {searchStatus === "loading" && (
                  <div className="flex justify-center items-center p-10">
                    <p>Đang tải sản phẩm...</p>
                  </div>
                )}

                {searchStatus === "failed" && (
                  <div className="flex justify-center items-center p-10">
                    <p>Có lỗi xảy ra khi tải sản phẩm</p>
                  </div>
                )}

                {searchStatus === "succeeded" && products.length === 0 && (
                  <div className="flex justify-center items-center p-10">
                    <p>Không tìm thấy sản phẩm phù hợp</p>
                  </div>
                )}

                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  style={{ minHeight: "700px" }}
                >
                  {products.map((item) => (
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
