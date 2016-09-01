/**
 * Created by eugene.levenetc on 01/09/16.
 */
module.exports = {
	resolveModule: function (moduleId) {
		try {
			require.resolve(moduleId);
			return true;
		} catch (e) {
			return false;
		}

	}
};