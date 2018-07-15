Publishing Brook
================

In order to publish Brook, you must build a zip file:

```
yarn package
```

Upload the zip file from the `web-ext-artifacts` directory to mozilla:

https://addons.mozilla.org/en-US/developers/addon/brook/

After uploading the zip file, Brook will be available as an addon.

Installing Self Hosted Versions
-------------------------------

You may also upload a self hosted version of Brook.  A signed `xpi` will be 
available.

To install, open firefox and visit `about:addons`.  

Click the gear icon, and choose `Install Add-on From File…`.