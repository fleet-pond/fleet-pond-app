# fleet-pond-app
Mobile Application for Fleet Pond Visitors in Hampshire, UK

## Instructions for development
Fleet Pond App is built using [Apache Cordova](https://cordova.apache.org/)

To install locally using NPM

Firstly do a GIT Checkout

`git clone https://github.com/fleet-pond/fleet-pond-app.git`

Do an NPM update

`npm update`

Get the Cordova package

`npm install -g cordova`

Then to see your results. Run

`cordova run browser`

NOTE: If you experience errors, such as 'No platforms added to this project',
when running the above command then try the following:

`cordova platform add browser`

The above looks like a potential difference between unix/windows in the
config.xml
