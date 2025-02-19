document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('upload-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('csv-file');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const csv = e.target.result;
                const json = csvToJson(csv);
                const limitedJson = json.slice(0, 2);
                const jsonOutput = document.getElementById('json-output');
                jsonOutput.textContent = JSON.stringify(limitedJson, null, 2);
                jsonOutput.style.display = 'block'; // Show the pre element
                document.getElementById('save-button').style.display = 'block'; // Show the save button
                document.getElementById('save-button').onclick = function() {
                    saveJson(json, 'sdxl_styles_marc_k3nt3l.json');
                    showNotification();
                };
            };
            reader.readAsText(file);
        }
    });

    function csvToJson(csv) {
        const lines = csv.split('\n');
        const result = [];
        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip the header
            const line = lines[i].trim();
            if (line === '' || line.startsWith('>>>>>>')) {
                continue; // Skip empty lines and lines starting with >>>>>>
            }
            const [style, prompt, negative_prompt] = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Split by comma outside quotes
            if (style && prompt && negative_prompt) {
                result.push({
                    name: style.replace('Style: ', '').trim(),
                    prompt: prompt.trim().replace(/"/g, ''), // Remove extra quotes
                    negative_prompt: negative_prompt.trim().replace(/"/g, '') // Remove extra quotes
                });
            }
        }
        return result;
    }

    function saveJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    function showNotification() {
        const notification = document.getElementById('notification');
        notification.style.display = 'block';
        document.getElementById('ok-button').onclick = function() {
            notification.style.display = 'none';
        };
    }
});