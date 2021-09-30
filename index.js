


var searchIssuesQuery  = `
query SearchIssues($query:String!, $after: String) {
  search(query:$query, type:ISSUE, first: 100, after: $after) {
    edges {
    	node {
        ... on Issue {
         repository {
	   owner {
		login
	   },
	   updatedAt,
	   url,
	updatedAt,
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


class RepositoryContainer {
        constructor(issue) {
                this.owner = issue.repository.owner.login
                this.name = issue.repository.name
                this.starcount = issue.repository.stargazers.totalCount
                this.issues = [ issue ]
                this.url = issue.repository.url
                this.updatedAt = issue.repository.updatedAt
        }

        addIssue(issue) {
                this.issues.push(issue);
        }
}

function sortByGoodFirstIssues(repos) {

       function compare(a, b) {
           return returnComp(a.issues.length, b.issues.length, a.starcount, b.starcount) 
	};


        repos.sort(compare);
	return repos; 
}

function returnComp(a, b,  tiebreaker1, tiebreaker2) {
		

	if (a > b) {
            return -1;          
        } else if (b > a) {
            return 1;
       	} else if (tiebreaker1 > tiebreaker2) {
	    return -1 
	} else if (tiebreaker2 > tiebreaker1) {
	    return 1; 
	}

	return 0
}


function sortByStars(repos) {
	function compare(a, b) {
		return returnComp(a.starcount, b.starcount, a.issues.length, b.issues.length)
        };

        repos.sort(compare);
        return repos;
}


function sortBy(value, repositories) {

	switch (value) {

                case "Good First Issue":
                       	return sortByGoodFirstIssues(repositories); 
			break;

                case "Stars":
			return sortByStars(repositories); 
                        break; 

        }

}


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
	console.log("***** create table called ****");
 	var repoNameDict = {};
        var repoDict = {};
	var body = document.getElementsByTagName("body")[0];
	var allRepositories = createContainers(issues, repoDict, repoNameDict);

	sortByGoodFirstIssues(allRepositories); 
	makeTableFromRepos(allRepositories); 
	return allRepositories 
};


function makeTableFromRepos(repositories) {
     makeTableElement(); 	
     repositories.forEach(i=>{
         var row = insertIntoTableElement(i.owner, i.name, i.url, i.issues.length, i.starcount, i.updatedAt);
         $('table tbody')[0].appendChild(row);
     })
}


function removeRows(table) {
	$('table tbody tr').remove();
}


function makeTableElement() {

        // create elements <table> and a <tbody>
        var table = $('table')[0];
	table.classList.remove('hidden');
	removeRows(table);
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


function formatUpdatedAtDate(updatedAt) {
  var date = new Date(updatedAt);
  var monthNames = [
   	 "Jan", "Feb", "May",
   	 "Apr", "May", "June", "July",
   	 "Aug", "Sept", "Oct",
   	 "Nov", "Dec"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] +  ' ' + day + ' ' + year;
}


function appendStarCell(row, stars) {
	var cell = document.createElement("td");
	var starSVG = starSVGIcon();
	var p1 = "<p>";
	var p2 = "</p>";
	var space = " ";
	$(cell).html(p1 + starSVG + space + stars + p2);
        row.appendChild(cell);
}


function insertIntoTableElement(repoOwnerLogin, repoName, url,  issueCount, stars, updatedAt) {
	var row = document.createElement("tr");
	formatNameCell(repoOwnerLogin, repoName, url, row);
	appendCell(row, issueCount);
	appendStarCell(row, stars);
	appendCell(row, formatUpdatedAtDate(updatedAt));
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

function starSVGIcon() {
	return '<svg aria-label="star" style="margin-top: -5px" viewBox="0 0 14 16" version="1.1" width="14" height="16" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>'
}



function onSubmitButton() {

	var parameters = getHTMLParameters();
	if (parameters.language == "") {
		return;
	}

	var time = new Date().getTime()
	var spinner = $('.spinner')
	throwLoading(spinner);
	var fetchCount = 0;
	var labels = ["easy contribution", "good first issue", "starter-task"];
	var todaysDate = new Date();
	var issuesFetched = [];
	var uniqueRepositories = []
	var labelIndex = 0;

	function setupSortMech(repos) {
		$(".sortsTable").click(function() {
			console.log("seen ");	
                	var value = $(this).attr('value');
			var sortedRepos = sortBy(value, repos); 
			makeTableFromRepos(sortedRepos); 
		});

	}

	function finishedFetchingRepos() {
		console.log("finished " + issuesFetched.length);
                stopLoadingSpinner(spinner, new Date().getTime());
                console.log("finished " + issuesFetched.length);
                var repos = createTable(issuesFetched);
		setupSortMech(repos); 
	}

	function makeQuery(endCursor) {
		var query = makeIssuesQuery(parameters.language, labels[labelIndex], endCursor);
		fetchQuery(searchIssuesQuery, query, handleData );
	}

	function fetchNextPage(fetchCount, pageInfo) {
		 // { "query": "label:\"good first issue\" ", "after": "Y3Vyc29yOjg="}
		fetchCount += 1;
		makeQuery(pageInfo.endCursor)
	}

	function fetchNextLabel() {
             labelIndex += 1;
             if (labelIndex >= labels.length) {
                     finishedFetchingRepos(); 
	     } else {
                     makeQuery();
             }
	}

	function handleData(data) {

		if (data == null || data.data == null) {
			fetchNextLabel();
			return;
		}

		var issues = data.data.search.edges.map(edge=>{ return edge.node  });
		console.log(issues.length);
		issuesFetched = issuesFetched.concat(issues);
		console.log(issuesFetched.length);
		var pageInfo = data.data.search.pageInfo;

		var i = 0;

		for (i = issues.length; i >= 0; i--) {
			if (isUndefined(issues[i])) {
				issues.splice(i, 1);
			}
		}

		if (issues.length == 0) {
			fetchNextLabel();
		} else if (pageInfo.hasNextPage && !afterDateLimit( new Date(issues[issues.length - 1].createdAt ), todaysDate, 4)) {
			fetchNextPage(fetchCount, pageInfo);
		} else {
			fetchNextLabel();
		}
	}

	makeQuery();
}


function fetchQuery(query, variables, callback)  {
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


