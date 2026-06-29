# Production Deployment Requirements & Checklist

This document details the production credentials, domain DNS settings, and SMTP/email configuration details required from James to move the site from Vercel staging to the live production environment.

---

## 📋 Production Readiness Checklist

### 1. Custom Domain & DNS Settings

To route traffic from the custom domain (e.g., `geosynthetics.co.za`) to Vercel:

- [ ] **Apex Domain (A Record)**:
  - **Host**: `@`
  - **Value**: `76.76.21.21`
  - **TTL**: `Auto` or `3600`
- [ ] **Subdomain (CNAME Record)**:
  - **Host**: `www`
  - **Value**: `cname.vercel-dns.com.`
  - **TTL**: `Auto` or `3600`
- [ ] **DNS Access**: Access to the domain registrar DNS zone manager (e.g., GoDaddy, Hostinger, Domain.com, or local South African registrars like domains.co.za).

---

### 2. Supabase Production Project Setup

A separate Supabase instance is required for production to isolate client data, quotes, and uploads:

- [ ] **Supabase Account**: James's email registered on [Supabase](https://supabase.com).
- [ ] **Production Project**: Create a new project (e.g., `geosynthetics-africa-prod`).
- [ ] **Database Migration**: Run current migrations (`supabase db push`) to build database tables (`case_studies`, `products`, `quotes`, `site_config`).
- [ ] **Storage Buckets**:
  - Create `boq-uploads` bucket (set to private/public as desired).
  - Create `product-images` bucket (must be set to **Public** for image loading).
- [ ] **Storage RLS Policies**: Enable Row Level Security (RLS) policies on buckets allowing anonymous inserts for quotes submissions and public read access.

---

### 3. Email Infrastructure (Resend)

Used to send quote request confirmations and notify sales when new BOQs are uploaded:

- [ ] **Resend Account**: Sign up at [Resend](https://resend.com) using the primary business or admin email.
- [ ] **Domain Verification**: Add the domain in Resend and add the generated DNS records (DKIM/SPF/MX) to the domain registrar to verify sending authority.
- [ ] **API Key**: Generate a production API key (formatted as `re_...`).
- [ ] **Receiving Email**: Confirm the notification inbox (e.g., `sales@geosynthetics.co.za`).

---

### 4. Vercel Production Environment Settings

- [ ] **Vercel Account**: Access to the Vercel team/account hosting the staging project.
- [ ] **Production Branch**: Assign the deployment branch (usually `main`) as the Production target.
- [ ] **Environment Variables**: Configure the system variables (detailed in `.env.production`) inside the Vercel project dashboard.
