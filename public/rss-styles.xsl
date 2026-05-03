<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="zh">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> — RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:'Inter',system-ui,sans-serif;background:#0a0a0c;color:#e5e7eb;min-height:100vh}
          .container{max-width:48rem;margin:0 auto;padding:2rem 1.25rem}
          .header{text-align:center;padding:3rem 0 2rem;border-bottom:1px solid rgba(255,255,255,.1)}
          .header .badge{display:inline-block;padding:.35rem .85rem;border-radius:9999px;background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);color:#93c5fd;font-size:.75rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}
          .header h1{font-size:1.75rem;font-weight:700;color:#fff;margin-bottom:.5rem}
          .header p{color:#9ca3af;font-size:.95rem;line-height:1.7}
          .header a{color:#93c5fd;text-decoration:underline;text-underline-offset:3px}
          .items{margin-top:2rem}
          .item{display:block;padding:1.25rem 1.5rem;margin-bottom:.75rem;border:1px solid rgba(255,255,255,.08);border-radius:1.25rem;background:rgba(40,40,40,.5);backdrop-filter:blur(12px);transition:all .2s ease;text-decoration:none;color:inherit}
          .item:hover{background:rgba(50,50,50,.7);border-color:rgba(255,255,255,.14);transform:translateY(-2px)}
          .item h2{font-size:1.1rem;font-weight:600;color:#fff;margin-bottom:.35rem}
          .item .meta{font-size:.82rem;color:#6b7280;margin-bottom:.5rem}
          .item .desc{font-size:.9rem;color:#9ca3af;line-height:1.65}
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <span class="badge">RSS Feed</span>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p>
              这是一个 RSS 订阅源。你可以将此页面的 URL 复制到 RSS 阅读器中订阅更新。
              <br/>
              <a href="{/rss/channel/link}">← 返回网站</a>
            </p>
          </header>
          <div class="items">
            <xsl:for-each select="/rss/channel/item">
              <a class="item" href="{link}" target="_blank">
                <h2><xsl:value-of select="title"/></h2>
                <div class="meta"><xsl:value-of select="pubDate"/></div>
                <xsl:if test="description != ''">
                  <div class="desc"><xsl:value-of select="description"/></div>
                </xsl:if>
              </a>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
