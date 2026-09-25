-- Migration: Add missing values to resource_type enum
-- Date: 2026-07-01

-- PostgreSQL allows ALTER TYPE ... ADD VALUE to add values to an existing enum.
-- This ensures the database supports 'case_study' and 'manual' resource types.
ALTER TYPE public.resource_type ADD VALUE IF NOT EXISTS 'case_study';
ALTER TYPE public.resource_type ADD VALUE IF NOT EXISTS 'manual';
