const http = require('http');
const cheerio = require('cheerio');

// http.createServer((request, response) => {
//     response.write('Scheduler Web Application!');
//     response.end();
// }).listen(9000);

const undergraduate_graduate = 'graduate';

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
            }
            else if($(el).find('p').text().toLowerCase().includes("semester") && $(el).find('p').text().toLowerCase().includes('begin')){
                //console.log($(el).text());
                startDate = $(el).find('p').eq(0).text();
            }
            if($(el).find('td').text().toLowerCase().includes(undergraduate_graduate) && $(el).find('td').text().toLowerCase().includes('classes end')){
                if(undergraduate_graduate=='graduate'){
                    if($(el).find('td').text().includes('Graduate') || $(el).find('td').text().includes(' graduate')){
                        endDate = $(el).find('td').eq(0).text();
                    }
                }
                else{
                    endDate = $(el).find('td').eq(0).text();
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
        console.log('start date: ' + startDate);
        console.log('end date: ' + endDate);
        console.log('holiday: ' + holidays);
        //console.log(tableStr.html());
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

