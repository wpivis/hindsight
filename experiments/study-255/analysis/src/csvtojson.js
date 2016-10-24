var C2JConverter = require("csvtojson").Converter
  , fs     = require('fs')
  , _      = require('underscore')

  , csvFile   = process.argv[2]

var CHART_NUM = 255;


c2j = new C2JConverter();
c2j.fromFile(csvFile,function(err,result){
  console.log(JSON.stringify(result) );
});





