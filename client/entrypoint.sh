#!/bin/sh

if [ "$ENV" = "dev" ]; then
  echo "Running in development mode..."
  npm run dev
else
  echo "Running in production mode..."
  npm start
fi 