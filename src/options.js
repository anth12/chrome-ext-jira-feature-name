var Options = function() {
    var sourceData = {
        key: 'DEMO-1234',
        summary: 'Issue "name" with some TEXT',
        type: "Story"
    };
    
    preview = document.getElementById('preview');

    Branch.loadOptions(function(){
        var modelElements = document.querySelectorAll('.value'),
            i,
            el;

        for (i = 0; i < modelElements.length; i++) {
            el = modelElements[i];

            if (Branch.options.hasOwnProperty(el.id)) {
                el.value = Branch.options[el.id];
                el.onchange = onModelChange;
            }
        }

        updatePreview();
    });

    function onModelChange(e) {
        var value = e.target.type == "checkbox" ? e.target.checked : e.target.value;

        Branch.updateOptions(e.target.id, value, updatePreview);
    }

    function updatePreview() {
        preview.innerText = Branch.format(sourceData);
    }
};

document.addEventListener("DOMContentLoaded", function() {
    new Options();
});
