// module.exports = { onSubmitButton, sum  };
// https://www.flightlist.io/


var searchIssuesQuery  = `
query SearchIssues($query:String!, $after: String) {
  search(query:$query, type:ISSUE, first: 50, after: $after) {
    edges {
    	node {
        ... on Issue {
         repository {
	   owner {
		login
	   },
	   url,
           name,
	   stargazers {
		totalCount
         	},
           },

           url,
	   createdAt,

        }
      }
    }

    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

`


function addSlashes(string) {
	var slash = "\"";
	return slash + string + slash
}


function makeIssuesQuery(language, label, endCursor) {
	return {
		query:
			"label:" + addSlashes(label) + " language:" + language + " " + "state:open",
			"after": endCursor,
	}
}


function getHTMLParameters() {
	// get language
	var langOptions = $(".LanguageOptions")[0];
	var selectedLanguage = langOptions[langOptions.selectedIndex].value
		console.log(selectedLanguage);
	// get labels

	return {
		language: selectedLanguage
	}

}


function daysBetweenDates(date1, date2) {
	var oneDay = 24*60*60*1000;	// hours*minutes*seconds*milliseconds
	var diffDays = Math.round((date2-date1)/oneDay);
	return diffDays;
}


function afterDateLimit(date, todaysDate, monthLimit) {
	var dayLimit = monthLimit * 30;
	var daysBtwn =  daysBetweenDates(date, todaysDate);
	return daysBtwn >= dayLimit
}


class RepositoryContainer {
	constructor(issue) {
		this.owner = issue.repository.owner.login
		this.name = issue.repository.name
		this.starcount = issue.repository.stargazers.totalCount
		this.issues = [ issue ]
		this.url = issue.repository.url
	}

	addIssue(issue) {
		this.issues.push(issue);
	}
}


function isUndefined(object) {
	return (typeof object === "undefined");
}


function createContainers(issues, repoDict, repoNameDict) {
        issues.forEach(i=>{
		if (isUndefined(i)) { return; };
		if (isUndefined(i.repository)) { return; }
		var name = i.repository.name

                if (isUndefined(repoNameDict[name])) {
                        repoNameDict[name] = name;
                        var container = new RepositoryContainer(i);
			repoDict[name] = container;
                } else {
                        repoDict[name].addIssue(i);
                }
	});

	var arrayvalues = new Array();

	for (var key in repoDict) {
    		arrayvalues.push(repoDict[key]);
	}

	return arrayvalues
}


function createTable(issues) {
 	var repoNameDict = {};
        var repoDict = {};

	var body = document.getElementsByTagName("body")[0];
	var table = makeTableElement();
	var allRepositories = createContainers(issues, repoDict, repoNameDict);
	addHeadersTo(table);

	function compare(a, b) {
		var a = a.issues.length
		var b = b.issues.length
  		let comparison = 0;

 		 if (a > b) {
   	   	     comparison = -1;
		  } else if (b > a) {
 		     comparison = 1;
 		 }

 		 return comparison;
	};

	allRepositories.sort(compare);

	allRepositories.forEach(i=>{
		var l = i.issues.length;
		var stars = i.starcount;
		var row = insertIntoTableElement(i.owner, i.name, i.url, l, stars);
		table.appendChild(row);
	})

	// if an old table exists, remove it
	$("table").remove();

	body.appendChild(table);
	table.classList.add("table");
}


function addHeadersTo(table) {
	var row = document.createElement("tr");
	table.appendChild(row);

	appendHeaderCell(row, "Repositories");
	appendHeaderCell(row, "Good First Issues");
	appendHeaderCell(row, "Star Count");
}


function appendHeaderCell(row, text) {
 	var cell = document.createElement("th");
        var celltext = document.createTextNode(text);
        cell.appendChild(celltext);
        row.appendChild(cell);
}


function makeTableElement() {
        // create elements <table> and a <tbody>
        var table = document.createElement("table");
	var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
	return table
}


function appendCell(row, text) {
	var cell = document.createElement("td");
	var celltext = document.createTextNode(text);
	cell.appendChild(celltext);
	row.appendChild(cell);
}


function formatNameCell(repoOwnerLogin, repoName, url, row) {
	var cell = document.createElement("td");
	var span = document.createElement("span");
	var a = document.createElement("a");
	var loginText = document.createTextNode(repoOwnerLogin + " / ");
	var repoNameText = document.createTextNode(repoName);

	a.appendChild(loginText);
	$(a).attr("href", url);
	$(a).attr("target", "_blank");
	a.classList.add("ownerLoginText");
	a.appendChild(repoNameText);

	cell.appendChild(a);
	row.appendChild(cell);
}


function insertIntoTableElement(repoOwnerLogin, repoName, url,  issueCount, starCount) {
	var row = document.createElement("tr");
	formatNameCell(repoOwnerLogin, repoName, url, row);
	appendCell(row, issueCount);
	appendCell(row, starCount);
	return row;
}


function throwLoading(spinner) {
	spinner.css("display", "block");
	console.log("throwing loading spinner");
}


function stopLoadingSpinner(spinner, time) {

	function stopLoading() {
		spinner.css("display", "none");
	}


	console.log(time);
	var now = new Date().getTime();
	console.log(now);
	var interval = new Date().getTime() - time
	console.log(interval);
	spinner.css("display", "none");
}


function onSubmitButton() {
	var time = new Date().getTime()
	var spinner = $('.spinner')
	throwLoading(spinner);
	var parameters = getHTMLParameters();
	var fetchCount = 0;
	var labels = ["good first issue", "starter-task"];
	var todaysDate = new Date();
	var issuesFetched = [];
	var uniqueRepositories = []

	var i = 0;

	function makeQuery(endCursor) {
		var query = makeIssuesQuery(parameters.language, labels[i], endCursor);
		fetchQuery(searchIssuesQuery, query, handleData );
	}

	function handleData(data) {
		var issues = data.data.search.edges.map(edge=>{ return edge.node  });
		console.log(issues.length);
		issuesFetched = issuesFetched.concat(issues);
		console.log(issuesFetched.length);
		var pageInfo = data.data.search.pageInfo;
		var earliestIssue = issues[issues.length-1]
		var date = earliestIssue.createdAt;

		if (pageInfo.hasNextPage && !afterDateLimit(new Date(date), todaysDate, 4)) {
			fetchCount += 1;
			var after = pageInfo.endCursor;

			// { "query": "label:\"good first issue\" ", "after": "Y3Vyc29yOjg="}

			makeQuery(pageInfo.endCursor);

		} else {
			i += 1;
			if (i >= labels.length) {
				console.log("finished " + issuesFetched.length);
                        	createTable(issuesFetched);
			} else {
				makeQuery();
			}

			stopLoadingSpinner(spinner, new Date().getTime());
			console.log("finished " + issuesFetched.length);
 			createTable(issuesFetched);
		}
	}

	makeQuery();
}


function fetchQuery(query, variables, callback)  {
	var token = '3d1937628560b5d023c8a239fd0fa8245bfdd553';
	//https://graphql.org/graphql-js/graphql-clients/

	var body = JSON.stringify({
                query,
                variables: variables,
	});


	fetch('https://api.github.com/graphql',
	{
        	method: 'POST',
        	headers: {
                	'Content-Type': 'application/json',
                	'Accept': 'application/json',
                	'Authorization': 'Bearer' + ' ' + token,
        	},
        	body: body

	}).then(r => r.json()).then(data => {
    		callback(data);
	});
}

function deduplicateIssues(issues) {
    const seen = new Set();
    const uniqueIssues = [];

    issues.forEach(issue => {
        if (!issue || !issue.url) return;

        if (!seen.has(issue.url)) {
            seen.add(issue.url);
            uniqueIssues.push(issue);
        }
    });

    return uniqueIssues;
}
