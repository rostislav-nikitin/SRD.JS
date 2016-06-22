function writeLine(message)
{
	var TagLiBegin = '<li>', TagLiEnd = '</li>', LineBreak = '<br />', 
		consoleId = 'console', 
		console = document.getElementById(consoleId);

	console.innerHTML += TagLiBegin + message + TagLiEnd;
}
