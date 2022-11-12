import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FilterPrice from "../module/filter/FilterPrice";
import FilterProduct from "../module/filter/FilterProduct";
import { useMemo } from "react";
import queryString from "query-string";
import FilterSort from "../module/filter/FilterSort";
import { useEffect } from "react";
import productApi from "../api/productApi";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Filter from "../components/filter/Filter";
import { brandData } from "../api/brandData";
import Accordion from "../components/accordion/Accordion";

const ProductFilterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const Brand = brandData;
  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      ...params,
      _page: Number.parseInt(params._page) || 1,
      _sort: params._sort,
    };
  }, [location.search]);

  const initFilter = {
    brands: [],
    colors: [],
  };

  const [filter, setFilter] = useState(initFilter);

  const filterSelect = (type, checked, item) => {
    if (checked) {
      switch (type) {
        case "Brands":
          setFilter({ ...filter, brands: [...filter.brands, item.name] });
          break;
      }
    } else {
      switch (type) {
        case "Brands":
          const newBrands = filter.brands.filter((e) => e !== item.name);
          setFilter({ ...filter, brands: newBrands });
      }
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    async function fetchDataProduct() {
      try {
        const response = await productApi.getAllProduct();
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchDataProduct();
  }, []);

  const handleClickSort = (newSortValue) => {
    const filters = {
      ...queryParams,
      _sort: newSortValue,
    };
    navigate({ pathname: "/product", search: queryString.stringify(filters) });
  };

  useEffect(() => {
    const filters = {
      ...queryParams,
      _brands: filter.brands.join(" "),
    };
    navigate({ pathname: "/product", search: queryString.stringify(filters) });
  }, [filter]);

  console.log(queryParams);
  return (
    <div className="mt-10">
      {loading ? (
        <LoadingSpinner />
      ) : (
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
            <div className="product-filter w-full  bg-white rounded-lg flex flex-col items-start text-black">
              {/* <FilterPrice onChange={handleChange} /> */}
              <div className="border-y-2 border-solid border-[#f5f5f9] w-full">
                <Accordion title="Thương hiệu" className="true">
                  {Brand.length > 0 &&
                    Brand.map((item) => {
                      return (
                        <Filter
                          label={item.name}
                          key={item.id}
                          onChange={(input) => {
                            filterSelect("Brands", input.checked, item);
                          }}
                          checked={queryParams._brands?.includes(item.name)}
                        />
                      );
                    })}
                </Accordion>
              </div>
            </div>
            <div className="product-list">
              <div className="flex flex-col container rounded-lg bg-white ">
                <div className="flex items-center p-5 gap-x-10 ">
                  <span className="font-medium text-lg ">Sắp xếp theo</span>
                  <FilterSort onClick={handleClickSort} />
                </div>
                <FilterProduct data={product} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilterPage;
