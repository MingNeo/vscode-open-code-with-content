import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const uriHandler = vscode.window.registerUriHandler({
    handleUri(uri) {
      return handleOpenFiles(uri);
    },
  });
  context.subscriptions.push(uriHandler);

  return {
    handleUri: handleOpenFiles,
  };
}

const decodeBase64 = (data: string): string => {
  return Buffer.from(data, 'base64').toString('ascii');
  // return Buffer.from(data, 'base64').toString('utf8');
};

async function handleOpenFiles(uri: vscode.Uri) {
  try {
    const params = new URLSearchParams(uri.query);
    const contents = params.getAll('content');
    const languages = params.getAll('language') || 'plaintext';
    if (contents.length === 0) {
      vscode.window.showErrorMessage('URL中没有content参数');
      return;
    }
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('没有打开的工作区');
      return;
    }
    for (let i = 0; i < contents.length; i++) {
      const decodedContent = formatContent(decodeURIComponent(decodeBase64(contents[i])));
      if (!decodedContent.trim()) {
        continue;
      }
      const document = await vscode.workspace.openTextDocument({ content: decodedContent, language: languages[i] });
      await vscode.window.showTextDocument(document, { preview: false });
    }
  } catch (error) {
    vscode.window.showErrorMessage(`打开URI错误: ${error}`);
  }
}

function formatContent(content: string): string {
  return content.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export function deactivate() {}
