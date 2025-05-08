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
import { fetchProducts } from "../redux/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductFilterPage = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.product);

  const params = queryString.parse(location.search);

  console.log(items);

  const keyword = localStorage.getItem("keyword");

  const queryParams = useMemo(() => {
    return {
      ...params,
      page: Number.parseInt(params.page) || 1,
      limit: 20,
      sort: params.sort || "promotion",
      promotion_gte: params.promotion_gte || 0,
      promotion_lte: params.promotion_lte || 100000000,
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
      fetchProducts({
        page: queryParams.page - 1, // Chuyển đổi từ page UI (bắt đầu từ 1) sang page API (bắt đầu từ 0)
        limit: queryParams.limit,
        sort: queryParams.sort,
        promotion_gte: queryParams.promotion_gte || undefined,
        promotion_lte: queryParams.promotion_lte || undefined,
        ram: params.ram || undefined,
        keyword: keyword || undefined
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
  const products = items.dataSource || [];
  const totalItems = items.totalElements || 0;
  const totalPages = items.totalPages || 0;

  const handlePageClick = (values) => {
    setPage(values);
    const filters = {
      ...queryParams,
      page: values,
    };
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
    if (values.promotion_gte !== undefined && values.promotion_lte !== undefined) {
      const filters = { 
        ...queryParams, 
        promotion_gte: values.promotion_gte,
        promotion_lte: values.promotion_lte,
        page: 1 
      };
      setPage(1);
      navigate({
        pathname: "/product",
        search: queryString.stringify(filters),
      });
    }
  };  

  const initFilter = {
    // brand: params?.brand?.split(",") || [],
    // color: params?.color?.split(",") || [],
    ram: params?.ram?.split(",") || [],
    // demand: params?.demand?.split(",") || [],
  };

  const [filter, setFilter] = useState(initFilter);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      switch (type) {
        // case "Brands":
        //   setFilter({
        //     ...filter,
        //     brand: [...filter.brand, item.id],
        //   });
        //   break;
        // case "Colors":
        //   setFilter({
        //     ...filter,
        //     color: [...filter.color, item.name],
        //   });
        //   break;
        case "Rams":
          // Kiểm tra xem item.name đã tồn tại trong filter.ram chưa
          if (!filter.ram.includes(item.name)) {
            setFilter({
              ...filter,
              ram: [...filter.ram, item.name],
            });
          }
          break;
        // case "Demands":
        //   setFilter({
        //     ...filter,
        //     demand: [...filter.demand, item.value],
        //   });
        //   break;
        default:
      }
    } else {
      switch (type) {
        // case "Brands":
        //   const newBrands = filter.brand.filter((e) => e !== item.id);
        //   setFilter({ ...filter, brand: newBrands });
        //   break;
        // case "Colors":
        //   const newColors = filter.color.filter((e) => e !== item.name);
        //   setFilter({ ...filter, color: newColors });
        //   break;
        case "Rams":
          const newRams = filter.ram.filter((e) => e !== item.name);
          setFilter({ ...filter, ram: newRams });
          break;
        // case "Demands":
        //   const newDemands = filter.demand.filter((e) => e !== item.value);
        //   setFilter({ ...filter, demand: newDemands });
        //   break;
        default:
      }
    }
  };

  useEffect(() => {
    // Chỉ cập nhật URL khi filter thay đổi
    const hasRamFilter = filter.ram.length !== 0;
    
    // Tạo đối tượng filters mới
    let filters = { ...queryParams };
    
    // Chỉ thêm ram vào filters nếu có giá trị
    if (hasRamFilter) {
      filters = {
        ...filters,
        ram: filter.ram,
        page: 1,
      };
      setPage(1);
    } else {
      // Nếu không có ram filter, xóa ram khỏi URL
      delete filters.ram;
    }
    
    // Cập nhật URL
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters, {
        arrayFormat: 'comma'
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
              <div className="flex flex-col m-4">
                {/* <Accordion title="Thương hiệu">
                  <Filter
                    data={items.TenLoaiSP}
                    type="Brands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion> */}
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
                <div className="flex items-center p-5 gap-x-5 ">
                  <span className="font-medium text-base ">
                    Sắp xếp theo
                  </span>
                  <FilterSort onChange={handleClickSort} />
                </div>
              
                {status === 'loading' && (
                  <div className="flex justify-center items-center p-10">
                    <p>Đang tải sản phẩm...</p>
                  </div>
                )}
                
                {status === 'failed' && (
                  <div className="flex justify-center items-center p-10">
                    <p>Có lỗi xảy ra khi tải sản phẩm</p>
                  </div>
                )}
                
                {status === 'succeeded' && products.length === 0 && (
                  <div className="flex justify-center items-center p-10">
                    <p>Không tìm thấy sản phẩm phù hợp</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
