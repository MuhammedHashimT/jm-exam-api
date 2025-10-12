# Security Guidelines

## Environment Variables & Secrets Management

### ✅ DO's

1. **Use Environment Variables for All Secrets**
   ```javascript
   // ✅ Good
   const JWT_SECRET = process.env.JWT_SECRET;
   const MONGO_URI = process.env.MONGO_URI;
   ```

2. **Keep .env Files Local Only**
   - `.env` files are in `.gitignore`
   - Only commit `.env.example` with placeholder values
   - Never commit actual secrets to git

3. **Use Different Secrets for Each Environment**
   - Development: `.env`
   - Production: Set via hosting platform (Vercel, etc.)
   - Staging: Separate environment variables

4. **Secure Admin Credentials**
   ```javascript
   // ✅ Good - from environment
   const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
   const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
   ```

### ❌ DON'Ts

1. **Never Hardcode Secrets**
   ```javascript
   // ❌ Bad
   const JWT_SECRET = "my-secret-key";
   const ADMIN_PASSWORD = "Admin@123";
   ```

2. **Never Commit .env Files**
   ```bash
   # ❌ Bad
   git add .env
   git commit -m "Add environment config"
   ```

3. **Don't Share Secrets in Chat/Email**
   - Use secure secret sharing tools
   - Or share them through encrypted channels

## Git Security

### Pre-commit Checks

Before committing, always run:
```bash
# Check for secrets
git diff --cached | grep -E "(password|secret|key|token)"

# Check git status
git status

# Ensure .env is ignored
git check-ignore .env
```

### If Secrets Were Accidentally Committed

If you accidentally commit secrets, you must:

1. **Immediately rotate the compromised secrets**
2. **Remove from git history** (if recent):
   ```bash
   # Remove last commit
   git reset --hard HEAD~1
   
   # Force push (if already pushed)
   git push --force
   ```

3. **For older commits, use git-filter-branch or BFG Repo-Cleaner**

## Production Security Checklist

- [ ] All secrets are environment variables
- [ ] `.env` files are not committed
- [ ] Different secrets for each environment  
- [ ] JWT secrets are strong (>32 characters)
- [ ] Database credentials are secure
- [ ] Admin credentials are changed from defaults
- [ ] HTTPS is enforced in production
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented

## Environment Variables Reference

### Required Environment Variables

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Admin Access
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-admin-password
```

### Setting Environment Variables

#### Local Development
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

#### Vercel Production
```bash
# Using Vercel CLI
vercel env add JWT_SECRET
vercel env add MONGO_URI
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
```

#### GitHub Actions
```bash
# Add secrets in repository settings
VERCEL_TOKEN
ORG_ID  
PROJECT_ID
```

## Secret Rotation Schedule

- **JWT Secrets**: Every 6 months
- **Database Passwords**: Every 3 months  
- **Admin Passwords**: Every 3 months
- **API Keys**: As required by provider

## Incident Response

If secrets are compromised:

1. **Immediately rotate affected secrets**
2. **Update all deployment environments**
3. **Review access logs for unauthorized usage**
4. **Document the incident**
5. **Review security practices**

## Tools for Secret Management

### Recommended Tools
- **Vercel**: Built-in environment variable management
- **GitHub Secrets**: For CI/CD pipelines
- **HashiCorp Vault**: For enterprise applications
- **AWS Secrets Manager**: For AWS deployments

### Security Scanning
- **git-secrets**: Prevent committing secrets
- **TruffleHog**: Find secrets in git history
- **GitLeaks**: Detect secrets in code

## Contact

For security concerns or questions:
- Email: security@yourdomain.com
- Create private GitHub issue for vulnerabilities