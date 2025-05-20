# PlayHQ API Integration Guide

## Overview
This document explains how to properly integrate with the PlayHQ API for retrieving fixture data for the Deepdene Bears Winter XI team.

## Required Credentials
To access the PlayHQ API, you need the following credentials:

1. **API Key**: An official API key provided by PlayHQ or your cricket association
   - Environment variable: `PLAYHQ_API_KEY`

2. **Tenant ID**: Usually 'ca' for Cricket Australia
   - Environment variable: `PLAYHQ_TENANT_ID`

3. **Organization ID**: The ID for your cricket club in PlayHQ
   - Environment variable: `PLAYHQ_ORG_ID`

4. **Season ID**: The ID for the current season
   - Environment variable: `PLAYHQ_SEASON_ID`

5. **Grade ID**: The ID specific to the East Division - Mamgain Shield grade
   - Environment variable: `PLAYHQ_GRADE_ID`

## How to Obtain API Credentials

### Official API Key
1. Contact your cricket association or PlayHQ directly
2. Request API access for your cricket club
3. Specify that you need access to fixture data for the East Division - Mamgain Shield

### Organization, Season, and Grade IDs
These IDs can typically be found:
1. In the URLs when browsing the PlayHQ website
2. In the API documentation provided by PlayHQ
3. By contacting PlayHQ support

## API Endpoints Being Used
We're currently trying these endpoints:

1. Organization fixtures:
   ```
   https://api.playhq.com/v1/organisations/{orgId}/fixtures
   ```

2. Grade-specific fixtures:
   ```
   https://api.playhq.com/v1/fixtures/grade/{gradeId}
   ```

3. Season fixtures:
   ```
   https://api.playhq.com/v1/seasons/{seasonId}/fixtures
   ```

## Fallback Mechanism
Until we have valid API credentials, the application will use locally stored fixture data to ensure users can always view the fixture information.

## Examples of How to Find IDs

### Finding the Organization ID
Look for it in URLs when browsing your organization's page on PlayHQ:
```
https://play.cricket.com.au/organisation/[YOUR_ORG_ID]/dashboard
```

### Finding the Season ID
Check the URL when viewing a specific season:
```
https://play.cricket.com.au/organisation/[ORG_ID]/season/[SEASON_ID]/dashboard
```

### Finding the Grade ID
This might be visible when viewing a specific grade/division:
```
https://play.cricket.com.au/competition/[COMP_ID]/grade/[GRADE_ID]/dashboard
```

## Next Steps
1. Contact PlayHQ or your cricket association to request an official API key
2. Look for the IDs in the PlayHQ website URLs as described above
3. Once you have the credentials, update the environment variables in your app