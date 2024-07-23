document.addEventListener("DOMContentLoaded", function() {
	// Check if the necessary elements are present
	var expressionElement = document.getElementById("expression");
	var contextElement = document.getElementById("context");
	var resultElement = document.getElementById("result");
	if (!expressionElement || !contextElement) {
		console.warn("Required elements (#expression or #context) not found in the DOM.");
		return; // Exit if elements are not found
	}
	var expressionTextArea = CodeMirror.fromTextArea(expressionElement, {
		lineNumbers: true,
		mode: "javascript",
		theme: "railscasts",
		tabSize: 4,
		indentUnit: 4,
		indentWithTabs: true
	});
	var contextTextArea = CodeMirror.fromTextArea(contextElement, {
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
			resultTextArea = CodeMirror.fromTextArea(resultElement, {
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
	['touchstart', 'touchmove', 'wheel', 'mousewheel'].forEach(event => {
		addPassiveEventListener(document, event, () => {});
	});
	// Attach the evaluateExpression function to the form submit event
	document.getElementById("expressionForm").onsubmit = evaluateExpression;
});