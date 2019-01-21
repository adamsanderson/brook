Publishing Brook
================

In order to publish Brook, you must build a zip file:

```
yarn package
```

Upload the versioned zip file from the `web-ext-artifacts` directory to mozilla:

https://addons.mozilla.org/en-US/developers/addon/brook-feed-reader/versions/submit/

The source if required is archived in `brook-src.zip`.

After uploading the zip files, Brook will be available as an addon.

Installing Self Hosted Versions
-------------------------------

You may also upload a self hosted version of Brook.  A signed `xpi` will be 
available.

To install, open firefox and visit `about:addons`.  

Click the gear icon, and choose `Install Add-on From File…`.