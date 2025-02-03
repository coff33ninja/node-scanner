# Troubleshooting Guide

## Common Issues

### Node Connection Problems

1. **Node Cannot Connect to Hub**
   - Verify hub URL is correct
   - Check network connectivity
   - Ensure authentication tokens are valid
   - Verify port is not blocked by firewall

2. **Authentication Failures**
   - Check JWT token expiration
   - Verify secret keys match
   - Ensure clock synchronization

### Device Discovery Issues

1. **Devices Not Found**
   - Check network subnet configuration
   - Verify device is powered on
   - Ensure no firewall blocking
   - Check MAC address format

2. **Wake-on-LAN Not Working**
   - Verify device supports WoL
   - Check MAC address is correct
   - Ensure broadcast packets allowed

## Performance Issues

1. **High CPU Usage**
   - Reduce scan frequency
   - Optimize network queries
   - Check for infinite loops
   - Monitor background tasks

2. **Memory Leaks**
   - Check for unsubscribed observers
   - Monitor websocket connections
   - Verify cleanup on component unmount

## Debug Logs

Enable debug logging:
```typescript
{
  level: 'debug',
  format: 'json',
  filename: './logs/app.log'
}
```

## Support

For additional support:
1. Check GitHub issues
2. Join Discord community
3. Contact maintainers