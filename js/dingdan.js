/** jQuery Calculation Plug-in**/
(function($) {
    var defaults = {reNumbers: /(-|-\$)?(\d+(,\d{3})*(\.\d{1,})?|\.\d{1,})/g, cleanseNumber: function (v) {
        return v.replace(/[^0-9.\-]/g, "");
    }, useFieldPlugin: (!!$.fn.getValue), onParseError: null, onParseClear: null};
    $.Calculation = {version: "0.4.07",setDefaults: function(options) {
        $.extend(defaults, options);
    }};
    $.fn.parseNumber = function(options) {
        var aValues = [];
        options = $.extend(options, defaults);
        this.each(function () {
            var $el = $(this),sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "getValue" : "val") : "text"),v = $.trim($el[sMethod]()).match(defaults.reNumbers, "");
            if (v == null) {
                v = 0;
                if (jQuery.isFunction(options.onParseError)) options.onParseError.apply($el, [sMethod]);
                $.data($el[0], "calcParseError", true);
            } else {
                v = options.cleanseNumber.apply(this, [v[0]]);
                if ($.data($el[0], "calcParseError") && jQuery.isFunction(options.onParseClear)) {
                    options.onParseClear.apply($el, [sMethod]);
                    $.data($el[0], "calcParseError", false);
                }
            }
            aValues.push(parseFloat(v, 10));
        });
        return aValues;
    };
    $.fn.calc = function(expr, vars, cbFormat, cbDone) {
        var $this = this, exprValue = "", precision = 0, $el, parsedVars = {}, tmp, sMethod, _, bIsError = false;
        for (var k in vars) {
            expr = expr.replace((new RegExp("(" + k + ")", "g")), "_.$1");
            if (!!vars[k] && !!vars[k].jquery) {
                parsedVars[k] = vars[k].parseNumber();
            } else {
                parsedVars[k] = vars[k];
            }
        }
        this.each(function (i, el) {
            var p, len;
            $el = $(this);
            sMethod = ($el.is(":input") ? (defaults.useFieldPlugin ? "setValue" : "val") : "text");
            _ = {};
            for (var k in parsedVars) {
                if (typeof parsedVars[k] == "number") {
                    _[k] = parsedVars[k];
                } else if (typeof parsedVars[k] == "string") {
                    _[k] = parseFloat(parsedVars[k], 10);
                } else if (!!parsedVars[k] && (parsedVars[k] instanceof Array)) {
                    tmp = (parsedVars[k].length == $this.length) ? i : 0;
                    _[k] = parsedVars[k][tmp];
                }
                if (isNaN(_[k])) _[k] = 0;
                p = _[k].toString().match(/\.\d+$/gi);
                len = (p) ? p[0].length - 1 : 0;
                if (len > precision) precision = len;
            }
            try {
                exprValue = eval(expr);
                if (precision) exprValue = Number(exprValue.toFixed(Math.max(precision, 4)));
                if (jQuery.isFunction(cbFormat)) {
                    var tmp = cbFormat.apply(this, [exprValue]);
                    if (!!tmp) exprValue = tmp;
                }
            } catch(e) {
                exprValue = e;
                bIsError = true;
            }
            $el[sMethod](exprValue.toString());
        });
        if (jQuery.isFunction(cbDone)) cbDone.apply(this, [this]);
        return this;
    };
    $.each(["sum", "avg", "min", "max"], function (i, method) {
        $.fn[method] = function (bind, selector) {
            if (arguments.length == 0)return math[method](this.parseNumber());
            var bSelOpt = selector && (selector.constructor == Object) && !(selector instanceof jQuery);
            var opt = bind && bind.constructor == Object ? bind : {bind: bind || "keyup", selector: (!bSelOpt) ? selector : null, oncalc: null};
            if (bSelOpt) opt = jQuery.extend(opt, selector);
            if (!!opt.selector) opt.selector = $(opt.selector);
            var self = this, sMethod, doCalc = function () {
                var value = math[method](self.parseNumber(opt));
                if (!!opt.selector) {
                    sMethod = (opt.selector.is(":input") ? (defaults.useFieldPlugin ? "setValue" : "val") : "text");
                    opt.selector[sMethod](value.toString());
                }
                if (jQuery.isFunction(opt.oncalc)) opt.oncalc.apply(self, [value, opt]);
            };
            doCalc();
            return self.bind(opt.bind, doCalc);
        }
    });
    var math = {sum: function (a) {
        var total = 0, precision = 0;
        $.each(a, function (i, v) {
            var p = v.toString().match(/\.\d+$/gi), len = (p) ? p[0].length - 1 : 0;
            if (len > precision) precision = len;
            total += v;
        });
        if (precision) total = Number(total.toFixed(precision));
        return total;
    },avg: function (a) {
        return math.sum(a) / a.length;
    },min: function (a) {
        return Math.min.apply(Math, a);
    },max: function (a) {
        return Math.max.apply(Math, a);
    }};
})(jQuery);