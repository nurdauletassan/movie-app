# Use the official Nginx image
FROM nginx:alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Copy your project files to the web server directory
COPY . .

# Expose port 80 to access the app
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
