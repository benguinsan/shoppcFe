import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../profile/Profile";
import Swal from "sweetalert2";
import userApi from "../../api/userApi";
import { logout } from "../../redux/auth/userSlice";
import Cart from "../cart/Cart";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { getCart } from "../../redux/cart/cartSlice";
import CartHollow from "../cart/CartHollow";
import Search from "../search/Search";
import useClickOutSide from "../../hooks/useClickOutSide";

const Navbar = () => {
  const loggedInUser = useSelector((state) => state.user.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [islogout, setIsLogout] = useState(false);
  const bodyStyle = document.body.style;
  let isLocked = false;
  const hanleMouseOver = () => {
    if (!isLocked) {
      disableBodyScroll(bodyStyle);
      isLocked = true;
    }
  };
  const hanleMouseOut = () => {
    if (isLocked) {
      enableBodyScroll(bodyStyle);
      isLocked = false;
    }
  };

  const isLoggedIn =
    loggedInUser === null ? null : loggedInUser.active === "active";

  useEffect(() => {
    if (localStorage.getItem("jwt") && loggedInUser.active === "verify") {
      setIsLogout(true);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Đăng xuất ",
      text: "Bạn có chắc chắn muốn đăng xuất không ?",
      showCancelButton: true,
      icon: "question",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = logout();
        dispatch(action);
        await userApi.logout();
        navigate("/");
        Swal.fire("Tạm biệt! Hẹn gặp lại quý khách");
        setIsLogout(false);
      }
    });
  };

  // cart
  let { cart } = useSelector((state) => state.cart);
  useEffect(() => {
    if (!cart) {
      dispatch(getCart());
    }
  }, [cart]);

  //search
  const [keyword, setKeyWord] = useState("");
  const { show, setShow, nodeRef } = useClickOutSide();
  const handleClick = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleClickSearch = () => {
    navigate("/product");
  };

  return (
    <nav className="w-full bg-primary h-[100px] sticky z-50 shadow-md transition-all top-0 text-white">
      <div className="container flex items-center h-full justify-between">
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <Link to="/" className="flex items-center">
            <div className="w-[100px] h-[120px]">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-medium text-4xl">HC.VN</span>
          </Link>
        </div>

        <div className="w-[700px] flex items-center relative " ref={nodeRef}>
          <input
            type="text"
            className="py-3 px-4 rounded-l-lg text-lg w-[650px] flex-shrink-0 text-black search"
            placeholder="Nhập tên laptop cần tìm ..."
            onClick={handleClick}
            onChange={(e) => setKeyWord(e.target.value)}
          />
          <div
            className="w-[50px] bg-yellow-400 h-[52px] rounded-r-lg flex items-center justify-center cursor-pointer "
            onClick={handleClickSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          {show === true && (
            <Search onClickItem={handleClose} keyword={keyword} />
          )}
        </div>

        {!isLoggedIn && !islogout && (
          <Link
            to="/sign-in"
            className="flex items-center justify-center hover:text-yellow-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="px-2 font-bold text-lg">Đăng nhập</span>
          </Link>
        )}

        {isLoggedIn && !islogout && <Profile data={loggedInUser} />}

        {islogout && !isLoggedIn && (
          <button
            type="button"
            className="flex items-center justify-center cursor-pointer hover:text-yellow-400"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <span className="px-2 font-bold text-lg">Đăng xuất</span>
          </button>
        )}

        <div
          className="relative flex items-center gap-x-3 cart-home cursor-pointer"
          onMouseOver={hanleMouseOver}
          onMouseOut={hanleMouseOut}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-white cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <div className="flex flex-col items-start justify-between ">
            <span className="font-medium">Giỏ hàng của bạn</span>
            <span className="font-medium ">({cart?.length || 0}) sản phẩm</span>
          </div>
          {cart?.length > 0 ? <Cart /> : <CartHollow />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
