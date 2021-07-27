const currDateTime = () => {
	var date = new Date();
	return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = currDateTime;
