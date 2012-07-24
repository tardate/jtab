// The parts of lowpro that are needed (pretty much: only klass). I have removed the rest
// because it littered the jQuery namespace with unnecessary data, and actually caused issues
// because lowpro is so old that it overwrites exisiting jQuery methods that didn't exist back
// then (notably: delegate). See http://meta.stackoverflow.com/questions/132147 -- balpha, 2012-07
(function ($) {
    function keys(obj) {
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    };

    var addMethods = function (source) {
        var ancestor = this.superclass && this.superclass.prototype;
        var properties = keys(source);

        if (!keys({ toString: true }).length) properties.push("toString", "valueOf");

        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i], value = source[property];
            if (ancestor && $.isFunction(value) && $.argumentNames(value)[0] == "$super") {

                var method = value, value = $.extend($.wrap((function (m) {
                    return function () { return ancestor[m].apply(this, arguments) };
                })(property), method), {
                    valueOf: function () { return method },
                    toString: function () { return method.toString() }
                });
            }
            this.prototype[property] = value;
        }

        return this;
    }
    $.extend({
        klass: function () {
            var parent = null, properties = $.makeArray(arguments);
            if ($.isFunction(properties[0])) parent = properties.shift();

            var klass = function () {
                this.initialize.apply(this, arguments);
            };

            klass.superclass = parent;
            klass.subclasses = [];
            klass.addMethods = addMethods;

            if (parent) {
                var subclass = function () { };
                subclass.prototype = parent.prototype;
                klass.prototype = new subclass;
                parent.subclasses.push(klass);
            }

            for (var i = 0; i < properties.length; i++)
                klass.addMethods(properties[i]);

            if (!klass.prototype.initialize)
                klass.prototype.initialize = function () { };

            klass.prototype.constructor = klass;

            return klass;
        }
    });
})(jQuery);