// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fs from 'fs';
import * as vscode from 'vscode';
import { functions } from './data';

var extcon: vscode.Uri;
var docsview: vscode.WebviewPanel;

class XlibDocsHover implements vscode.HoverProvider {
	public provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
		const hoverRange = document.getWordRangeAtPosition(position);
		const hoverText = document.getText(hoverRange);
		const desc = functions.get(hoverText);
		if (docsviewActive && desc) {
			fs.readFile(vscode.Uri.joinPath(extcon, desc.split('#')[0]).fsPath, (err, data) => { 
				if (err) { 
					vscode.window.showErrorMessage(err.message);
				} else {
					docsview.webview.html = data.toString();
				}
			});
		}
		return desc? new vscode.Hover(desc) : undefined;
	}
}

class XlibParameterHint implements vscode.SignatureHelpProvider {
	public provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext): vscode.ProviderResult<vscode.SignatureHelp> {
		return new vscode.SignatureHelp();
	}
} 

const C_MODE : vscode.DocumentSelector = { language: 'c', scheme: 'file' };
const CPP_MODE : vscode.DocumentSelector = { language: 'cpp', scheme: 'file' };

var docsviewActive: boolean = false;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	extcon = vscode.Uri.joinPath(context.extensionUri, 'xlib');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-xlib-function-index" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-xlib-function-index.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vscode-xlib-function-index!');
	});
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(vscode.languages.registerHoverProvider(C_MODE, new XlibDocsHover()));
	context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(C_MODE, new XlibParameterHint(), '(', ','));
	context.subscriptions.push(vscode.languages.registerHoverProvider(CPP_MODE, new XlibDocsHover()));
	context.subscriptions.push(vscode.languages.registerSignatureHelpProvider(CPP_MODE, new XlibParameterHint(), '(', ','));
	
	context.subscriptions.push(vscode.commands.registerCommand('vscode-xlib-function-index.openDocs', () => {
		docsview = vscode.window.createWebviewPanel('xlib-docs', 'xlib function reference', vscode.ViewColumn.Beside);
		docsviewActive = true;
		docsview.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				docsviewActive = false;
			},
			null,
			context.subscriptions
		);
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
