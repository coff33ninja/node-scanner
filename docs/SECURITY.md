# Security Documentation

## Overview
This document outlines the security measures implemented in the application.

## Features

### 1. Audit Logging
- Comprehensive audit trail of system events
- Event categories: auth, node, security, system
- Timestamp and details for each event
- In-memory storage with 1000 event limit

### 2. Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks
- Configurable limits and window sizes

### 3. Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- HSTS enabled

### 4. Request Validation
- Content-Type validation for POST requests
- Automatic audit logging of all requests
- IP tracking and logging

## Best Practices
1. Keep audit logs for compliance and debugging
2. Monitor rate limit hits for potential attacks
3. Regularly review security headers
4. Maintain up-to-date dependencies

## Configuration
Rate limits and security settings can be adjusted in `securityEnhancer.ts`.