# Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
- Vercel account
- MongoDB Atlas account (for production database)
- Git repository

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create a Cluster**
   - Choose a free tier cluster
   - Select a region close to your users

3. **Get Connection String**
   - Go to Database > Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Choose framework preset: "Other"
   - Set build command: (leave empty)
   - Set output directory: (leave empty)

### Step 3: Environment Variables

In your Vercel dashboard:

1. Go to your project
2. Click "Settings" > "Environment Variables"
3. Add the following variables:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jm-exam-portal
JWT_SECRET=your-super-secret-production-jwt-key-min-32-chars
```

### Step 4: Domain Configuration

1. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain

2. **Update CORS Origins**
   - Update `server.js` with your frontend domain
   ```javascript
   origin: process.env.NODE_ENV === 'production' 
     ? ['https://your-frontend-domain.vercel.app']
     : ['http://localhost:3000']
   ```

### Step 5: Test Deployment

1. **Health Check**
   ```
   GET https://your-api-domain.vercel.app/api/health
   ```

2. **Test Endpoints**
   ```
   GET https://your-api-domain.vercel.app/api/districts
   POST https://your-api-domain.vercel.app/api/admin/login
   ```

---

## 🐳 Alternative: Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/jm-exam-portal
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## 🖥️ VPS Deployment

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [{
       name: 'jm-exam-api',
       script: 'src/server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'development',
         PORT: 5000
       },
       env_production: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   };
   ```

3. **Deploy**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Security Checklist

### Production Security
- [ ] Change default JWT secret
- [ ] Use strong MongoDB credentials
- [ ] Enable MongoDB authentication
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Sanitize all inputs
- [ ] Log security events
- [ ] Regular security updates

### Environment Variables Security
- [ ] Never commit `.env` files
- [ ] Use different secrets for each environment
- [ ] Rotate JWT secrets periodically
- [ ] Use Vercel's secret environment variables

---

## 📊 Monitoring

### Health Checks
- Set up monitoring for `/api/health` endpoint
- Monitor database connections
- Track API response times

### Logging
- Use structured logging in production
- Monitor error rates
- Set up alerts for critical errors

### Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for high usage
- Regular database backups

---

## 🚨 Troubleshooting

### Common Issues

1. **Deployment Fails**
   - Check `vercel.json` configuration
   - Verify Node.js version compatibility
   - Check for syntax errors

2. **Database Connection Issues**
   - Verify MongoDB URI
   - Check network access in Atlas
   - Ensure proper firewall settings

3. **CORS Errors**
   - Update allowed origins
   - Check request headers
   - Verify HTTPS/HTTP protocol

4. **JWT Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

### Debug Commands
```bash
# Check logs
vercel logs your-deployment-url

# Test locally
npm run dev

# Check database connection
npm run stats
```

---

## 📈 Performance Optimization

### Database
- Add proper indexes
- Use aggregation pipelines
- Implement caching where appropriate

### API
- Implement pagination
- Add response compression
- Use CDN for static assets

### Monitoring
- Set up performance monitoring
- Track slow queries
- Monitor memory usage

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```