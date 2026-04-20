import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5207/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

















/*
BU DOSYANIN AÇIKLAMASI:

Bu dosya, frontend ile backend arasındaki API bağlantısını sağlar.
Axios kullanılarak tüm HTTP istekleri buradan yapılır.

ÇALIŞMA MANTIĞI:
- Backend adresi (baseURL) burada tanımlanır
- Yapılan her istekte otomatik olarak token eklenir
- Böylece kullanıcı giriş yaptıysa yetkili işlemler yapılabilir

YAPILAN İŞLEMLER:

axios.create:
- Backend API adresi belirlenir (http://localhost:5207/api)

interceptors:
- Her istekte localStorage'dan token alınır
- Eğer token varsa Authorization header'a eklenir
- Format: Bearer <token>

BAĞLANTILI DOSYALAR:
- authService.js → login sonrası token alınır
- cartService.js → sepet işlemleri bu API ile yapılır
- orderService.js → sipariş işlemleri bu API ile yapılır
- productService.js → ürün işlemleri
- Login.jsx → token localStorage'a kaydedilir

NOT:
Bu yapı sayesinde her istekte token'ı manuel eklemeye gerek kalmaz.
Tüm korumalı (Authorize) endpointlere otomatik erişim sağlanır.
*/