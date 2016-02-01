// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'jira_issue_name_request') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        console.log('sending data');
        var data = [],
        	keyVal = document.getElementById('key-val'), 
        	parentIssue = document.getElementById('parent_issue_summary'), 
        	summaryVal = document.getElementById('summary-val');

        if (parentIssue) {
        	data.push(parentIssue.innerText);
        }

        if (keyVal && summaryVal) {
        	data.push(keyVal.innerText + ' ' + summaryVal.innerText);
        }

        sendResponse(data);
    }
});