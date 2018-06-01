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

## Building Android App

Firstly before building Android app. You will need to install the following:

* Android Studio (https://developer.android.com/studio/)
* A suitable Android Emulator image (Android Studio -> Tools -> Android -> AVD Manager)
* Configured ANDROID_HOME environment variable e.g. ANDROID_HOME=C:\Users\<username>\AppData\Local\Android\sdk

How to add Android platform

`cordova platform add android`

Install GeoLocation plugin

`cordova plugin add cordova-plugin-geolocation`

Then to see your results in android emulator. Run

`cordova run android`

Build the android debug apk

`cordova build android`




