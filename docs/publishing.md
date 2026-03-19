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

You may also install a development version of Brook using Firefox Developer Edition ([see instruction](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox?as=u&utm_source=inproduct#w_what-are-my-options-if-i-want-to-use-an-unsigned-add-on-advanced-users)).  Once checks have been disabled, you can just drop the zip file on the manage extensions page or click the gear icon, and choose `Install Add-on From File…`.