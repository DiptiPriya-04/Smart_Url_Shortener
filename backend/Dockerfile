# Use official Node.js image
FROM node:16

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files from the backend directory to the Docker container
COPY . .

# Expose port 5000 for Express
EXPOSE 5000

# Start the Express app
CMD ["npm", "start"]
