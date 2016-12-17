/**
 * Created by eugene.levenetc on 17/12/2016.
 */
const logger = require('bunyan').createLogger({name: "mdm"});

exports.info = function (obj, msg) {
    logger.info(obj, msg);
};

exports.error = function (obj, msg) {
    logger.error(obj, msg);
};

exports.getInst = function () {
    return logger;
};

exports.setLevel = function (level) {
    logger.level(level);
};