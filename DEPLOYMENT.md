# Prospect PAL - Deployment Guide

Complete guide for deploying Prospect PAL to production.

---

## 🚀 Quick Deploy (Vercel)

### Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **Vercel CLI** - Already installed ✅
3. **AWS Account** - For Bedrock & DynamoDB
4. **Environment Variables** - See below

### Deploy Steps

```bash
# 1. Ensure all changes are committed and pushed
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Set environment variables in Vercel dashboard
vercel env add AWS_REGION
vercel env add AWS_ACCESS_KEY_ID
vercel env add AWS_SECRET_ACCESS_KEY
# ... add all required env vars
```

---

## 🔐 Environment Variables

### Required (AWS)

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### Required (DynamoDB)

```bash
DYNAMODB_TABLE_PROJECTS=ProspectPALProjects
DYNAMODB_TABLE_SESSIONS=ProspectPALSessions
DYNAMODB_TABLE_ARTIFACTS=ProspectPALArtifacts
```

### Optional

```bash
# N8N Integration
N8N_WEBHOOK_BASE_URL=https://n8n.example.com/webhook

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# App URL
NEXT_PUBLIC_APP_URL=https://prospect-pal.vercel.app
```

---

## 📋 Pre-Deployment Checklist

### 1. AWS Setup

- [ ] Create AWS account
- [ ] Create IAM user with programmatic access
- [ ] Attach policies:
  - `AmazonDynamoDBFullAccess`
  - `AmazonBedrockFullAccess`
- [ ] Save access key ID and secret access key

### 2. DynamoDB Tables

Create three tables in AWS DynamoDB:

**ProspectPALProjects**
```
Primary Key: id (String)
GSI: userId-index
  - Partition Key: userId (String)
```

**ProspectPALSessions**
```
Primary Key: id (String)
GSI: sessionId-index
  - Partition Key: sessionId (String)
```

**ProspectPALArtifacts**
```
Primary Key: id (String)
GSI: projectId-index
  - Partition Key: projectId (String)
```

### 3. Bedrock Access

Enable Claude models in AWS Bedrock:
- Navigate to AWS Bedrock console
- Request access to Claude models:
  - Claude Sonnet 4
  - Claude Opus 4
  - Claude Haiku 4
- Wait for approval (~5 minutes)

---

## 🔧 Vercel Configuration

### Project Settings

1. **Framework Preset:** Next.js
2. **Build Command:** `npm run build`
3. **Output Directory:** `.next`
4. **Install Command:** `npm install`

### Environment Variables

Add all environment variables in:
**Vercel Dashboard → Project → Settings → Environment Variables**

Or via CLI:
```bash
vercel env add AWS_REGION production
# Enter value when prompted
```

### Domain Configuration

1. Go to **Vercel Dashboard → Project → Settings → Domains**
2. Add custom domain (optional)
3. Configure DNS records as shown

---

## 🧪 Testing Deployment

### 1. Health Check

```bash
curl https://your-app.vercel.app/api/swarm/webhook
```

Expected response:
```json
{
  "queue_size": 0,
  "running_tasks": 0,
  "completed_tasks": 0,
  "agents": [...]
}
```

### 2. Test Agent Swarm

```bash
curl -X POST https://your-app.vercel.app/api/swarm/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "user_input": "Research top 5 B2B SaaS companies",
    "routing_preference": "auto"
  }'
```

### 3. Test Chat UI

1. Navigate to deployed URL
2. Select "Researcher" agent
3. Ask: "Research marketing automation tools"
4. Verify response

---

## 📊 Monitoring

### Vercel Dashboard

- **Analytics:** View page views, visitors
- **Logs:** Real-time function logs
- **Usage:** API requests, bandwidth

### AWS CloudWatch

- **Bedrock:** API calls, token usage
- **DynamoDB:** Read/write capacity, throttles
- **Costs:** Estimated monthly spend

---

## 🚨 Troubleshooting

### Build Failures

**Error: Missing environment variables**
```bash
# Add missing env vars
vercel env add VARIABLE_NAME production
```

**Error: Module not found**
```bash
# Clear cache and rebuild
vercel --force
```

### Runtime Errors

**Error: AWS credentials not found**
- Verify env vars in Vercel dashboard
- Check IAM user permissions
- Ensure region is correct

**Error: DynamoDB table not found**
- Create tables in AWS console
- Verify table names match env vars
- Check region

**Error: Bedrock access denied**
- Request model access in Bedrock console
- Wait for approval
- Verify IAM permissions

### Performance Issues

**Slow API responses**
- Check AWS Bedrock quotas
- Monitor DynamoDB throttles
- Scale Vercel function memory (Pro plan)

---

## 🔄 Continuous Deployment

Vercel automatically deploys on git push:

```bash
# Push to main → auto-deploy to production
git push origin main

# Push to branch → deploy preview
git push origin feature-branch
```

### Preview Deployments

Every pull request gets a preview URL:
- Unique URL per PR
- Isolated environment
- Same env vars as production

---

## 💰 Cost Estimation

### Vercel (Hobby Plan - Free)
- 100GB bandwidth/month
- Unlimited deployments
- 100GB-hours serverless function execution

### Vercel (Pro Plan - $20/month)
- 1TB bandwidth/month
- Advanced analytics
- More function memory

### AWS Costs (Estimated)

**Bedrock Claude API:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- Est. $50-200/month (depends on usage)

**DynamoDB:**
- On-demand: $1.25 per million write requests
- On-demand: $0.25 per million read requests
- Est. $10-50/month

**Total Estimated:** $60-250/month

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use Vercel secrets for sensitive data
- Rotate AWS keys regularly

### 2. IAM Permissions
- Use least-privilege principle
- Create separate IAM users per environment
- Enable MFA on AWS account

### 3. API Security
- Implement rate limiting
- Add API key authentication
- Monitor for abuse

### 4. CORS Configuration
- Restrict allowed origins
- Whitelist specific domains
- Use secure headers

---

## 📱 Mobile/Responsive

Prospect PAL is fully responsive:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

Test on:
- Chrome DevTools device emulation
- Real devices via Vercel preview URLs

---

## 🆘 Support

**Documentation:**
- [README_AGENT_SWARM.md](README_AGENT_SWARM.md) - Agent swarm overview
- [docs/agent-swarm-guide.md](docs/agent-swarm-guide.md) - API reference
- [CHAT_UI_AGENT_SWARM_INTEGRATION.md](CHAT_UI_AGENT_SWARM_INTEGRATION.md) - UI guide

**Issues:**
- GitHub Issues: https://github.com/diamitani/prospect-pal/issues

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

---

## 📈 Post-Deployment

### 1. Configure Custom Domain
```bash
vercel domains add prospect-pal.com
```

### 2. Enable Analytics
- Vercel Analytics (built-in)
- Google Analytics
- Mixpanel/Amplitude

### 3. Set Up Monitoring
- Sentry for error tracking
- LogRocket for session replay
- New Relic for APM

### 4. Create Backups
```bash
# DynamoDB backup
aws dynamodb create-backup \
  --table-name ProspectPALProjects \
  --backup-name projects-backup-$(date +%Y%m%d)
```

---

## ✅ Deployment Complete!

Your Prospect PAL agent swarm is now live! 🎉

**Next Steps:**
1. Test all agent types (Architect, Analyst, Copywriter, etc.)
2. Verify AWS Bedrock connectivity
3. Monitor initial usage and costs
4. Share with beta users
5. Collect feedback

**Production URL:** Check Vercel dashboard or CLI output

```bash
# View deployment URL
vercel ls
```

---

**Deployed:** $(date)  
**Version:** 1.0.0  
**Platform:** Vercel + AWS  
**Framework:** Next.js 15 + ROSTR
