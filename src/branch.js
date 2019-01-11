Branch = {
    options: {
        keyCase: "upper",
        keyDelimiter: "-",
        delimiter: "-",
        summaryCase: "lower",
        summaryDelimiter: "-",
        maxLength: 100,
        ignoredPattern: null,
        typeMap: {
            'feature': ['story', 'epic', 'improve', 'change', 'task'],
            'bugfix': ['bug', 'defect'],
            'tech': ['tech'],
            'hotfix': ['support']
        }
    },

    /**
     * Formats source key-summary string using passed options.
     *
     * @param {object} options
     * @param {object} source
     *
     * @returns {string}
     */
    format: function (source) {
        var result = '';
        
        for (var type in Branch.options.typeMap) {
            if (Branch.options.typeMap.hasOwnProperty(type)) {
                                
                var patterns = Branch.options.typeMap[type];
                
                for(var pattern in patterns) {
                    if(source.type.toLowerCase().indexOf(patterns[pattern]) > -1) {
                        result += `${type}/`;
                        break;
                    }
                }

                if(result.length)
                    break;
            }
        }

        var key = ignore(source.key, Branch.options.ignoredPattern);
        key = clean(key);
        key = fixCase(key, Branch.options.keyCase, Branch.options.keyDelimiter);

        var summary = ignore(source.summary, Branch.options.ignoredPattern);
        summary = clean(summary);
        summary = fixCase(summary, Branch.options.summaryCase, Branch.options.summaryDelimiter);

        if (key && summary) {
            result += key + Branch.options.delimiter + summary;
        } else if (key) {
            result += key;
        } else if (summary) {
            result += summary;
        } else {
            return "";
        }

        return result.slice(0, Branch.options.maxLength);
        
        function ignore(value, pattern) {

            if(pattern != null && pattern != '') {
                var regex = new RegExp(pattern, 'gi');
                value = value.replace(regex, '');
            }

            return value;
        }

        function fixCase(value, caseType, delimiter) {
            switch (caseType) {
                case 'lower':
                    value = value.toLowerCase();
                    break;

                case 'upper':
                    value = value.toUpperCase();
                    break;

                case 'capitalize':
                    value = value.toLowerCase().replace(/(?:^|\W)\w/g, function(a) {return a.toUpperCase();});
                    break;

                case 'hide':
                    value = '';
                    break;
            }

            return value.replace(/\s+/g, delimiter);
        }

        function clean(value) {
            value = value.replace(/['"]/g, '');
            value = value.replace(/\W/g, ' ');
            value = value.replace(/^\s|\s$/g, ''); 

            return value;
        }
    },

    updateOptions: function (key, value, callback) {
        Branch.options[key] = value;

        chrome.storage.sync.set(Branch.options, function () {
            if (typeof callback == 'function') {
                callback(Branch.options);
            }
        });
    },

    loadOptions: function (callback) {
        chrome.storage.sync.get(function (items) {

            for (var key in Branch.options) {
                if (items.hasOwnProperty(key)) {
                    Branch.options[key] = items[key];
                }
            }

            callback();
        });

    }

};
