FROM node:16.16.0-alpine

# Install a simple HTTP server to serve our static content
RUN npm install -g http-server

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files and folders to the working directory (i.e., the 'app' folder)
COPY . .

# Build the production-minified application
RUN npm run build

# Expose port 8080 (adjust if necessary)
EXPOSE 8080

# Start the HTTP server and serve the 'dist' folder
CMD [ "http-server", "dist" ]
