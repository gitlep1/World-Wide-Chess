import Cookies from "js-cookie";

const SetCookies = (name, data, expirationDate) => {
  Cookies.set(name, JSON.stringify(data), {
    expires: expirationDate,
    path: "/",
    sameSite: "strict",
  });
};

const RemoveCookies = (name) => {
  Cookies.remove(name);
};

export { SetCookies, RemoveCookies };
