'use strict';

let forEach = Array.prototype.forEach;
let regexps = [
  'json$',
  'pdf$',
  'pbxproj$',
  'strings$',
  'storyboard$',
  'png$',
  'xib$',
];
let regexp = new RegExp(regexps.join('|'));
let filesUrlRegexp = /^https:\/\/github.com\/.+\/pull\/.+\/files.*$/;

function isFilesPage() {
  return filesUrlRegexp.test(window.location.href);
}

function hideMatchedElements() {
  if (isFilesPage() == false) {
    return;
  }
  var childDivs = document.getElementsByClassName('file-header js-file-header');
  forEach.call(childDivs, function(element) {
    let filePath = element.getAttribute('data-path');
    if (regexp.test(filePath)) {
      element.parentElement.style.display = 'none';
    }
  });
}

function observeContainer() {
  var timer = null;
  forEach.call(document.getElementsByClassName('js-diff-progressive-container'), function(element) {
    new MutationObserver(function() {
      if (timer != null) {
        window.clearTimeout(timer);
        timer = null;
      } else {
        timer = window.setTimeout(hideMatchedElements, 500);
      }
    }).observe(element, {childList: true});
  });
}

hideMatchedElements();
if (isFilesPage()) {
  observeContainer();
}

// Listen page transition event by pjax
document.addEventListener('pjax:end', function() {
  if (isFilesPage()) {
    hideMatchedElements();
    observeContainer();
  }
}, true);

