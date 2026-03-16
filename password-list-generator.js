(function () {
    'use strict';

    var countInput = document.getElementById('plgCount');
    var minLenInput = document.getElementById('plgMinLen');
    var maxLenInput = document.getElementById('plgMaxLen');
    var upperCheck = document.getElementById('plgUpper');
    var lowerCheck = document.getElementById('plgLower');
    var numbersCheck = document.getElementById('plgNumbers');
    var symbolsCheck = document.getElementById('plgSymbols');
    var noAmbiguousCheck = document.getElementById('plgNoAmbiguous');
    var formatSelect = document.getElementById('plgFormat');
    var generateBtn = document.getElementById('plgGenerateBtn');
    var copyBtn = document.getElementById('plgCopyBtn');
    var downloadBtn = document.getElementById('plgDownloadBtn');
    var outputDiv = document.getElementById('plgOutput');
    var outputArea = document.getElementById('plgOutputArea');

    var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var LOWER = 'abcdefghijklmnopqrstuvwxyz';
    var NUMBERS = '0123456789';
    var SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';
    var AMBIGUOUS = /[0OIl1]/g;

    function buildCharset() {
        var charset = '';
        if (upperCheck.checked) charset += UPPER;
        if (lowerCheck.checked) charset += LOWER;
        if (numbersCheck.checked) charset += NUMBERS;
        if (symbolsCheck.checked) charset += SYMBOLS;
        if (noAmbiguousCheck.checked) charset = charset.replace(AMBIGUOUS, '');
        return charset;
    }

    function generatePassword(charset, minLen, maxLen) {
        if (!charset.length) return '';
        var len = minLen === maxLen ? minLen : minLen + Math.floor(secureRandom() * (maxLen - minLen + 1));
        var arr = new Uint32Array(len);
        crypto.getRandomValues(arr);
        var result = '';
        for (var i = 0; i < len; i++) {
            result += charset[arr[i] % charset.length];
        }
        return result;
    }

    function secureRandom() {
        var arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return arr[0] / (0xFFFFFFFF + 1);
    }

    function generateList() {
        var charset = buildCharset();
        if (!charset) {
            alert('Please select at least one character type.');
            return;
        }
        var count = Math.min(Math.max(parseInt(countInput.value) || 10, 1), 1000);
        var minLen = Math.min(Math.max(parseInt(minLenInput.value) || 12, 4), 128);
        var maxLen = Math.min(Math.max(parseInt(maxLenInput.value) || 16, minLen), 128);
        var format = formatSelect.value;
        var passwords = [];

        for (var i = 0; i < count; i++) {
            passwords.push(generatePassword(charset, minLen, maxLen));
        }

        var output = '';
        if (format === 'plain') {
            output = passwords.join('\n');
        } else if (format === 'csv') {
            output = 'index,password\n';
            passwords.forEach(function (p, i) {
                output += (i + 1) + ',"' + p.replace(/"/g, '""') + '"\n';
            });
        } else if (format === 'json') {
            output = JSON.stringify(passwords, null, 2);
        }

        outputArea.value = output;
        outputDiv.style.display = 'block';
    }

    generateBtn.addEventListener('click', generateList);

    copyBtn.addEventListener('click', function () {
        if (!outputArea.value) { generateList(); }
        navigator.clipboard.writeText(outputArea.value).then(function () {
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = copyBtn.dataset.orig || 'Copy'; }, 2000);
        });
    });

    downloadBtn.addEventListener('click', function () {
        if (!outputArea.value) { generateList(); }
        var format = formatSelect.value;
        var ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'txt';
        var mime = format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/plain';
        var blob = new Blob([outputArea.value], { type: mime });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'passwords.' + ext;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Auto-generate on load
    generateList();
}());
