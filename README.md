# Auth0 Extensions

This repo handles the list of official extensions.

## Adding a new extension

You can use [Extensions Deploy](https://webtask.it.auth0.com/api/run/wt-centurion_javier-gmail_com-0/extensions-deploy?webtask_no_cache=1) for deploying new extensions.

![](https://cloud.githubusercontent.com/assets/302314/14961723/7719588a-1071-11e6-91e9-ef44b0356557.gif)

## Deploy a new version of the extension

A walk-through how to manually deploy a new version of a extension. Extensions are currently build on a developers machine and deployed by the developer by using the [Extensions Deploy](https://github.com/auth0/auth0-extensions-deploy) tool. This is not ideal and a CI system will eventually replace the manual steps of testing and deploying a new version.

### Manual Build

Preferred `yarn` version (`yarn -v`) is `1.3.2` and node version is `6.12.x` (Node 6 LTS).

1. Fetch the latest code from the `origin/master` branch.
2. `node -v` - check the current node version, the node version should be `6.12.x`!
3. `rm -rf node_modules disk build/bundle.js` - delete these folders before building.
4. `yarn install --ignore-engines` - install the packages.
5. `yarn run tests` - run the tests, no release should be pushed if tests do not pass!
6. Update the `version` in _package.json_ to the new [version](#versioning).
7. Update the `version` in _webtask.json_ to the new [version](#versioning).
8. `yarn run build`
9. `git add .` - three files should be changed `package.json`, `webtask.json`, `build/bundle.js` and optionally `yarn.lock`)
10. `get commit -m "release version x.x.x"`
11. `yarn run tag` - create a git tag with the `version` specified in the `package.json`.
12. `git push origin` - push the commit and tag.

### Manual Deploy

1. Go to [Extensions Deploy](https://goo.gl/bsyeMb) tool and authenticate.
2. Add the `webtask.json`.
3. Add the `build/bundle.js` file. This file will be renamed to the name of the extension + new version.
4. Upload the assets located in the `dist` folder. @toon and @sgmeyer upload all the files in that directory.
5. Continue, after a successful deployment automatically a PR is created. The created PR will update the `https://github.com/auth0/auth0-extensions/blob/master/extensions.json` file with the new version. This is only needed for a _minor_ and _major_ release. _Patch_ releases apply directly after deployment (The newly deployed version of the `bundle.js` file will be downloaded when the Webtask container is recycled).
6. Verify the generated PR and post it in the #crew-extensions-prs. Minor and Major releases will only become available when the PR is merged.

# Versioning

## Major

Introduce a new major version if there are breaking changes.

e.g. `2.3.3` > `3.0.0`;

User has to manually trigger the upgrade

## Minor

Introduce a minor version when new functionality is added without breaking changes.

e.g. `2.3.3` > `2.4.0`;

User has to manually trigger the upgrade

## Patch

Introduce a new patch version for bug fixes, without breaking changes.

e.g. `2.3.3` > `2.3.4`;

Patches don't need any manual intervention from dashboard administrators and after deployment are used by all customers.

# Extensions backlog

You can see the extensions backlog [here](https://trello.com/b/ZHpJjYKm/extensions).
