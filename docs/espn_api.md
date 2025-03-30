# Remove Sports

Now, please remove tennis because we don't have backend APIs to get those scores yet:
- Men's ATP singles tennis. 
- Women's WTA singles tennis.

Please remove golf because we don't have backend APIs to get those scores yet:
- Men's Professional Golfers Association (PGA) tour.
- Women's Professional Golfers' Association (WPGA) tour.

# Backend APIs

We want to get the scores from the ESPN APIs describe here: https://gist.github.com/akeaswaran/b48b02f1c94f873c6655e7129910fc3b

## Baseball

### MLB

**Scores**: http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/:team

### College Baseball

**Scores**: https://site.api.espn.com/apis/site/v2/sports/baseball/college-baseball/scoreboard

## Hockey

**Scores**: http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams/:team


## Basketball

### NBA

**Scores**: http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/basketball/nba/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/:team


### WNBA

**Scores**: http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams/:team


### Women's College Basketball

**Scores**: http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/teams/:team


### Men's College Basketball

**Scores**: http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard

**News**: http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news

**All Teams**: http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams

**Specific Team**: http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams/:team



## Soccer

**Scores**: http://site.api.espn.com/apis/site/v2/sports/soccer/:league/scoreboard

- params:

   - league: some league abbreviation (EX: 'eng.1' for EPL, 'usa.1' for MLS) 
   - For the Sports Tracker web application, only include 'eng.1' for EPL and 'usa.1' for MLS
   
**Latest News**: http://site.api.espn.com/apis/site/v2/sports/soccer/:league/news

**List of Team Information**: http://site.api.espn.com/apis/site/v2/sports/soccer/:league/teams

# Frontend integration with backend

The web application should display the score data that the backend fetches from te above APIs. 
