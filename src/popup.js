var JiraToBranch = function() {
    var REQUEST_TEXT = 'jira_issue_name_request',
        self = this,
        containerBlock = document.getElementById('container'),
        errorBlock = document.getElementById('error'),
        copyBox = document.getElementById('copy-box'),
        reloadButton = document.getElementById('reload-button')
    ;

    self.init = function() {
        errorBlock.style.display = 'none';
        containerBlock.style.display = 'none';
        containerBlock.innerHTML = '';

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];

            chrome.tabs.sendMessage(tab.id, {text: REQUEST_TEXT}, function (response) {
                if (validateResponse(response)) {
                    renderNames(response);
                } else {
                    errorNoData(tab);
                }
            });

        });
    };

    function onCopyClick(e) {
        var btn = e.target;

        copyBox.value = btn.previousSibling.innerText;
        copyBox.select();
        document.execCommand('copy');

        btn.classList.add('copied');
        btn.innerText = 'ok';
        setTimeout(function(){
            btn.classList.remove('copied');
            btn.innerText = 'copy';
        }, 750);
    }

    function renderNames(list) {
        Branch.loadOptions(function(){
            var entryTemplate = document.createElement('div'),
                entry;

            entryTemplate.className = "entry";
            entryTemplate.innerHTML = '<div class="name"></div><div class="button copy">Copy</div>';

            for (var i = 0; i < list.length; i++) {
                entry = entryTemplate.cloneNode(true);
                entry.childNodes[0].innerText = Branch.format(list[i]);
                entry.childNodes[1].addEventListener('click', onCopyClick);
                containerBlock.appendChild(entry);
            }

            containerBlock.style.display = 'block';
        });
    }

    function validateResponse(response) {
        return response; //&& response.length;
    }

    function errorNoData(tab) {
        errorBlock.style.display = 'block';
        reloadButton.addEventListener('click', function(e){
            chrome.tabs.update(tab.id, {url: tab.url}, function(){
                window.close();
            });
        });
    }
};

document.addEventListener("DOMContentLoaded", function() {
    var app = new JiraToBranch();
    app.init();
});