# Step 1: Use Node.js base image
FROM node:alpine

# Step 2: Set working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your server is running on
EXPOSE 3001

# Step 7: Set environment variables
ENV PORT=3001

# Step 8: Start the server
CMD ["node", "server.js"]
