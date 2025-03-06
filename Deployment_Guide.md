# Deployment Guide for VIN Decoder Application

This guide covers how to deploy the VIN Decoder application to a production environment.

## Deploying the Backend

The backend Node.js server needs to be deployed to a server that can handle HTTP requests. Here are options for deploying the backend:

### Option 1: Traditional VPS or Dedicated Server

1. **Set up a server** with Node.js installed (e.g., DigitalOcean, AWS EC2, Linode)
2. **Transfer files** to the server using SCP, SFTP, or Git
3. **Install dependencies**:
   ```bash
   npm install --production
   ```
4. **Start the server** with a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```
5. **Set up reverse proxy** with Nginx or Apache (recommended for production)

#### Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name vin-api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Containerized Deployment with Docker

1. **Create a Dockerfile**:
   ```Dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run the Docker image**:
   ```bash
   docker build -t vin-decoder-api .
   docker run -p 3000:3000 vin-decoder-api
   ```

### Option 3: Platform-as-a-Service (PaaS)

Deploy to a service like Heroku, Vercel, or Render:

#### Heroku:
```bash
# Install Heroku CLI and login
npm install -g heroku
heroku login

# Create a new Heroku app
heroku create vin-decoder-api

# Push to Heroku
git push heroku main
```

#### Render:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select Node.js as the runtime
4. Set the build command: `npm install`
5. Set the start command: `node server.js`

## Deploying the Frontend

The frontend is a static HTML/CSS/JavaScript application which can be deployed to any static file hosting service.

### Option 1: Static Web Hosting

Deploy to services like:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting

#### Example: Netlify deployment
1. Create a `netlify.toml` file:
   ```toml
   [build]
     publish = "./"
   ```
2. Upload to Netlify via the dashboard or CLI

### Option 2: Serve from the Same Server

You can also serve the frontend from the same server as your backend:

1. Move the frontend files to a folder named `public` in your backend project
2. Add this line to your Express app:
   ```javascript
   app.use(express.static('public'));
   ```

## Environment Configuration

For production, consider using environment variables:

1. Create a `.env` file:
   ```
   PORT=3000
   NODE_ENV=production
   RATE_LIMIT=100
   ```

2. Update `server.js` to use environment variables:
   ```javascript
   require('dotenv').config();
   const PORT = process.env.PORT || 3000;
   ```

3. Install dotenv:
   ```bash
   npm install dotenv
   ```

## Security Considerations

1. **Add rate limiting** to prevent abuse:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Add HTTPS** by obtaining an SSL certificate (e.g., Let's Encrypt)

3. **Add API Key Authentication** if needed:
   ```javascript
   app.use((req, res, next) => {
     const apiKey = req.headers['x-api-key'];
     if (!apiKey || apiKey !== process.env.API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```

## Monitoring and Maintenance

1. **Implement logging** with tools like Winston or Morgan
2. **Set up monitoring** with services like New Relic, Datadog, or PM2 Plus
3. **Configure automated backups** if you're using a database

## Updating the Application

For future updates:

1. **Always test** changes in a staging environment
2. **Consider zero-downtime** deployment strategies
3. **Keep dependencies** up to date with `npm audit` and `npm update`

## Troubleshooting

Common issues:

1. **CORS errors**: Ensure the backend has proper CORS configuration
2. **Rate limiting**: The NHTSA API has rate limits, implement caching if necessary
3. **Connection timeouts**: NHTSA API may be slow, implement timeout handling and retry logic