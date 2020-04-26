function testFunction2() {
	myArray = []
	unitList = root.getCurrentSession().getEnemyList();

	for (i = 0; i < unitList.getCount(); i++) {
		currentUnit = unitList.getData(i);
		root.log(typeof currentUnit);
		myArray.push(currentUnit);
	}
	this._listType = SelectorListType.UNIT
	return myArray;
}