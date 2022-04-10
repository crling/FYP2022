/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/packs/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/javascript/packs/datatable.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/javascript/packs/datatable.js":
/*!*******************************************!*\
  !*** ./app/javascript/packs/datatable.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

$(window).unload(function () {
  $.rails.enableFormElements($($.rails.formSubmitSelector));
});
$.fn.dataTable.ext.errMode = 'throw';

function union(setA, setB) {
  var _union = new Set(setA);

  var _iterator = _createForOfIteratorHelper(setB),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var elem = _step.value;

      _union.add(elem);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return _union;
}

function difference(setA, setB) {
  var _difference = new Set(setA);

  var _iterator2 = _createForOfIteratorHelper(setB),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var elem = _step2.value;

      _difference["delete"](elem);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return _difference;
}

function intersection(setA, setB) {
  var intersection = new Set();

  var _iterator3 = _createForOfIteratorHelper(setB),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var elem = _step3.value;

      if (setA.has(elem)) {
        intersection.add(elem);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return intersection;
}

function modify_set(option, id_set, new_ids) {
  var new_ids = Array.from(new_ids);
  var new_ids = new Set(new_ids);

  if (option > 0) {
    // add new ids
    return union(id_set, new_ids);
  } else {
    return difference(id_set, new Set(new_ids));
  }
}

$(function () {
  var _$$DataTable;

  var ids = new Set();
  var invis = window.gon.invis; //console.log($("#table_page").data('url'));

  var table = $("#table_page").DataTable((_$$DataTable = {
    fixedColumns: true
  }, _defineProperty(_$$DataTable, "fixedColumns", {
    leftColumns: 3,
    rightColumns: 1
  }), _defineProperty(_$$DataTable, "processing", true), _defineProperty(_$$DataTable, "serverSide", true), _defineProperty(_$$DataTable, "ajax", $("#table_page").data('url')), _defineProperty(_$$DataTable, "columnDefs", [{
    targets: 0,
    orderable: false,
    className: 'select-checkbox',
    checkboxes: {
      selectRow: true
    }
  }, {
    targets: -1,
    orderable: false
  }, {
    targets: invis,
    visible: false
  }]), _defineProperty(_$$DataTable, "searching", true), _defineProperty(_$$DataTable, "select", {
    style: 'multi',
    selector: 'td:first-child'
  }), _defineProperty(_$$DataTable, "scrollX", true), _defineProperty(_$$DataTable, "rowCallback", function rowCallback(row, data) {
    if (data[34] == "<div class='table_cell'> YES </div>") {
      $('td:eq(8)', row).css('background-color', '#83FDC0');
    } else if (data[34] == "<div class='table_cell'> NO </div>") {
      $(row).find('td:eq(8)').css('background-color', '#FA9288');
    } else {//$(row).find('td:eq(7)').css('background-color', 'orange')
    }
  }), _$$DataTable));
  table.on('change', function () {//console.log("clicking");
    // var info = table.fnSettings().aaSorting;
    // var idx = info[0][0];
    // alert(idx);
  });
  $("th.select-checkbox").on('click', function (e) {
    if ($(".selectAll").is(":checked")) {
      table.rows().select();
    } else {
      table.rows().deselect();
    }
  });
  table.on("select", function (e) {
    var rows_selected = table.rows({
      selected: true
    }).data(); //.column(0).data();

    var selected_ids = rows_selected.map(function (value, index) {
      return value[1];
    });
    ids = modify_set(1, ids, selected_ids);
  });
  table.on("deselect", function (e) {
    var rows_deselected = table.rows({
      selected: false
    }).data(); //.column(0).data();

    var deselected_ids = rows_deselected.map(function (value, index) {
      return value[1];
    });
    ids = modify_set(-1, ids, deselected_ids); //console.log(ids);
  });
  table.on("draw", function (e) {
    //console.log("predraw");
    var all_rows = table.rows().data();
    var all_select = true;

    if (all_rows.length == 0) {
      all_select = false;
    }

    all_rows.map(function (row, index) {
      var id = row[0];

      if (ids.has(id)) {
        table.row(index).select();
      } else {
        all_select = false;
      }
    });

    if (all_select) {
      $(".selectAll").prop('checked', true);
    } else {
      $(".selectAll").prop('checked', false);
    }
  });
  $('.s_table_sub').on("click", function (e) {
    var form = this;
    var selected_ids = Array.from(ids); // Iterate over all selected checkboxes

    $.each(selected_ids, function (index, id) {
      // Create a hidden element
      $(form).append($('<input>').attr('type', 'hidden').attr('name', 'selected_ids[]').val(id));
    });
    $(form).append($('<input>').attr('type', 'hidden').attr('name', 'search_value').val(table.search())); //console.log('submitting');
  });
  $('button.toggle-vis').on('click', function (e) {
    e.preventDefault();
    $(this).toggleClass('clicked'); // Get the column API object

    var column = table.column($(this).attr('data-column')); // Toggle the visibility

    column.visible(!column.visible());
  });
});

/***/ })

/******/ });
//# sourceMappingURL=datatable-4a3982768c6f4c303d94.js.map