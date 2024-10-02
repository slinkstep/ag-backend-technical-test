# Use the Node.js 18 image for the amd64 platform
FROM --platform=linux/amd64 node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the NestJS application
RUN npm run build

# Expose the port that the app listens on
EXPOSE 80

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
