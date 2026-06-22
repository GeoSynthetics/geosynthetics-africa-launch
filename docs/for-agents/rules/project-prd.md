---
trigger: model_decision
description: When a core stack is mentioned in a prompt 
---

Product Requirements Document (PRD): Geosynthetics Africa Platform ModernizationProject Title: Geosynthetics Africa Platform Modernization
Status: Draft/Initial Review
Technical Stack: Next.js, Supabase, Payload CMS, Meilisearch
Target Markets: South Africa, Pan-African Region, Global Partners  1. Executive SummaryThe objective is to replace the legacy WordPress site with a high-performance headless architecture. The platform must serve as a technical authority for civil engineers while providing a streamlined B2B e-commerce experience across Africa. It must satisfy the modernization requirements of key partners: Solmax, Thrace, and Tensar.  2. Target AudienceCivil Engineers & Consultants: Seeking technical specifications (TDS/SDS) and application-specific solutions.  Contractors & Procurement Officers: Looking for direct pricing, stock availability, and logistics calculators.  Global Partners: Requiring a digital brand environment that matches international standards.  3. Functional RequirementsHigh Priority3.1 Connected Navigation (Solution-First UI)  Relational Mapping: Users must be able to navigate by Application (e.g., Mining) and see all associated products, or vice-versa.  Mega Menus: Visual menus for Applications, Products, and Services featuring direct "Quick Quote" triggers.  3.2 Technical Discovery (Meilisearch)  Sub-second search across 200+ engineering products.  Filter by technical attributes (Tensile strength, mass, polymer type).  Typo-tolerant global search bar with instant visual results.  Medium Priority3.3 B2B E-commerce & Logistics  Regional stock visibility (Lagos, Accra, Nairobi, etc.).  Industrial freight calculator based on weight/volume of geosynthetic rolls.  Tiered pricing for bulk contractor orders.  4. Content Management (Payload CMS)Product Management: Ability to add/edit 200+ products with custom technical fields.  Media Vault: Centralized storage for high-resolution installation videos and PDF technical sheets.  Case Study Builder: A template-based system for publishing Africa-based success stories.  5. Non-Functional RequirementsPerformance: < 1s Page Load speed via Next.js SSG/SSR.  Security: Cloudflare WAF integration and bot protection.  SEO: Automated 301 redirects from WordPress and metadata management for African search optimization.  6. Success Metrics50% increase in lead generation via "Quick Quote" triggers.  Significant reduction in site latency for users on low-bandwidth African networks.  Partner approval (Solmax, Thrace, Tensar) on brand modernization.  

Technical Stack Summary: geosynthetics.co.za Modernization
Project Goal: To replace the legacy WordPress site with a high-performance, SEO-optimized, and secure industrial E-commerce engine.
Prepared by: Kavara Digital Global LTD | 2026  
+1

1. The Core Infrastructure (The "Engine")
Frontend: React / Next.js (App Router).  

Rationale: Provides Server-Side Rendering (SSR) and Static Site Generation (SSG) to ensure 200+ product pages load near-instantly and rank well on Google across Africa.  

Hosting & Deployment: Vercel.  

Rationale: Offers native support for Next.js with a global Edge Network, guaranteeing low latency for users in remote African locations.  

Version Control & CI/CD: GitHub.  

Rationale: Automated deployment pipelines ensure every code update is tested and deployed without downtime.  

2. Data & Content Management (The "Brain")
Database & Auth: Supabase (PostgreSQL).  

Rationale: A relational database is essential for "Connected Navigation," linking Products to multiple Applications and Services while handling secure authentication for the Partner/Contractor Portal.  

Asset Storage: Supabase Storage.  

Rationale: Highly performant storage for high-resolution technical data sheets (PDFs), installation videos, and product imagery.  

Headless CMS: Payload CMS.  

Rationale: Native to Next.js, allowing for a customized admin experience to manage case studies, blogs, and complex engineering specs.  

3. Performance, Search & Security
Advanced Search: Meilisearch.  

Rationale: A lightning-fast, typo-tolerant search engine essential for finding specific specs among 200+ products instantly.  

DNS & Security: Cloudflare.  

Rationale: Provides an enterprise-grade WAF (Web Application Firewall) to mitigate bot attacks and DDoS threats.  

Analytics: Google Analytics 4 (GA4).  

Rationale: Leverages existing configurations to maintain data continuity, focusing on SEO tracking and conversion funnels.  

Email Infrastructure: Resend.  

Rationale: Ensures Quote Requests and contact forms are delivered with 100% reliability.