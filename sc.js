const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");


(async function example() {
    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
    try {
        const url = "http://pu.edu.pk/home/results_show/7471";
        await driver.get(url);
        await driver.findElement(By.name('roll_no')).sendKeys('043417', Key.RETURN);
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        // Load HTML we fetched in the previous line
        const divOfTable = cheerio.load(data, {
            xml: true,
            xmlMode: true
          });
        // Select all the list items in plainlist class
        const table = divOfTable(".pagecontents div");
        console.log(table);
        // Stores data for all countries
        // const countries = [];
        await driver.wait(until.titleIs('webdriver - Google Search'));
        // soup.nextElement
        // res = soup.findElement('div', attrs = { "class": "pagecontents" })
        // console.log(res);
    } finally {
        // await driver.quit();
    }
})();

// url = "http://pu.edu.pk/home/results_show/7471"

// driver = webdriver.Chrome('/chromedriver.exe')
// driver.get(url)

// // # To find RollNo input field and fill it out Automatically by Selenium Everytime.
// roll_number = driver.find_element(By.NAME, "roll_no").send_keys('043417')

// // # To Enter Automatically after Input Field is filled.
// getResult = driver.find_element(By.NAME, "submitcontact")
// getResult.click()
// // # getResult.send_keys(Keys.ENTER) will work as well

// // # To get page Source
// resultsource = driver.page_source
// soup = BeautifulSoup(resultsource, 'lxml')
// res = soup.find_all('div', attrs={"class":"pagecontents"})
// print(res)

// time.sleep(9000)
