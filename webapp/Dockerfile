# Use Node.js official image as a base
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the webapp port
EXPOSE 3000

# Start the webapp
CMD ["npm", "run", "dev"]
