---
title: "The Web Storms the Desktop: Silverlight"
description: "Microsoft Silverlight — the Adobe AIR rival built on WPF and XAML — reviewed from the perspective of a web developer accustomed to open technologies."
date: 2008-03-25
translationKey: "web-desktop-silverlight"
---

Strictly speaking, Silverlight is really a browser plug-in (it's **_Microsoft's Flash_**, to put it bluntly), but WPF (Windows Presentation Foundation) — the technology it's built on — could legitimately be placed on the same level as [AIR](/en/blog/the-web-storms-the-desktop-adobe-air).

That's because WPF allows desktop RIAs (Rich Internet Applications) to be created from any Silverlight application — and [apparently it's quite straightforward](http://weblogs.asp.net/scottgu/pages/silverlight-tutorial-part-8-creating-a-digg-desktop-application-using-wpf.aspx).

Like [Adobe AIR](/en/blog/the-web-storms-the-desktop-adobe-air) and [Mozilla Prism](/en/blog/the-web-storms-the-desktop-mozilla-prism), Silverlight is cross-browser and cross-platform — available for both Windows and Mac — and **has a GNU/Linux version** ([Moonlight](http://www.mono-project.com/Moonlight)) currently in development.

According to Microsoft, one of its advantages over Flash, Flex, or AIR is that it's somewhat more "accessible" and "secure": a Silverlight application uses [XAML](http://es.wikipedia.org/wiki/XAML) (eXtensible Application Markup Language) for the interface, **Javascript** for dynamic effects, and WPF for multimedia content. In other words, what Silverlight processes is "plain text" rather than binary code, as is the case with Flash.

That said, this simplicity — which from a security and accessibility standpoint looks like an advantage — reveals itself, in my view, as a significant disadvantage when it comes to user experience. At this point in time, comparing any Flash/AIR application to a Silverlight/WPF one is like comparing chalk and cheese.

On top of that, simplicity of development is [nowhere to be seen](http://weblogs.asp.net/scottgu/pages/silverlight-tutorial-part-1-creating-quot-hello-world-quot-with-silverlight-2-and-vs-2008.aspx), honestly. For starters, I'd need to learn a new markup language (XAML), new design tools for generating graphics (WPF) — in this case bundled in the [Microsoft Expression](http://www.microsoft.com/spain/expression/expression-studio/default.mspx) suite — and if I actually want to build something powerful, [switch to Visual Studio and .NET](http://www.xaml.net/getting_started.htm), which as a LAMP web developer I know nothing about.

To make matters worse, all the applications mentioned above **are commercial, and their formats are more locked down than a bank vault**, which basically forces me to open my wallet.

On the other side of the fence, if I wanted to go the free route, I could build an AIR application at zero cost — using [The GIMP](http://www.gimp.org/) instead of Photoshop for image creation, [Inkscape](http://www.inkscape.org/) for vector graphics, a simple text editor for CSS, Javascript, or Actionscript, and even [MTASC](http://www.mtasc.org/) to generate Flash files without needing Adobe's software.

That would be an extreme approach, obviously, but in any case, with AIR or Flash I'd be using languages, applications, and a workflow I already know — and that also serve me in other areas.

In conclusion, both as a developer and as a user, I'll take Adobe's offering over Microsoft's any day.

Of course, whether you're a developer or a user, I encourage you to judge for yourself and **draw your own conclusions**.

More info: [Introduction to WPF/E (codename)](http://www.microsoft.com/spanish/msdn/articulos/archivo/150107/voices/bb190632.mspx), [Microsoft Silverlight](http://en.wikipedia.org/wiki/WPF/E), [Silverlight Demos](http://www.vectorform.com/silverlight/)
