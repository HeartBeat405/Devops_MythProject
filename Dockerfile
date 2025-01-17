# Gunakan image Node.js
FROM node:16

# Set direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu untuk mengoptimalkan cache layer
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin semua file proyek (termasuk index.html dan server.js)
COPY . .

# Expose port untuk aplikasi
EXPOSE 5000

# Jalankan server.js
CMD ["node", "server.js"]
