Publishing Brook
================

Brook is currently an unlisted addon.  In order to use Brook in Firefox, you must build a zip file:

```
yarn package
```

Upload the zip file from the `web-ext-artifacts` directory to mozilla:

https://addons.mozilla.org/en-US/developers/addon/brook/versions/submit/upload-unlisted

After uploading the zip file, a signed `xpi` file will be available for download.

Installing Brook
----------------

Open firefox and visit `about:addons`.  

Click the gear icon, and choose `Install Add-on From File…`.