var db;
var dbCreated = false;

var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

//Returns a new Database object.
    db = window.openDatabase("playertopscoreDB", "1.0", "Tap that Shade", 200000);
    if (dbCreated)
    	db.transaction(getScorePlayer, error);
    else
    	db.transaction(populateDB, error, populateDB_success);
}

function transaction_error(tx, error) {
	$('#busy').hide();
    alert("Database Error: " + error);
}

function populateDB_success() {
	dbCreated = true;
    db.transaction(getScorePlayer, error);
}

function getScorePlayer(tx) {
	var sql = "select e.id, e.name, e.score, e.level, e.timestamp";
	tx.executeSql(sql, [], getScorePlayer_success);
}

// score of the player successfully inserted
function getScorePlayer_success(tx, results) {
	..... 
	...
}


// Populate the database
function populateDB(tx) {
	$('#busy').show();
	tx.executeSql('DROP TABLE IF EXISTS playerScore');
	var sql = 
		"CREATE TABLE IF NOT EXISTS playerScore ( "+
		"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
		"name VARCHAR(50), " +
		"score INTEGER, " +
		"level INTEGER, " +
		"timestamp CURRENT_TIMESTAMP)"; 
		    tx.executeSql(sql);
	// initial script....
    tx.executeSql("INSERT INTO playerScore ()");
}
    
