# Troubleshooting Guide

## Backend Issues

### SQLite Connection Failed

**Problem**: Database connection errors
**Solutions**:
- Verify database file path in `.env`
- Ensure SQLite file is accessible
- Check file permissions

### Port Already in Use

**Problem**: Cannot start server
**Solutions**:
- Change `PORT` in `.env`
- Check for other services using port 5000
- Kill existing process using the port

## Frontend Issues

### Login/Register Not Working

**Problem**: Authentication issues
**Solutions**:
- Verify backend is running
- Check browser console for errors
- Ensure CORS settings match

### Network Errors

**Problem**: API communication issues
**Solutions**:
- Verify backend URL
- Check network connectivity
- Review CORS settings