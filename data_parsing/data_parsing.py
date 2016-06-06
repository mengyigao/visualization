from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
from team_dic import team_dic

monthid = [1, 2, 3, 4, 5, 6, 7]
month = {1:"Season", 2:"November", 3:"December", 4:"January", 5:"Febuary", 6:"March", 7:"April"}
headers = ["Team", "Restricted Area FGM", "Restricted Area FGA", "Restricted Area FG%", "In The Paint FGM", "In The Paint FGA", "In The Paint FG%", "Mid-Range FGM", "Mid-Range FGA", "Mid-Range FG%", "Left Corner 3 FGM", "Left Corner 3 FGA", "Left Corner 3 FG%", "Right Corner 3 FGM", "Right Corner 3 FGA", "Right Corner 3 FG%", "Above the Break 3 FGM", "Above the Break 3 FGA", "Above the Break 3 FG%"]
shooting = []

for id in monthid:
    if id == 1:
        url = "http://stats.nba.com/league/team/#!/shooting/?Season=2015-16&SeasonType=Regular%20Season&DistanceRange=By%20Zone"
    else:
        url = "http://stats.nba.com/league/team/#!/shooting/?Season=2015-16&SeasonType=Regular%20Season&DistanceRange=By%20Zone&Month=" + str(id)
    driver = webdriver.Firefox()
    driver.get(url)
    wait = WebDriverWait(driver, 5)

# wait for the table to load
    table = wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'table-responsive')))
    for tr in table.find_elements_by_xpath("//tr[@data-ng-repeat][@class='ng-scope']"):
        cells = [td.text for td in tr.find_elements_by_tag_name('td')]
        cells[1:] = [float(i) for i in cells[1:]]
        row = dict(zip(headers, cells))
        row['month'] = month[id]
        # merge shooting data with team profile
        row.update(team_dic[row['Team']])
        shooting.append(row)

    driver.quit()


with open('data2.txt', 'w') as outfile:
    json.dump(shooting, outfile)

#with open('data.txt','r') as infile:
#    print json.load(infile)