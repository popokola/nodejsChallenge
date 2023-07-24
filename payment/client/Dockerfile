# Use an official Node.js runtime as the base image
FROM node:18 as builder

# Set the working directory inside the container
WORKDIR /app/payment/client

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Vue.js app with Vite
RUN npm run build

# Use a lightweight web server to serve the built app
FROM nginx:alpine

# Copy the built app from the previous stage to the nginx server
COPY --from=builder /app/payment/client/dist /usr/share/nginx/html

# Expose the default HTTP port for the server (usually 80)
ENV PORT=${PORT:-80}

# Start the nginx server when the container runs
CMD ["nginx", "-g", "daemon off;"]
