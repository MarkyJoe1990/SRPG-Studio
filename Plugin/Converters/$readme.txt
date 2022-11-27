/*
	Version 1.0
	Made by MarkyJoe1990
	
	This plugin allows you to export various data lists
    in your game as CSV, HTML and TXT files.

    For CSV and HTML, it exports a spreadsheet showing whatever
    properties you ask for, and shows every custom parameter set
    for it. For TXT, it scans your datalist for any items that
    contain the property you ask for.

    These do not work for reference list objects such as a unit's
    skill list.

    WARNING: Some SRPG Studio API and scripting knowledge
    required to utilize this.

    How to Use - CSV and HTML:
    - Create an event command that uses Execute Script.
    - Fetch whatever dataList object you need.
    - Create an array with each item being a command or property you intend to use on each object in the dataList.
        - Example: ["getName()", "getDescription()"]
    - Write CSVControl.writeObjectTable(dataList, array)
    - Boot up your game so the event that runs the script executes.
    - Check your srpg_log.txt and rename it to use the .csv or .html extension.
    - If it's an HTML file, open it in your browser.
    - If it's a CSV file, open it in Excel or OpenOffice Calc, making sure you set "@" as your separator.

    How to Use - TXT:
    - Create an event command that uses Execute Script.
    - Fetch whatever dataList object you need.

    This plugin does not override any functions.
*/