document.querySelectorAll('table').forEach(function (table) {
  var headers = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) {
    return th.textContent;
  });
  table.querySelectorAll('tbody tr').forEach(function (row) {
    Array.prototype.forEach.call(row.children, function (cell, index) {
      cell.setAttribute('data-label', headers[index] || '');
    });
  });
});
