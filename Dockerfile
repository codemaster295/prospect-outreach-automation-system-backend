# Use official Node.js LTS image
FROM node:18 AS base

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .
RUN mkdir -p /usr/src/app/data && touch /usr/src/app/data/database.sqlite

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3

