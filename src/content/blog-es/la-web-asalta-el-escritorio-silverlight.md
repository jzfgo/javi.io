---
title: "La web asalta el escritorio: Silverlight"
description: "Microsoft Silverlight, el rival de Adobe AIR basado en WPF y XAML, analizado desde la perspectiva de un desarrollador web acostumbrado a las tecnologías abiertas."
date: 2008-03-25
translationKey: "web-desktop-silverlight"
---

Aunque como tal, Silverlight es realmente un plug-in para navegador (es ***el Flash de Microsoft***, hablando rápido y mal), WPF (Windows Presentation Foundation), la tecnología sobre la que está creado, sí que podría situarse al mismo nivel que [AIR](/es/blog/la-web-asalta-el-escritorio-adobe-air).

Esto es porque WPF permite la creación de RIA (Rich Internet Applications) de escritorio a partir de cualquier aplicación Silverlight, [de hecho es —aparentemente— muy sencillo](http://weblogs.asp.net/scottgu/pages/silverlight-tutorial-part-8-creating-a-digg-desktop-application-using-wpf.aspx).

Al igual que [Adobe AIR](/es/blog/la-web-asalta-el-escritorio-adobe-air) y [Mozilla Prism](/es/blog/la-web-asalta-el-escritorio-mozilla-prism), Silverlight es multi-navegador y multi-plataforma, se encuentra disponible para Windows y Mac y **cuenta con una versión para GNU/Linux** ([Moonlight](http://www.mono-project.com/Moonlight)) actualmente en desarrollo.

Según comenta la propia Microsoft, una de sus ventajas frente a Flash, Flex o AIR es que es un poco más "accesible" y "seguro", ya que una aplicación Silverlight usa [XAML](http://es.wikipedia.org/wiki/XAML) (eXtensible Application Markup Language) para la creación del interfaz, **Javascript** para efectos dinámicos y WPF para la presentación de contenido multimedia. Es decir, lo que el Silverlight procesa es "texto plano" en lugar de código binario, como ocurre con Flash.

Ahora bien, esta simplicidad que vista desde el prisma de la seguridad y accesibilidad parece una ventaja, desde el punto de vista de la experiencia de usuario, a mi modo de ver, se descubre como una gran desventaja. Y es que a día de hoy, comparar cualquier aplicación Flash/AIR con una Silverlight/WPF es igual que —como decimos por aquí— **comparar a dios con un gitano**.

Por otra parte, la simplicidad en su desarrollo [brilla por su ausencia](http://weblogs.asp.net/scottgu/pages/silverlight-tutorial-part-1-creating-quot-hello-world-quot-with-silverlight-2-and-vs-2008.aspx), sinceramente. Para empezar, tengo que aprender un nuevo lenguaje de marcado, XAML, nuevos programas de diseño para la generación de los gráficos y demás (WPF), en este caso contenidos en la *suite* [Microsoft Expression](http://www.microsoft.com/spain/expression/expression-studio/default.mspx) y, si realmente quiero desarrollar algo potente, [pasarme a Visual Studio y .NET](http://www.xaml.net/getting_started.htm) que, como desarrollador web LAMP que soy, desconozco totalmente.

Para más INRI, todas las aplicaciones arriba mencionadas **son de pago y sus formatos más cerrados que el *fistro* de la Barbie**, lo que prácticamente me obliga a pasar por caja.

En el otro lado, y si me pongo tacaño, podría desarrollar una aplicación AIR de coste cero, utilizando [The GIMP](http://www.gimp.org/) en lugar de Photoshop para la generación de imágenes, [Inkscape](http://www.inkscape.org/) para gráficos vectoriales, un simple editor de texto para desarrollar el CSS, Javascript o Actionscript e incluso [MTASC](http://www.mtasc.org/) para generar archivos Flash sin necesidad de utilizar el programa de Adobe.

Obviamente esto sería extremo, pero en cualquier caso, con AIR o Flash estaría utilizando lenguajes, aplicaciones y una dinámica de trabajo que ya conozco y que además, me sirven en otras áreas.

En conclusión, tanto desde el punto de vista de desarrollador como de usuario, me quedo con la oferta de Adobe sobre la de Microsoft.

Por supuesto, tanto si eres desarrollador como usuario, te insto a que juzgues por ti mismo/a y **saques tus propias conclusiones**.

Más info: [Introducción a WPF/E (nombre en código)](http://www.microsoft.com/spanish/msdn/articulos/archivo/150107/voices/bb190632.mspx), [Microsoft Silverlight](http://en.wikipedia.org/wiki/WPF/E), [Silverlight Demos](http://www.vectorform.com/silverlight/)
