# Use the official Nginx image
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy your project files to the web server directory
COPY . .

# Expose port 8080 to access the app
EXPOSE 8080

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
