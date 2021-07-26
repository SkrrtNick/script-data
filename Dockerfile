FROM node:14

# Create the working directory for the app
WORKDIR /app

# Copy the package.json files to the working directrory
# Uses a wild card to ensure that both the package.json and package-lock.json files are copied
COPY package*.json ./

# Install the application packages via NPM (Based on the package.json files we moved previously)
RUN npm install

# Copy the app source (To the working directory)
COPY . .

# Expose the port that the application is running on
EXPOSE 3000

# Run the application using the npm "start" command (Found in the package.json)
CMD ["npm", "run", "start"]

