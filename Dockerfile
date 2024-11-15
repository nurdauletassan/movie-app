FROM nginx:stable

# Copy the HTML, CSS, and JavaScript files into the container
COPY movie.html /usr/share/nginx/html/
COPY movie.js /usr/share/nginx/html/
COPY movie.css /usr/share/nginx/html/
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
