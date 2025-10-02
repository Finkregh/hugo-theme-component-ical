---
title: Demo Page for ical events from hugo front matter
---
* [Articles]({{< relref "articles/" >}})
* [Events]({{< relref "events/" >}})
* [About]({{< relref "about/" >}})

This demo site shows regular pages (Articles) as well as pages with ical data (Events).

It uses [hugo-theme-dev](https://github.com/foundata/hugo-theme-dev) in combination with the ical component.

The only change required was to copy the `baseof.html` [from the theme](https://github.com/foundata/hugo-theme-dev/blob/v1.0.0/layouts/baseof.html) into [this site](https://github.com/Finkregh/hugo-theme-component-ical/blob/main/.github/exampleSite/layouts/_default/baseof.html) and add the javascript part to show the ical files on the site:

```html
  <!-- Start calendar javascript -->
    {{ if and (.OutputFormats.Get "Calendar") (eq .Type "events") }}
    <meta http-equiv="Content-Security-Policy" content="font-src data:" />
    {{ partial "events/javascript.html" . }}
    {{ end }}
<!-- End calendar javascript -->
 ```

Debugging has been enabled in hugo-theme-dev, which is the big part in the end of each page. It is not relevant to the ical component, but might be helpful to understand the underlying mechanisms.
