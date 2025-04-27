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
import { demandData } from "../api/demandData";
import { productData, brandData } from "../data/productData";

const ProductFilterPage = () => {
  const params = queryString.parse(location.search);
  console.log(params);

  const keyword = localStorage.getItem("keyword");

  // console.log(productData);
  // console.log(brandData);
  // console.log(ramData);
  // console.log(demandData);

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    try {
      // Lọc sản phẩm dựa trên các tham số query
      filterProducts();

      console.log("fuk",filteredProducts);
    } catch (error) {
      console.log(error.message);
    }
  }, [location.search]);

  // Hàm lọc sản phẩm dựa trên các tham số query
  const filterProducts = () => {
    let filtered = [...productData];
    
    // Lọc theo từ khóa
    if (keyword) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    
    // Lọc theo thương hiệu
    if (params.brand) {
      const brands = params.brand.split(',');
      filtered = filtered.filter(product => 
        brands.includes(product.brand)       
      );
    }
    
    // Lọc theo màu sắc
    if (params.color) {
      const colors = params.color.split(',');
      filtered = filtered.filter(product => 
        colors.includes(product.color)
      );
    }
    
    // Lọc theo RAM
    if (params.ram) {
      const rams = params.ram.split(',');
      filtered = filtered.filter(product => 
        rams.includes(product.ram)
      );
    }
    
    // Lọc theo nhu cầu
    if (params.demand) {
      const demands = params.demand.split(',');
      filtered = filtered.filter(product => 
        demands.some(demand => product.demand.includes(demand))
      );
    }
    
    // Lọc theo giá
    if (params.promotion_gte && params.promotion_lte) {
      filtered = filtered.filter(product => 
        product.promotion >= Number(params.promotion_gte) && 
        product.promotion <= Number(params.promotion_lte)
      );
    }
    
    // Sắp xếp
    if (params.sort) {
      switch(params.sort) {
        case "promotion":
          filtered.sort((a, b) => a.promotion - b.promotion);
          break;
        case "promotion_desc":
          filtered.sort((a, b) => b.promotion - a.promotion);
          break;
        case "newest":
          // Giả sử id lớn hơn = mới hơn
          filtered.sort((a, b) => Number(b.id) - Number(a.id));
          break;
        default:
          filtered.sort((a, b) => a.promotion - b.promotion);
      }
    }
    
    // Phân trang
    const itemsPerPage = queryParams.limit;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    setTotalPageFilter(totalPages);
    
    const startIndex = (queryParams.page - 1) * itemsPerPage;
    const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    setFilteredProducts(paginatedProducts);
  };

  const initFilter = {
    brand: params?.brand?.split(",") || [],
    color: params?.color?.split(",") || [],
    ram: params?.ram?.split(",") || [],
    demand: params?.demand?.split(",") || [],
  };

  const [filter, setFilter] = useState(initFilter);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      switch (type) {
        case "Brands":
          setFilter({
            ...filter,
            brand: [...filter.brand, item.id],
          });
          break;
        case "Colors":
          setFilter({
            ...filter,
            color: [...filter.color, item.name],
          });
          break;
        case "Rams":
          setFilter({
            ...filter,
            ram: [...filter.ram, item.name],
          });
          break;
        case "Demands":
          setFilter({
            ...filter,
            demand: [...filter.demand, item.value],
          });
          break;
        default:
      }
    } else {
      switch (type) {
        case "Brands":
          const newBrands = filter.brand.filter((e) => e !== item.id);
          setFilter({ ...filter, brand: newBrands });
          break;
        case "Colors":
          const newColors = filter.color.filter((e) => e !== item.name);
          setFilter({ ...filter, color: newColors });
          break;
        case "Rams":
          const newRams = filter.ram.filter((e) => e !== item.name);
          setFilter({ ...filter, ram: newRams });
          break;
        case "Demands":
          const newDemands = filter.demand.filter((e) => e !== item.value);
          setFilter({ ...filter, demand: newDemands });
          break;
        default:
      }
    }
  };

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
  };

  const handleChangePrice = (values) => {
    const filters = { ...queryParams, ...values, page: 1 };
    setPage(1);
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    if (
      filter.brand.length !== 0 ||
      filter.color.length !== 0 ||
      filter.ram.length !== 0 ||
      filter.demand.length !== 0
    ) {
      const filters = {
        ...queryParams,
        page: 1,
        ...filter,
      };
      setPage(1);
      navigate({
        pathname: "/product",
        search: queryString.stringify(filters, {
          arrayFormat: "comma",
        }),
      });
    } else {
      const filters = {
        ...queryParams,
        ...filter,
      };
      navigate({
        pathname: "/product",
        search: queryString.stringify(filters),
      });
    }
  }, [filter, queryParams]);

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
                    data={brandData}
                    type="Brands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div>
              <div className="flex flex-col m-4">
                <Accordion title="Màu sắc">
                  <Filter
                    data={colorData}
                    type="Colors"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div>
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
              <div className="flex flex-col m-4">
                <Accordion title="Nhu cầu">
                  <Filter
                    data={demandData}
                    type="Demands"
                    filterSelect={filterSelect}
                    filter={filter}
                  />
                </Accordion>
              </div>
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
              
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((item) => (
                    <FilterProduct key={item.id} data={item} />
                  ))}
                </div>
              </div>
              {totalPageFilter > 0 && (
                <div className="flex items-center justify-center mt-10">
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={20}
                    totalItemsCount={totalPageFilter * 20}
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
