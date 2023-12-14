#!/bin/bash

# Script for setting up a Yarn-based project with user prompts

echo "Welcome to the project setup script!"

# Prompt the user for MongoDB URI
read -p "Enter MongoDB URI: " mongodb_uri

# Prompt the user for Bot Token
read -p "Enter Bot Token: " bot_token

# Prompt the user for Database Name
read -p "Enter Database Name: " db_name

# Install Yarn (if not already installed)
if ! command -v yarn &> /dev/null; then
  echo "Yarn not found. Installing Yarn..."
  npm install -g yarn
fi

# Install project dependencies
echo "Installing project dependencies..."
yarn install

# Create environment file
echo "Creating .env file..."
echo "MONGODB_URI=$mongodb_uri" >> .env
echo "BOT_TOKEN=$bot_token" >> .env
echo "DB_NAME=$db_name" >> .env

# Additional setup tasks can be added here

# Display completion message
echo "Setup completed successfully!"