/**
 * Content script is run in the context of web pages
 */
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'jira_issue_name_request') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var data = [];
        
        data.push({
        	key: document.getElementById('key-val').innerText, 
        	summary: document.getElementById('summary-val').innerText,
            type: document.getElementById('type-val').innerText
        });

        var parentIssue = document.getElementById('parent_issue_summary');
        if(parentIssue) {
            data.push({
                key: document.getElementById('key-val').innerText, 
                summary: document.getElementById('parent_issue_summary').innerText,
                type: document.getElementById('type-val').innerText
            });
        }
        sendResponse(data);
    }
});

