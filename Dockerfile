# Chọn image Node.js
FROM node:23

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và yarn.lock
COPY package.json yarn.lock ./

# Cài đặt dependencies
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["yarn", "start"]