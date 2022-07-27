const http = require('http');
const cheerio = require('cheerio');

// http.createServer((request, response) => {
//     response.write('Scheduler Web Application!');
//     response.end();
// }).listen(9000);


const year = '2022';
const semester = 'summer';
//const semester = 'fall';
const term = 'term 1';
const undergraduate_graduate = 'graduate';
const classdays = [1, 4];
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
    var i = 1;
    while (endTime - startTime >= 0) {
        //there is only one day having class in each week or three days instead of two days
        if(classdays.length==1){
            if (startTime.getDay() != classdays[0]) {
                startTime.setDate(startTime.getDate() + 1);
                if (startTime.getDay() == 1) {
                    i = i + 1;
                }
                continue;
            }
        }
        else if (classdays.length==2){
            if (startTime.getDay() != classdays[0] && startTime.getDay() != classdays[1]) {
                startTime.setDate(startTime.getDate() + 1);
                if (startTime.getDay() == 1) {
                    i = i + 1;
                }
                continue;
            }
        }
        let month = startTime.getMonth();
        month = month<9?''+(month+1):month+1;
        let day = startTime.getDate().toString().length == 1 ? "" + startTime.getDate() : startTime.getDate();
        result.push([i, numToWeekdays(startTime.getDay()) + " " + month + "/" + day, 1]);
        startTime.setDate(startTime.getDate() + 1);
        if (startTime.getDay() == 1) {
            i = i + 1;
        }
    }
    return result;
}

const https = require('https');
let req = https.request({
    'hostname': 'registrar.duke.edu',
    'path':'/'+semester+'-'+year+'-academic-calendar/' //2021 fall; 2023 fall
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
            //summer
            if($(el).find('td').text().toLowerCase().includes(term) && $(el).find('td').text().toLowerCase().includes("classes begin")){
                startDate = $(el).find('td').eq(0).text();
                //console.log($(el).find('td').text());
                startDate += (", " + year);
                //console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            else if($(el).find('td').text().toLowerCase().includes(term) && $(el).find('td').text().toLowerCase().includes("classes begin")){
                //console.log($(el).text());
                startDate = $(el).find('p').eq(0).text();
                startDate += (", " + year);
                //console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            if($(el).find('td').text().toLowerCase().includes(term) && $(el).find('td').text().toLowerCase().includes("classes end")){
                endDate = $(el).find('td').eq(0).text();
                endDate += (", " + year);
                //console.log("1.endDate string: ", endDate);
                var date = new Date(endDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            //console.log($(el).find('td').text());
            if($(el).find('td').text().toLowerCase().includes("semester") && $(el).find('td').text().toLowerCase().includes('begin')){
                startDate = $(el).find('td').eq(0).text();
                //console.log($(el).find('td').text());
                startDate += (", " + year);
                //console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            else if($(el).find('p').text().toLowerCase().includes("semester") && $(el).find('p').text().toLowerCase().includes('begin')){
                //console.log($(el).text());
                startDate = $(el).find('p').eq(0).text();
                startDate += (", " + year);
                //console.log("1.startDate string: ", startDate);
                var date = new Date(startDate);
                var day1 = date.getDay();
                var date1 = date.getDate();
                var month1 = date.getMonth();
                //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
            }
            if($(el).find('td').text().toLowerCase().includes(undergraduate_graduate) && $(el).find('td').text().toLowerCase().includes('classes end')){
                if(undergraduate_graduate=='graduate'){
                    if($(el).find('td').text().includes('Graduate') || $(el).find('td').text().includes(' graduate')){
                        endDate = $(el).find('td').eq(0).text();
                        endDate += (", " + year);
                        //console.log("1.endDate string: ", endDate);
                        var date = new Date(endDate);
                        var day1 = date.getDay();
                        var date1 = date.getDate();
                        var month1 = date.getMonth();
                        //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
                    }
                }
                else{
                    endDate = $(el).find('td').eq(0).text();
                    endDate += (", " + year);
                    //console.log("1.endDate string: ", endDate);
                    var date = new Date(endDate);
                    var day1 = date.getDay();
                    var date1 = date.getDate();
                    var month1 = date.getMonth();
                    //console.log('day1:', day1, 'month1:', month1, 'date1: ', date1);
                }
            }

            //holidays
            if($(el).find('td').text().toLowerCase().includes("no classes are held")){
                if(holidays==''){
                    holidays += $(el).find('td').eq(0).text();
                }
                else{
                    holidays += '; ' + $(el).find('td').eq(0).text();
                }
            }
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
        console.log('start date: ' + startDate);
        console.log('end date: ' + endDate);
        console.log('holiday: ' + holidays);
        results = getDateBetween(new Date(startDate), new Date(endDate), classdays);
        // var numWeeks = weeksBetween(new Date(startDate), new Date(endDate));
        // console.log("num of weeks: ", numWeeks);
        //console.log("num of columns: ", results.length);
        //console.log(tableStr.html());
        //console.log("results: ", results);
        //holiday
        var splitArr = [];
        var holidaysArr = [];
        splitArr = holidays.split(";");
        //console.log("splitArr: ", splitArr);
        for(let i=0; i<splitArr.length; i++){
            var numSplitArr = splitArr[i].split("-");
            var numSplit = numSplitArr.length;
            //console.log("numSplitArr: ", numSplitArr);
            //console.log("numSplit: ", numSplit);
            if(numSplit==2 || numSplit==3){
                date_begin = '';
                date_end = '';
                if(numSplit==2){
                    var startEndArr = splitArr[i].split("-");
                    var holidayStart = startEndArr[0] + year;
                    var holidayEnd = startEndArr[1] + ' ' +  year;
                    date_begin = new Date(holidayStart);
                    date_end = new Date(holidayEnd);
                }
                else{
                    var spltDate = splitArr[i].split(",");
                    var splitMon = spltDate[1].split("-");
                    var star = splitMon[0] + year;
                    var splitDay = splitMon[0].split(" ");
                    var en = splitDay[1] + splitMon[1] + ' ' + year;
                    date_begin = new Date(star);
                    date_end = new Date(en);
                }
                //console.log(date_begin);
                //console.log(date_end);
                for(let i = date_begin.getTime(); i<=date_end.getTime();){
                    let push_date = new Date(parseInt(i));
                    for(let j = 0; j<classdays.length; j++){
                        if(push_date.getDay()==classdays[j]){
                            holidaysArr.push(push_date);
                            break;
                        }
                    }
                    i = i+24 * 60 * 60 * 1000;
                }
            }
            else{
                var str = splitArr[i]+' '+year;
                //console.log("str: ", str);
                let str_date = new Date(str);
                //console.log("str_date: ", str_date);
                for(let j = 0; j<classdays.length; j++){
                    if(str_date.getDay()==classdays[j]){
                        holidaysArr.push(str_date);
                        break;
                    }
                }
            }
        }
        for(let i=0; i<holidaysArr.length; i++){
            let month = holidaysArr[i].getMonth()+1;
            let day = holidaysArr[i].getDate();
            holidaysArr[i] = month + "/" + day;
        }
        //console.log("holidaysArr: ", holidaysArr);
        for(let i=0; i<results.length; i++){
            let arr = results[i][1].split(" ");
            //console.log("arr: ", arr);
            //console.log("holidaysArr: ", holidaysArr);
            if (holidaysArr.length == 0) {
                results[i][2] = "";
            }
            for(let j=0; j<holidaysArr.length; j++){
                //console.log(res_date);
                if(arr[1] == holidaysArr[j]){
                    //console.log("no class");
                    results[i][2] = "No class";
                    break;
                } else {
                    //console.log("class");
                    results[i][2] = "";
                }
            }
        }
        console.log("results: ", results);
    });
});

req.end();
