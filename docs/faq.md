# Fleet Pond - Companion App

[Home](./index.html) &nbsp; &nbsp; [Help Guide](./help.html) &nbsp; &nbsp; [FAQ](./faq.html) &nbsp; &nbsp; [Fleet Pond website](http://fleetpond.org.uk/)

_**WARNING: We plan to change the way that the app data is stored for the app, hopefully before the end of the year. We recommend that you wait to create your app until that has been done as it will make it far easier and give you more customisation options.**_

## F.A.Q.

If you have questions that are not covered below you can reach out to us at [enquiries.fleetpondapp@gmail.com](mailto:enquiries.fleetpondapp@gmail.com).

**Q: What hardware do I need to create an app like this for my park / pond / nature reserve?**

A: You will need a reasonable computer, and a phone with GPS (if you want to record routes). To release to the Apple App Store you will have to use a Mac. We recommend having at least one physical device for each platform that you are developing for so that you can test it on a real device.

**Q: How do I run the app?**

A: The code for the fleet pond companion app is available on Github [here](https://github.com/fleet-pond/fleet-pond-app). For the latest instructions on how to run it check out the [README.md](https://github.com/fleet-pond/fleet-pond-app/blob/develop/README.md) file that is in the base directory of the repository.

**Q: What data do I need to collect / create for the app?**

A: We collected / created the following for the Fleet Pond app:

* App icon
* Splash screen
* Routes
  * Route name (unique identifier)
  * Route colour in hex
  * Length in KM
  * Length in miles
  * Route description
  * Array of GPS locations
* Point of interest
  * ID (unique identifier)
  * GPS location
  * Array of images
  * Thumbnail image
  * Routes that can access the POI (using route unique identifier)
  * Description
* Bench
  * GPS location
* Gallery
  * Image
  * Photographer name
  * Photo title
* Application text

**Q: How did you collect the route data?**

A: Walks around Fleet Pond were tracked using the Fitbit phone app (free to use, available on Andoid, iOS and Windows Phone). The data can then be exported from Fitbit on their website, which can then be converted to the format used in the Fleet Pond app.

**Q: How do I change the content for my app?**

A: You should fork the Fleet Pond app [repository](https://github.com/fleet-pond/fleet-pond-app). From there you can change the content for your app.

* App icons are stored in /res/icon/android/ and /res/icon/ios/. The multiple resolutions are required for different phone screen resolutions, you should keep them the same resolution.
* Splash screens are stored in /res/screen/android/ and /res/screen/ios/. The multiple resolutions are required for different phone screen resolutions, you should keep them the same resolution.
* Routes are set in /www/js/trails.js and the coordinates are set in /www/js/coordinates.js.
* Point of interest data is stored in /www/js/points-of-interest.js.
* Bench locations are stored in /www/js/coordinates.js.
* Gallery information is stored in /www/js/gallery.js.
* Application text is stored in /www/index.html and /www/js/pond.js.
* Images should be added to the /www/images/ directory.

**Q: How do I release my app for Android and iOS app stores?**

A: You can create the release files using Cordova on the computer that you develop the app on. They will then need to be uploaded to the stores that you want to release to.

To release to the Android Play Store you will need use the [Google Play Console](https://developer.android.com/distribute/console/). It currently has a one time cost of $25 to create an account on which you can release multiple apps.

To release to the Apple App Store you will need to use [Itunes Connect](https://itunesconnect.apple.com/). It currently costs $99 annually to create an account on which you can release multiple apps.

From those sites you can manage all aspects of the release of your app to each store.

**Q: Can you host my app for me so I don't have to pay the fee?**

A: Unfortunatly not, this is against the Apple Store Guidelines and would get the application rejected upon review.

**Q: I need help, can you make my new app for me?**

A: For queries you can reach out to [enquiries.fleetpondapp@gmail.com](mailto:enquiries.fleetpondapp@gmail.com) but due to the time commitment required we will not be able to write your app for you. If you want more significant help contact [matt@weeks.codes](mailto:matt@weeks.codes) who was on the team that developed the Fleet Pond App.

**Q: I want features that are not currently available in the app, can you add them?**

A: Please email us your suggestions to [enquiries.fleetpondapp@gmail.com](mailto:enquiries.fleetpondapp@gmail.com) but we can't promise we will have time to implement them, if it is a repeated suggestion we will try. If you want help implementing something for your app you can also contact [matt@weeks.codes](mailto:matt@weeks.codes) who was on the team that developed the Fleet Pond App.
