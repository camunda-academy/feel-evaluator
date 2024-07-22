var expressionTextArea = CodeMirror.fromTextArea(document.getElementById("expression"), {
	lineNumbers: true,
	mode: "javascript",
	theme: "railscasts",
	tabSize: 4,
	indentUnit: 4,
	indentWithTabs: true
});
var contextTextArea = CodeMirror.fromTextArea(document.getElementById("context"), {
	lineNumbers: true,
	mode: "javascript",
	theme: "railscasts",
	tabSize: 4,
	indentUnit: 4,
	indentWithTabs: true
});

var resultTextArea;

async function evaluateExpression(event) {
	event.preventDefault();    
	
	// Update the textareas with the current values from the CodeMirror instances
	document.getElementById('expression').value = expressionTextArea.getValue();
	document.getElementById('context').value = contextTextArea.getValue();

	const expressionField = document.getElementById('expression').value;
	const contextField = document.getElementById('context').value;

	const response = await fetch('https://feel.upgradingdave.com/api/v1/feel/evaluate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"expression": expressionField,
			"context": JSON.parse(contextField),
			"metadata": {"source": "camunda-academy"}
		})
	});

	const result = await response.json();
	
	document.getElementById('result').value = JSON.stringify(result.result, null, 2);       
	document.getElementById('warnings').innerText = JSON.stringify(result.warnings, null, 2);
	document.getElementById('error').innerText = JSON.stringify(result.error, null, 2);

	if (resultTextArea) {
		// Update the existing CodeMirror instance for the result textarea
		resultTextArea.setValue(document.getElementById('result').value);
	} else {
		// Create a new CodeMirror instance for the result textarea
		resultTextArea = CodeMirror.fromTextArea(document.getElementById("result"), {
			lineNumbers: true,
			mode: "javascript",
			theme: "railscasts",
			tabSize: 4,
			indentUnit: 4,
			indentWithTabs: true,
			autoRefresh: true,
			readOnly: true
		});
	}
}        

// Patch CodeMirror to use passive event listeners for scroll-blocking events
function addPassiveEventListener(target, type, listener, options = {}) {
	options.passive = true;
	target.addEventListener(type, listener, options);
}

document.addEventListener("DOMContentLoaded", function() {
	['touchstart', 'touchmove', 'wheel', 'mousewheel'].forEach(event => {
		addPassiveEventListener(document, event, () => {});
	});
});