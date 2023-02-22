const cheerio = require('cheerio')
const fetch = require('isomorphic-unfetch')

const BNR_URL = 'http://pu.edu.pk/home/results_show/7471'

fetch(BNR_URL)
    .then((response) => response.text())
    .then((xml) => {
        const $ = cheerio.load(xml, {
            xml: true,
            xmlMode: true,
        })
        console.log($('Rate'))
    })