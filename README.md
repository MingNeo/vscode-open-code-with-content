# open-code-with-content

使用URL scheme打开vscode并打开带有内容的新文件

```html
<script>
  function encodeBase64(content) {
    return btoa(encodeURIComponent(content))
  }

  const vscodeUrl = `vscode://mingneo.vscode-open-code-with-content?content=${encodeBase64('Content Text')}&language=plaintext`
</script>

<a href="vscodeUrl">open vscode with content</a>
```
