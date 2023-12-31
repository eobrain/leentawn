/* global $uri, $page */

// import { parse } from 'https://cdn.jsdelivr.net/npm/fast-html-parser'
import { parse } from 'https://esm.run/fast-html-parser@1.0.1'

// const proxied = u => 'https://test.cors.workers.dev/?' + u
const proxied = u => 'https://corsproxy.io/?' + encodeURIComponent(u)

function handleText (text) {
  $page.innerText = text
}

function walkTree ({ tagName, rawText, childNodes }) {
  switch (tagName) {
    case 'p': {
      const p = document.createElement('p')
      p.innerText = rawText
      $page.appendChild(p)
      break
    }
  }
  for (const child of childNodes) {
    walkTree(child)
  }
}

function handleHtml (text) {
  const root = parse(text)
  walkTree(root)
}

async function go (uri) {
  const response = await fetch(proxied(uri))
  const contentType = response.headers.get('Content-Type')
  const mime = contentType.split(/[ ;]/)[0]
  const text = await response.text()
  switch (mime) {
    case 'text/html':
      handleHtml(text)
      break
    default:
      handleText(text)
      break
  }
}

$uri.onkeydown = event => {
  if (event.keyCode === 13) {
    go(event.currentTarget.value)
  }
}
