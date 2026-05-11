-- Seed file for Geosynthetics Africa
-- This file populates the database with initial configurations and mock data.

INSERT INTO public.site_config (key, value)
VALUES (
  'mega_menu',
  '{
    "products": {
      "featured": [
        {
          "to": "/products/$category",
          "spec": "0.5mm – 3.0mm",
          "label": "HDPE Smooth Geomembrane",
          "params": { "category": "geomembranes" }
        },
        {
          "to": "/products/$category",
          "spec": "0.5mm – 3.0mm",
          "label": "HDPE Textured Geomembrane",
          "params": { "category": "geomembranes" }
        },
        {
          "to": "/products/$category",
          "spec": "0.5mm – 2.0mm",
          "label": "LLDPE Geomembrane",
          "params": { "category": "geomembranes" }
        },
        {
          "to": "/products/$category",
          "spec": "0.5mm – 2.0mm",
          "label": "PVC Geomembrane",
          "params": { "category": "geomembranes" }
        }
      ]
    },
    "applications": {
      "featured": [
        {
          "to": "/applications/$category",
          "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          "title": "TSF Lining System",
          "params": { "category": "mining-systems" },
          "description": "Complete containment with HDPE geomembranes, GCLs & leak detection."
        },
        {
          "to": "/applications/$category",
          "image": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&q=80",
          "title": "Heap Leach Pad",
          "params": { "category": "mining-systems" },
          "description": "Engineered lining for chemical containment and leak protection."
        },
        {
          "to": "/applications/$category",
          "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
          "title": "Process Ponds",
          "params": { "category": "water-containment" },
          "description": "Reliable, cost-effective lining systems for process water."
        }
      ]
    },
    "services": {
      "featured": [
        {
          "to": "/services/$slug",
          "image": "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=400&q=80",
          "title": "Global Sourcing",
          "params": { "slug": "supply" },
          "description": "Access to global manufacturers and best-in-class materials."
        },
        {
          "to": "/services/$slug",
          "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80",
          "title": "Expert Installation",
          "params": { "slug": "installation" },
          "description": "Certified installation teams with proven methodologies."
        },
        {
          "to": "/quality-assurance",
          "image": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80",
          "title": "Quality & Testing",
          "description": "On-site testing and documentation to international standards."
        }
      ]
    }
  }'::jsonb
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
