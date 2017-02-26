skyacademy-release-key.keystore password = webd1234


BUILD:

cordova build --release android

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk seung

zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk

