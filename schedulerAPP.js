const http = require('http');
const cheerio = require('cheerio');

// http.createServer((request, response) => {
//     response.write('Scheduler Web Application!');
//     response.end();
// }).listen(9000);

const undergraduate_graduate = 'graduate';
const year = '2021';
const classdays = [2, 4];
//calculate how many weeks between two dates
function weeksBetween(d1, d2) {
    return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}

//num to weekdays
function numToWeekdays(num) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] [num] || '';
}

//get dates
function getDateBetween(start, end, classdays) {
    var result = [];
    var startTime = new Date(start);
    var endTime = new Date(end);
    var i = 0;
    while (endTime - startTime >= 0) {
        let weekday = startTime.getDay();
        //console.log("continue: ", weekday);
        //console.log("classdays: ", classdays[0], classdays[1]);
        if (weekday == 1) {
            i = i + 1;
        }
        if (weekday != classdays[0] && weekday != classdays[1]) {
            //console.log("continue: ", weekday);
            startTime.setDate(startTime.getDate() + 1);
            continue;
        }
        let month = startTime.getMonth();
        month = month<9?''+(month+1):month+1;
        let day = startTime.getDate().toString().length == 1 ? "" + startTime.getDate() : startTime.getDate();
        result.push([i, numToWeekdays(weekday) + " " + month + "/" + day, 1]);
        startTime.setDate(startTime.getDate() + 1);
    }
    return result;
}

const https = require('https');
let req = https.request({
    'hostname': 'registrar.duke.edu',
    'path':'/fall-2021-academic-calendar/' //2021 fall; 2023 fall
}, res=>{
    var htmlstr = '';
    res.on('data', buffer=>{
        htmlstr+=buffer;
    });
    res.on('end', ()=>{
        var startDate = '';
        var endDate = '';
        var holidays = '';
        //console.log(htmlstr);
        const $ = cheerio.load(htmlstr);
        //const tableStr = $( '.node__content tbody');
        const tableStr = $( '.node__content tbody tr').each((index, el)=>{
            //console.log($(el).find('td').text());
            if($(el).find('td').text().toLowerCase().includes("semester") && $(el).find('td').text().toLowerCase().includes('begin')){
                startDate = $(el).find('td').eq(0).text();
                //console.log($(el).find('td').text());
                startDate += (", " + year);
                console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            else if($(el).find('p').text().toLowerCase().includes("semester") && $(el).find('p').text().toLowerCase().includes('begin')){
                //console.log($(el).text());
                startDate = $(el).find('p').eq(0).text();
                startDate += (", " + year);
                console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            if($(el).find('td').text().toLowerCase().includes(undergraduate_graduate) && $(el).find('td').text().toLowerCase().includes('classes end')){
                if(undergraduate_graduate=='graduate'){
                    if($(el).find('td').text().includes('Graduate') || $(el).find('td').text().includes(' graduate')){
                        endDate = $(el).find('td').eq(0).text();
                        endDate += (", " + year);
                        console.log("1.endDate string: ", endDate);
                        var date = new Date(endDate);
                        var day1 = date.getDay();
                        var date1 = date.getDate();
                        var month1 = date.getMonth();
                        console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
                    }
                }
                else{
                    endDate = $(el).find('td').eq(0).text();
                    endDate += (", " + year);
                    console.log("1.endDate string: ", endDate);
                    var date = new Date(endDate);
                    var day1 = date.getDay();
                    var date1 = date.getDate();
                    var month1 = date.getMonth();
                    console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
                }

            }

            //holidays
            if($(el).find('td').text().toLowerCase().includes("no classes held")){
                if(holidays==''){
                    holidays += $(el).find('td').eq(0).text();
                }
                else{
                    holidays += '; ' + $(el).find('td').eq(0).text();
                }
            }
            if($(el).find('td').text().toLowerCase().includes("fall break")){
                if(holidays==''){
                    holidays += $(el).find('td').eq(0).text();
                }
                else{
                    holidays += '; ' + $(el).find('td').eq(0).text();
                }
            }
            if($(el).find('td').text().toLowerCase().includes("thanksgiving")){
                if(holidays==''){
                    holidays += $(el).find('td').eq(0).text();
                }
                else{
                    holidays += '; ' + $(el).find('td').eq(0).text();
                }
            }
            if($(el).find('td').text().toLowerCase().includes("spring recess")){
                if(holidays==''){
                    holidays += $(el).find('td').eq(0).text();
                }
                else{
                    holidays += '; ' + $(el).find('td').eq(0).text();
                }
            }
            if($(el).find('td').text().toLowerCase().includes("resume")){
                holidays += ' - ';
                holidays += $(el).find('td').eq(0).text();
            }
        });
        //find number of columns needed
        var numWeeks = weeksBetween(new Date(startDate), new Date(endDate));
        console.log("numWeeks of this semester: ", numWeeks);
        console.log('start date: ' + startDate);
        console.log('end date: ' + endDate);
        console.log('holiday: ' + holidays);
        results = getDateBetween(new Date(startDate), new Date(endDate), classdays);
        console.log("num of columns: ", results.length);
        //console.log(tableStr.html());
        console.log("results: ", results);
    });
    //console.log("successfully request info from the host!")
});

req.end();

// const {Builder, By, Key, until} = require('selenium-webdriver');

// (async function start(){
//     let driver = await new Builder().forBrowser('chrome').build();
//     await driver.get('https://registrar.duke.edu/spring-2021-academic-calendar');
//     await driver.findElement(By.css('#changeCityBox ul.clearfix > li:nth-of-type(8)'))
// })

