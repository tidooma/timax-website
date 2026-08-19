/** @type {import('next').NextConfig} */
const nextConfig = {
  // Разрешаем доступ с IP твоего телефона
  allowedDevOrigins: ["192.168.1.136", "127.0.0.1", "localhost"],
};

export default nextConfig;
