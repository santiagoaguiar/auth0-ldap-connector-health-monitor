"use latest";

const request = require('request');
const url     = require('url');

module.exports = (ctx, req, res) => {
  const end = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  const connectionName = ctx.data.connection;
  if (!connectionName) {
    var wtUrl = url.format({
      protocol: 'https',
      host:     req.headers.host,
      pathname: req.url.split('?').slice(0,1)[0]
    });

    return end(200, {message: "Use this url: '" + wtUrl + "?connection={MY-LDAP-CONNECTOR}' for monitoring your AD/LDAP connector."});
  }

  const domain = ctx.data.AUTH0_DOMAIN;
  const clientId = ctx.data.AUTH0_CLIENT_ID;
  const clientSecret = ctx.data.AUTH0_CLIENT_SECRET;
  if (!domain || !clientId || !clientSecret) {
    return end(500, { message: 'Auth0 API v2 credentials or domain missing.' });
  }

  const authenticate = (callback) => {
    var body = {
      'client_id':     clientId,
      'client_secret': clientSecret,
      'audience':      `https://${domain}/api/v2/`,
      'grant_type':    'client_credentials',
      'scope':         'read:connections'
    };

    const tokenUrl = `https://${domain}/oauth/token`;
    console.log('Authenticating:', tokenUrl);

    request.post({ url:  tokenUrl, form: body }, (err, resp, body) => {
      if (err) return callback(err);
      if (resp.statusCode === 404) return callback(new Error('Unknown Auth0 Client ID.', 404));
      if (resp.statusCode.toString().substr(0, 1) !== '2') return callback(new Error(body, resp.statusCode));
      callback(null, JSON.parse(body)['access_token']);
    });
  };

  const monitor = () => {
    authenticate((err, token) => {
      if (err) {
        console.log('Error authenticating:', err.message);
        return end(500, { message: 'Error authenticating to the Auth0 API.', details: err.message });
      }

      const connectionsUrl = `https://${domain}/api/v2/connections`;
      request.get({
        url: connectionsUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        qs: {
          name: connectionName,
          page: 0,
          per_page: 1,
          fields: "id,strategy"
        },
        json: true
      }, (err, resp, body) => {
        if (err) return end(500, { message: 'Error calling the monitoring endpoint.', details: err.message });
        else if (resp.statusCode !== 200) return end(400, { message: 'Failed to obtain connection information.' });
        else if (!body || body.length === 0) return end(400, { message: 'The connection does not exist.' });

        const connection = body[0];
        if (connection.strategy !== 'ad' && connection.strategy !== 'auth0-adldap') {
          return end(400, { message: 'The connection is not an AD/LDAP connection.' });
        }

        const monitorUrl = `https://${domain}/api/v2/connections/${encodeURIComponent(connection.id)}/status`;
        console.log('Monitoring:', monitorUrl);
        request.get({ url: monitorUrl, headers: { 'Authorization': `Bearer ${token}` } }, (err, resp, body) => {
          if (err) return end(500, { message: 'Error calling the monitoring endpoint.', details: err.message });
          else if (resp.statusCode === 404) return end(400, { message: 'The connector is offline.' });
          else if (resp.statusCode === 200) return end(200, { message: 'The connector is online.' });
          else return end(500, { message: 'Unexpected status received from Auth0.', statusCode: resp.statusCode });
        });
      });
    });
  };

  monitor();
};
