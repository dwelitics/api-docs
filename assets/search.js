(function () {
  var input = document.getElementById('q');
  var results = document.getElementById('results');
  var count = document.getElementById('count');
  var entries = [];

  function render(list, query) {
    results.textContent = '';
    count.textContent = query === ''
      ? entries.length + ' page(s). Type to filter.'
      : list.length + ' of ' + entries.length + ' page(s) match "' + query + '".';
    for (var i = 0; i < list.length && i < 200; i++) {
      var e = list[i];
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.setAttribute('href', e.href);
      a.textContent = e.title;
      li.appendChild(a);
      if (e.summary) {
        var span = document.createElement('span');
        span.className = 'note';
        span.textContent = ' — ' + e.summary;
        li.appendChild(span);
      }
      results.appendChild(li);
    }
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    if (q === '') { render(entries, ''); return; }
    render(entries.filter(function (e) { return e.haystack.indexOf(q) !== -1; }), input.value.trim());
  }

  fetch('assets/search-index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      entries = data.map(function (e) {
        e.haystack = (e.title + ' ' + e.summary + ' ' + e.keywords).toLowerCase();
        return e;
      });
      render(entries, '');
      input.addEventListener('input', filter);
      input.removeAttribute('disabled');
    })
    .catch(function () {
      count.textContent = 'The search index did not load. Opening this tree straight off disk ' +
        'blocks the fetch in most browsers — serve it over HTTP, or use the API reference index.';
    });
})();
