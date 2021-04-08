# Auth Portal for customer

## Prerequisites

- Edit the URLS.
  - `serviceURL` is the one is shown in the output of `sls deploy` and
    `sls info` if you already deployed earlier
  - For ` authenticationURL` you need to replace APP_CLIENT_ID which you get
    from the cognito console in "General settings / App Clients", and
    `DOMAIN` can be found under "App Integration"
- Start the webserver via `npm start` one level above

## Usage

- Go to http://localhost:3000
- Authenticate by clicking on the authenticate link
- Call the service by clicking the call service button
