import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterProduct from "../module/filter/FilterProduct";
import { useDispatch, useSelector } from "react-redux";
import { action_status } from "../utils/constants/status";
import LoadingPage from "../components/loading/LoadingPage";
import { useEffect } from "react";
import { getBrand, getProductFilter } from "../redux/product/productSlice";
import { useState } from "react";
import Pagination from "react-js-pagination";
import FilterSort from "../module/filter/FilterSort";
import queryString from "query-string";
import FilterPrice from "../module/filter/FilterPrice";
import { colorData } from "../api/colorData";
import Accordion from "../components/accordion/Accordion";
import Filter from "../components/filter/Filter";
import { ramData } from "../api/ramData";

const ProductFilterPage = () => {
  const params = queryString.parse(location.search);
  const { productFilter, statusFilter, totalPageFilter, statusBrand, brand } =
    useSelector((state) => state.product);
  const queryParams = useMemo(() => {
    return {
      ...params,
      page: Number.parseInt(params.page) || 1,
      limit: 20,
      sort: params.sort || "promotion",
    };
  }, [location.search]);

  const [page, setPage] = useState(queryParams.page);
  const [sort, setSort] = useState(queryParams.sort);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      dispatch(getProductFilter(queryParams));
      setSort(queryParams.sort);
    } catch (error) {
      console.log(error.message);
    }
  }, [page, sort, queryParams]);

  useEffect(() => {
    try {
      if (statusBrand === action_status.IDLE) {
        dispatch(getBrand());
      }
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const initFilter = {
    brand: params.brand || [],
    color: params.color || [],
    ram: params.ram || [],
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
    const filters = { ...queryParams, ...values };
    console.log(values);
    navigate({
      pathname: "/product",
      search: queryString.stringify(filters),
    });
  };

  useEffect(() => {
    if (
      filter.brand.length !== 0 ||
      filter.color.length !== 0 ||
      filter.ram.length !== 0
    ) {
      const filters = {
        ...queryParams,
        ...filter,
      };
      navigate({
        pathname: "/product",
        search: queryString.stringify(filters),
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

  console.log(filter);
  console.log(brand);

  return (
    <>
      <div className="mt-10">
        <div className="container">
          {" "}
          <div className="flex items-center">
            <Link to="/" className=" text-lg text-[#a8b4c9] flex items-center">
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
            <span className="text-lg text-[#a8b4c9]">Laptop chính hãng</span>
          </div>
          <div className="wrapper-product">
            {statusBrand === action_status.LOADING && <LoadingPage />}
            {statusBrand === action_status.SUCCEEDED && (
              <>
                {" "}
                <div className="product-filter w-full  bg-white rounded-lg flex flex-col items-start text-black">
                  <FilterPrice onChange={handleChangePrice} />
                  <Accordion title="Thương hiệu" className="true">
                    {brand.length > 0 &&
                      brand.map((item) => {
                        return (
                          <Filter
                            label={item.name}
                            key={item.id}
                            onChange={(input) => {
                              filterSelect("Brands", input.checked, item);
                            }}
                            checked={filter.brand.includes(item.id)}
                          />
                        );
                      })}
                  </Accordion>
                  <Accordion title="Màu sắc" className="true">
                    {colorData.length > 0 &&
                      colorData.map((item) => {
                        return (
                          <Filter
                            label={item.name}
                            key={item.id}
                            onChange={(input) => {
                              filterSelect("Colors", input.checked, item);
                            }}
                            checked={filter.color.includes(item.name)}
                          />
                        );
                      })}
                  </Accordion>
                  <Accordion title="Ram">
                    {ramData.length > 0 &&
                      ramData.map((item) => {
                        return (
                          <Filter
                            label={`${item.name}GB`}
                            key={item.id}
                            onChange={(input) => {
                              filterSelect("Rams", input.checked, item);
                            }}
                            checked={filter.ram.includes(item.name)}
                          />
                        );
                      })}
                  </Accordion>
                </div>
              </>
            )}

            <div className="product-list">
              {statusFilter === action_status.LOADING && <LoadingPage />}
              {statusFilter === action_status.SUCCEEDED && (
                <>
                  {" "}
                  <div className="flex flex-col container rounded-lg bg-white ">
                    <div className="flex items-center p-5 gap-x-5 ">
                      <span className="font-medium text-lg ">Sắp xếp theo</span>
                      <FilterSort onChange={handleClickSort} />
                    </div>
                    <FilterProduct data={productFilter} />
                  </div>
                  <div className="flex justify-center items-center mt-2">
                    <Pagination
                      activePage={page}
                      nextPageText={">"}
                      prevPageText={"<"}
                      totalItemsCount={totalPageFilter}
                      itemsCountPerPage={1}
                      firstPageText={"<<"}
                      lastPageText={">>"}
                      linkClass="page-num"
                      onChange={handlePageClick}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductFilterPage;
