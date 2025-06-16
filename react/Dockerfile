# Build stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Create .env.production file
RUN printf "VITE_API_URL=https://welloffice-c5re.onrender.com/api\nVITE_OPENAI_API_KEY=your-openai-key\nVITE_PORT=3000\nVITE_ENV=production\nVITE_DEBUG=false" > .env.production

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 