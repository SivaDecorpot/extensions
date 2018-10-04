function doGet(request) {
  // get the JSON and Change it to string
  var params = JSON.stringify(get_json_from_spreadsheet());
  
  // return the content
  return ContentService.createTextOutput(params).setMimeType(ContentService.MimeType.JSON)
}

function test(){
  var test = get_json_from_spreadsheet();
  //Logger.log(test)
}

function get_json_from_spreadsheet(){
  //opening the spreadsheet
  var urlspreadsheet = "https://docs.google.com/spreadsheets/d/1E0SSjW2boMSFKRimo26aIAj_78CTiO_1Axdug_IcmKc/";
  spreadsheet = SpreadsheetApp.openByUrl(urlspreadsheet);
  
  var array = [];
  var main_sheet = spreadsheet.getSheetByName("Bâtiment");
  var check_sheet = main_sheet.getRange(2, 1).getValue();
  var lastrow = main_sheet.getLastRow();
  var lastcol = main_sheet.getLastColumn();
  var main_datas = main_sheet.getRange(3, 1, lastrow, lastcol).getValues();
  var split_axes = check_sheet.split(" ");
  
  var json = {
    "name":"patch",
    "definition":{
      "name":"patch",
      "description":"patch",
      "stack":{
        "stackAxes":split_axes[1],
        "stackList":[]
      }
    }
  }
  
  for (var row = 0; row < main_datas.length; row++){
    for (var col = 0; col < main_datas[row].length; col++){
      if (main_datas[row][col] != ""){
        json.definition.stack.stackList.push(getjsonarray(main_datas[row][col],split_axes[1]));
      }
    }
  }
  array.push(json);
  return array;
}

function getjsonarray(main_val,maxes){
  var sub_sheet = spreadsheet.getSheetByName(main_val.trim());
  var lastrow = sub_sheet.getLastRow();
  var lastcol = sub_sheet.getLastColumn();
  var check_empilage = sub_sheet.getRange(2, 1).getValue();
  var getempilage = check_empilage.split(" ")
  var getdatas = sub_sheet.getRange(3, 1, lastrow, lastcol).getValues();
  
  if (getempilage[0].trim() == "empilage"){
    var json1 = {
      "definition":{
        "name":main_val,
        "description":main_val,
        "level":["patch",maxes],
        "stack":{
          "stackAxes":getempilage[1],
          "stackList":[]
        }
      }
    }
  }else{
    var json1 = {
      "definition":{
        "name":main_val,
        "description":main_val,
        "level":["patch",maxes],
        "definition":[]
      }
    }
  }

  for (var x = 0; x < getdatas.length; x++){
    for (var y = 0; y < getdatas[x].length; y++){
      if (getdatas[x][y] != ""){
        json1.definition.stack.stackList.push(getjsoncomponents(getdatas[x][y],getempilage[1],main_val));
      }
    }
  }
  return json1;
}

function getjsoncomponents(main_val,maxes,parent_name){
  var sheet1 = spreadsheet.getSheetByName(main_val)
  if (sheet1 != null){
    var sheet1_lastrow = sheet1.getLastRow();
    var sheet1_lastcol = sheet1.getLastColumn();
    var sheet1_datas = sheet1.getRange(3, 1, sheet1_lastrow, sheet1_lastcol).getValues();
    var check_sheet1 = sheet1.getRange(2, 1, 1, 3).getValues();
    
    if (check_sheet1[0][0].indexOf("empilage")>-1){
      var check_emp = check_sheet1[0][0].split(" ")
    }else if (check_sheet1[0][0].indexOf("grille")>-1){
      var check_emp = ""
    }
    
    if (check_sheet1[0][0] == "grille"){
      var jsona = {
        "definition":{
          "name":main_val,
          "description":main_val,
          "level":[parent_name,maxes],
          "definition":[]
        }
      }
    }
    else{
      var jsona = {
        "definition":{
          "name":main_val,
          "description":main_val,
          "level":[parent_name,maxes],
          "stack":{
            "stackAxes":check_emp[1],
            "stackList":[]
          }
        }
      }
    }
    
    for (var a = 0; a < sheet1_datas.length; a++){
      for (var b = 0; b < sheet1_datas[a].length; b++){
        if (sheet1_datas[a][b] != ""){
          var longcal = a
          var largcal = b
          var longc = check_sheet1[0][1]*longcal
          var largc = check_sheet1[0][2]*largcal
          if (check_sheet1[0][0] == "grille"){
            if (sheet1_datas[a][b].indexOf("scale")>-1){
              var split1 = sheet1_datas[a][b].split("(")
              var split2 = split1[1].split(")")
              var sheetname = split1[0].trim()
              var sheetval = split2[0]
            }else{
              var sheetname = sheet1_datas[a][b].trim()
              var sheetval = ""
            }
            jsona.definition.definition.push(getstackvalues(sheet1_datas[a][b],longc,largc,main_val,check_emp,sheetval));
          }else{
            if (sheet1_datas[a][b].indexOf("scale")>-1){
              var split1 = sheet1_datas[a][b].split("(")
              var split2 = split1[1].split(")")
              var sheetname = split1[0].trim()
              var sheetval = split2[0]
            }else{
              var sheetname = sheet1_datas[a][b].trim()
              var sheetval = ""
            }
            jsona.definition.stack.stackList.push(getstackvalues(sheetname,longc,largc,main_val,check_emp[1],sheetval));
          }
        }
      }
    }
  }
  else{
    var jsona = {
      "definition":{
        "subComponant":main_val,
        "level":["patch",maxes],
        "axe":maxes,
        "attributes":[
          {"library":"dynamic_attributes",
           "values":[
             {"_formatversion": 1},
             {"_has_movetool_behaviors": 1},
             {"_lastmodified":"2016-10-03 17:45"},
             {"_lengthunits":"CENTIMETERS"}
            ]
          }
        ]
      }
    }
  }
  return jsona;
}

function getstackvalues(sh1val,long,larg,parent_name,paxes,sval){
  var sheet2 = spreadsheet.getSheetByName(sh1val)
  if (sheet2 != null){
    var s2_lastrow = sheet2.getLastRow();
    var s2_lastcol = sheet2.getLastColumn();
    var s2_assem1 = sheet2.getRange(1, 1).getValue();
    var s2_axes1 = sheet2.getRange(2, 1).getValue();
    var s2_assem2 = sheet2.getRange(2, 1).getValue();
    var s2_axes2 = sheet2.getRange(3, 1).getValue();
    if (s2_assem1 == "assemblage" && s2_axes1.indexOf("empilage")>-1){
      var s2_datas = sheet2.getRange(3, 1, s2_lastrow, s2_lastcol).getValues();
      var axesval = s2_axes1.split(" ")
    }
    else if (s2_assem2 == "assemblage" && s2_axes2.indexOf("empilage")>-1){
      var s2_datas = sheet2.getRange(4, 1, s2_lastrow, s2_lastcol).getValues();
      var axesval = s2_axes2.split(" ")
    }

    if (sval != ""){
      var getval = sval.split(";")
    }

    if (getval != undefined){
      var xval = getval[0].split(":")
      var yval = getval[1].split(":")
      var zval = getval[2].split(":")

      var jsonb = {
        "definition":{
          "name":sh1val,
          "description":sh1val,
          "level":[parent_name,paxes],
          "stack":{
            "stackAxes":axesval[1],
            "stackList":[]
          }
        },
        "transformation":{
          "position":{"x":0,"y":0,"z":0},
          "scale":{"x":xval[1],"y":yval[1],"z":zval[1]}
        }
      }
    }else{
      if (axesval[0] != "empilage"){
        var jsonb = {
          "name":sh1val,
          "description":sh1val,
          "level":[parent_name,paxes],
          "definition":[]
        }
      }else{
        var jsonb = {
          "definition":{
            "name":sh1val,
            "description":sh1val,
            "level":[parent_name,paxes],
            "stack":{
              "stackAxes":axesval[1],
              "stackList":[]
            }
          }
        }
      }
    }
    
    
    
    var sumval = [];
    var assemblage_mur_1 = {RZ:0,x:0,offsetx:0,offsetz:0,z:0};
    var assemblage_mur_2 = {RZ:0,y:0,offsetx:0,offsetz:0,z:0};
    var assemblage_mur_3 = {RZ:0,x:0,offsety:0,offsetz:0,z:0};
    var assemblage_mur_4 = {RZ:0,x:0,y:0,offsety:0,offsetz:0,z:0};
    
    var json_loop = {};
    var sumint = [];
    var summur = [];
    var sumext = [];
    var sumhaut = [];
    var summurext = [];
    var summur1ext = [];
    for (var c = 0; c < s2_datas.length; c++){
      for (var d = 0; d < s2_datas[c].length; d++){
        if (s2_datas[c][d] != ""){
          var split_s2val = s2_datas[c][d].split(",")
          for (var e = 0; e < split_s2val.length; e++){
            var get_s2val = split_s2val[e].split("(");
            //Logger.log(get_s2val[0].trim())
            var sh1 = spreadsheet.getSheetByName(get_s2val[0].trim())
            if (sh1 != null){
              var checksh1 = sh1.getRange(1, 1).getValue()
              if (checksh1.trim() == get_s2val[0].trim()){
                var getsh1 = sh1.getRange(4, 1, s2_lastrow, s2_lastcol).getValues();
                for (var s1 = 0; s1 < getsh1.length; s1++){
                  for (var s2 = 0; s2 < getsh1[s1].length; s2++){
                    if (getsh1[s1][s2] != ""){
                      var gets3 = getsh1[s1][s2].split("(")
                      var sh2 = spreadsheet.getSheetByName(gets3[0].trim())
                      if (sh2 != null){
                        var getsh2 = sh2.getRange(3, 1, s2_lastrow, s2_lastcol).getValues();
                        for (var s3 = 0; s3 < getsh2.length; s3++){
                          if (getsh2[s3][2] == "INT"){
                            // calculate location value for x, y and z
                            sumint.push(parseFloat(getsh2[s3][1]))
                          }else if (getsh2[s3][2] == "EXT"){
                            summur1ext.push(parseFloat(getsh2[s3][1]))
                          }
                          
                          if (gets3[0].indexOf("Mur extérieur")>-1){
                            if (getsh2[s3][2] != ""){
                              summurext.push(parseFloat(getsh2[s3][1]))
                            }
                          }
                        }
                        if (sumint.length != 0){
                          var getarr = sumint.reduce(add, 0)
                          const ARR_VAL = getarr;
                        }
                        if (summur1ext.length != 0){
                          var getarrext = summur1ext.reduce(add,0)
                          const EXTVAL = getarrext;
                        }
                        if (summurext.length != 0){
                          var getarrval = summurext.reduce(add, 0)
                          const SUMMUREXT = getarrval;
                        }
                      }
                      
                      if (gets3[0].indexOf("Mur intérieur")>-1){
                        var get_murext = spreadsheet.getSheetByName(gets3[0].trim())
                        var getme = get_murext.getRange(3, 1, s2_lastrow, s2_lastcol).getValues();
                        for (var p1 = 0; p1 < getme.length; p1++){
                          if (getme[p1][2] == "EXT"){
                            sumext.push(parseFloat(getme[p1][1]))
                          }
                        }
                        if (sumext.length != 0){
                          var getarr = sumext.reduce(add, 0)
                          const MUR_EXT = getarr;
                        }
                      }
                    }
                  }
                }
              }

              if (get_s2val[0].trim() == "Plancher bas 1"){
                var getval = get_s2val[1].split(")")
                var splitval = getval[0].split(";")
                for (var s4 = 0; s4 < splitval.length; s4++){
                  var splitloop = splitval[s4].split(":")
                  var loopkey = splitloop[0]
                  var loopval = splitloop[1]
                  json_loop[loopkey.trim()] = loopval
                  const LOOP_VAL = json_loop;
                }
              }
              
              if (get_s2val[0].indexOf("Plancher bas")>-1){
                var get_plancher = spreadsheet.getSheetByName(get_s2val[0].trim())
                var getpb = get_plancher.getRange(3, 1, s2_lastrow, s2_lastcol).getValues();
                for (var p1 = 0; p1 < getpb.length; p1++){
                  if (getpb[p1][1] != ""){
                    summur.push(parseFloat(getpb[p1][1]))
                  }
                }

                if (summur.length != 0){
                  var getarr = summur.reduce(add, 0)
                  const SUM_MUR = getarr;
                }
              }
              
              if (get_s2val[0].indexOf("Plancher haut")>-1){
                var sum_haut = spreadsheet.getSheetByName(get_s2val[0].trim())
                var getph = sum_haut.getRange(3, 1, s2_lastrow, s2_lastcol).getValues();
                for (var p2 = 0; p2 < getph.length; p2++){
                  if (getph[p2][1] != ""){
                    sumhaut.push(parseFloat(getph[p2][1]))
                  }
                }

                if (sumhaut.length != 0){
                  var getarr = sumhaut.reduce(add, 0)
                  const SUM_HAUT = getarr;
                }
              }
            }
            
            if (get_s2val[0] != "" && get_s2val[0] != "-" && get_s2val[1] != ""){
              if (get_s2val[1] != undefined){
                var get_s2axe = get_s2val[1].replace(")","")
                var loop1 = get_s2axe.split(";")
                for (var l1 = 0; l1 < loop1.length; l1++){
                  var splitl1 = loop1[l1].split(":")
                  if (splitl1[0] == "x"){
                    const GETX = json_loop['LENX'] - getarr - getarr
                  }else if (splitl1[0] == "y"){
                    const GETY = json_loop['LENY'] - getarr - getarr
                  }
                  //Logger.log(GETX+" -- "+GETY)
                }
                //jsonb.definition.stack.stackList.push(jsonstackloop(get_s2val[0].trim(),long,larg,get_s2axe,sh1val,axesval[1]))
              }
            }
          }
        }
      }
    }
    //Logger.log(SUM_MUR)
    sumval.push(SUM_MUR)
    sumval.push(ARR_VAL)
    sumval.push(MUR_EXT)
    //sumval.push(SUMMUREXT)
    //sumval.push(EXTVAL)
    const DIVARR = ARR_VAL + ARR_VAL;
    for (var c = 0; c < s2_datas.length; c++){
      for (var d = 0; d < s2_datas[c].length; d++){
        if (s2_datas[c][d] != ""){
          var split_s2val = s2_datas[c][d].split(",")
          for (var e = 0; e < split_s2val.length; e++){
            var hasharr = [];
            if (split_s2val[e] != "-"){
              var splits2 = split_s2val[e].split("(")          
              var splits3 = splits2[1].split(")")
              var splitcol = splits3[0].split(":")
              
              if (splits2[0].trim() == "Assemblage mur 1"){
                assemblage_mur_1[splitcol[0]] = splitcol[1]
                assemblage_mur_1['x'] = (parseFloat(json_loop['LENX']));
                assemblage_mur_1['offsetx'] = MUR_EXT;
                assemblage_mur_1['offsetz'] = SUM_MUR;
                assemblage_mur_1['y'] = SUMMUREXT;
                assemblage_mur_1['z'] = SUM_MUR;
                hasharr.push(assemblage_mur_1)
              }else if (splits2[0].trim() == "Assemblage mur 2"){
                assemblage_mur_2[splitcol[0]] = splitcol[1]
                assemblage_mur_2['y'] = ((parseFloat(json_loop['LENY']) - DIVARR) + SUMMUREXT);
                assemblage_mur_2['offsetx'] = MUR_EXT;
                assemblage_mur_2['offsetz'] = SUM_MUR;
                assemblage_mur_2['z'] = SUM_MUR;
                assemblage_mur_2['x'] = 0;
                hasharr.push(assemblage_mur_2)
              }else if (splits2[0].trim() == "Assemblage mur 3"){
                assemblage_mur_3[splitcol[0]] = splitcol[1]
                assemblage_mur_3['x'] = ARR_VAL;
                assemblage_mur_3['offsety'] = ARR_VAL;
                assemblage_mur_3['offsetz'] = SUM_MUR;
                assemblage_mur_3['y'] = SUMMUREXT;
                assemblage_mur_3['z'] = SUM_MUR;
                hasharr.push(assemblage_mur_3)
              }else if (splits2[0].trim() == "Assemblage mur 4"){
                assemblage_mur_4[splitcol[0]] = splitcol[1]
                assemblage_mur_4['x'] = (parseFloat(json_loop['LENX']) - ARR_VAL);
                assemblage_mur_4['y'] = ((parseFloat(json_loop['LENY']) - DIVARR) + SUMMUREXT);
                assemblage_mur_4['offsety'] = ARR_VAL;
                assemblage_mur_4['offsetz'] = SUM_MUR;
                assemblage_mur_4['z'] = SUM_MUR;
                hasharr.push(assemblage_mur_4)
              }else{
                var lo1 = splits2[1].split(")")
                if (splits2[0].indexOf("Plancher bas")>-1){
                  var insertval = lo1[0].split(";")
                  var planarr = [];
                  for (var a = 0; a < insertval.length; a++){
                    var updateval = insertval[a].split(":")
                    if (updateval[0] == "z"){
                      var arrkey = updateval[0]
                      var arrval = SUM_MUR;
                    }else{
                      var arrkey = updateval[0]
                      var arrval = updateval[1]
                    }
                    planarr.push(arrkey+":"+arrval)
                  }
                  var split_com = planarr.join(";")+";"+"x"+":"+json_loop['LENX']+";"+"y"+":"+EXTVAL
                }else if (splits2[0].indexOf("Plancher haut")>-1){
                  var getsum = +json_loop['height'] + +SUM_HAUT + +SUM_MUR;
                  var split_com = lo1[0]+";"+"z"+":"+getsum+";"+"y"+":"+EXTVAL+";"+"x"+":"+json_loop['LENX']
                }else{
                  var get_height = getHeightFromhaut(parent_name,sh1val,lo1[0])
                  if (splits2[0].indexOf("BOT")>-1){
                    var split_com = lo1[0]+";"+"x"+":"+get_height['x']+";"+"z"+":"+get_height['z']+";"+"LENZ"+":"+get_height['lenz']
                  }else if (splits2[0].indexOf("TOP")>-1){
                    var split_com = lo1[0]+";"+"x"+":"+get_height['x']+";"+"z"+":"+get_height['sumz']+";"+"LENZ"+":"+get_height['lenz']
                  }else{
                    var split_com = lo1[0]
                  }
                }
                hasharr.push(split_com)
              }
              jsonb.definition.stack.stackList.push(jsonstackloop(splits2[0].trim(),long,larg,hasharr,sh1val,axesval[1],sumval))
            }
          }
        }
      }
    }
  }
  else{
    var jsonb = {
      "definition":{
        "subComponant":sh1val,
        "level":[parent_name,paxes],
        "axe":"x",
        "attributes":[
          {"library":"dynamic_attributes",
           "values":[
             {"_formatversion": 1},
             {"_has_movetool_behaviors": 1},
             {"_lastmodified":"2016-10-03 17:45"},
             {"_lengthunits":"CENTIMETERS"}
            ]
          }
        ]
      }
    }
  }
  return jsonb;
}

function getHeightFromhaut(pname,sname,att){
  var checkparent = spreadsheet.getSheetByName(pname.trim())
  var lastrow = checkparent.getLastRow();
  var lastcol = checkparent.getLastColumn();
  var datas = checkparent.getRange(3, 1).getValue();
  var checksubparent = spreadsheet.getSheetByName(datas.trim())
  var datas1 = checksubparent.getRange(4, 1, lastrow, lastcol).getValues();
  
  var json_loop1 = {};
  var json_loop = {};
  var sumhaut = [];
  for (var i = 0; i < datas1.length; i++){
    for (var j = 0; j < datas1[i].length; j++){
      var getname = datas1[i][j].split(",")
      if (getname.length != 1){
        for (var k = 0; k < getname.length; k++){
          var splitname = getname[k].split("(")
          if (splitname[0].indexOf("Plancher bas")>-1){
            var getval = splitname[1].split(")")
            var splitval = getval[0].split(";")
            for (var s4 = 0; s4 < splitval.length; s4++){
              var splitloop = splitval[s4].split(":")
              var loopkey = splitloop[0]
              var loopval = splitloop[1]
              json_loop[loopkey.trim()] = loopval
            }
          }
          
          if (splitname[0].indexOf("Plancher haut")>-1){
            var sum_haut = spreadsheet.getSheetByName(splitname[0].trim())
            var getph = sum_haut.getRange(3, 1, lastrow, lastcol).getValues();
            for (var p2 = 0; p2 < getph.length; p2++){
              if (getph[p2][1] != ""){
                sumhaut.push(parseFloat(getph[p2][1]))
              }
            }
            
            if (sumhaut.length != 0){
              var getarr = sumhaut.reduce(add, 0)
              const SUM_HAUT = getarr;
            }
          }
        }
      }
    }
  }
  var getsum = +json_loop['height'] + +SUM_HAUT + +json_loop['z'];
  var split_com = "z"+":"+getsum+";"+"x"+":"+0
  json_loop1['sumz'] = getsum
  json_loop1['z'] = json_loop['z']
  //json_loop1['x'] = 0
  json_loop1['lenz'] = SUM_HAUT

  return json_loop1;
}

function jsonstackloop(sh2val,long,larg,tval,parent_name,axes,sumval){
  //Logger.log(sh2val+" - "+tval)
  var sheet3 = spreadsheet.getSheetByName(sh2val)
  if (sheet3 != null){
    var s3_lastrow = sheet3.getLastRow();
    var s3_lastcol = sheet3.getLastColumn();
    var s3_assem1 = sheet3.getRange(1, 1).getValue();
    var s3_axes1 = sheet3.getRange(2, 1).getValue();
    var s3_assem2 = sheet3.getRange(2, 1).getValue();
    var s3_axes2 = sheet3.getRange(3, 1).getValue();
    
    if (s3_assem1 == "assemblage" && s3_axes1.indexOf("empilage")>-1){
      var s3_datas = sheet3.getRange(3, 1, s3_lastrow, s3_lastcol).getValues();
      var axesval = s3_axes1.split(" ")
    }
    else if (s3_assem2 == "assemblage" && s3_axes2.indexOf("empilage")>-1){
      var s3_datas = sheet3.getRange(4, 1, s3_lastrow, s3_lastcol).getValues();
      var axesval = s3_axes2.split(" ")
    }
    
    var jsonc = {
      "definition":{
        "name":sh2val,
        "description":sh2val,
        "level":[parent_name,axes],
        "attributes":[
          {"library":"dynamic_attributes",
           "values":[
             {"_formatversion": 1},
             {"_has_movetool_behaviors": 1},
             {"_lastmodified":"2016-10-03 17:45"},
             {"_lengthunits":"CENTIMETERS"}
            ]
          }
        ],
        "stack":{
          "stackAxes":axesval[1],
          "stackList":[]
        }
      }
    }

    var json_val = {}
    var tval11 = JSON.stringify(tval[0]).toString();
    if (sh2val.indexOf("Plancher")>-1){
      var replaceval = tval11.replace(/"/g, "")
      var split_tval1 = replaceval.split(";")
      var split_tval = split_tval1
    }else{
      var split_tval1 = tval11.split("{")
      var split_tval2 = split_tval1[1].split("}")
      var split_tval = split_tval2[0].split(",")
    }
    if (split_tval.length <= 1){
      for (var ta = 0; ta < split_tval.length; ta++){
        var push_val = split_tval[ta].split(":")
        json_val[push_val[0].trim()] = push_val[1].trim()
      }
      jsonc.definition.attributes[0].values.push(json_val)
    }
    else{
      for (var tb = 0; tb < split_tval.length; tb++){
        var json_more = {}
        var push_val = split_tval[tb].split(":")
        if (push_val[0].indexOf("LENX")>-1){
          var push_key = "LenX"
        }else if (push_val[0].indexOf("LENY")>-1){
          var push_key = "LenY"
        }else if (push_val[0].indexOf("LENZ")>-1){
          var push_key = "LenZ"
        }else{
          var push_key = push_val[0]
        }
        json_more[push_key.trim().replace(/"/g, "")] = push_val[1].replace(/"/g, "")
        jsonc.definition.attributes[0].values.push(json_more)
      }
    }
    
    if (split_tval[6] != undefined){
      var offy = split_tval[6].split(":")
      var offsety = offy[1]
    }
    if (split_tval[7] != undefined){
      var offz = split_tval[7].split(":")
      var offsetz = offz[1].replace(/"/g, "")
    }
    
    var mur_exterier = {};
    var murarr = [];
    
    for (var f = 0; f < s3_datas.length; f++){
      var murarr1 = [];
      if (sh2val.indexOf("Plancher")>-1){
        if (s3_datas[f][0] != ""){
          if (offsety != undefined && offsetz != undefined){
            var v1 = split_tval[0]+";"+split_tval[1]+";"+ "len"+axesval[1]+":"+s3_datas[f][1]+";"+"offsety:"+offsety+";"+"offsetz:"+offsetz
          }else{
            var v1 = split_tval+","+ "len"+axesval[1]+":"+s3_datas[f][1]
          }
        }
        if (s3_datas[f][0] != ""){
          murarr1.push(v1)
          jsonc.definition.stack.stackList.push(getjsonloop(s3_datas[f][0].trim(),long,larg,murarr1,sh2val,axesval[1],axes,s3_datas[f][2]))
        }
      }else{
        for (var f1 = 0; f1 < s3_datas[f].length; f1++){
          if (s3_datas[f][f1] != ""){
            var get_s3val = s3_datas[f][f1].toString().split("(")
            var get_s3axe = get_s3val[1].replace(")","")
            var split_axe = get_s3axe.split(";")
            for (var f2 = 0; f2 < split_axe.length; f2++){
              var split_col = split_axe[f2].split(":")
              if (get_s3val[0].indexOf("Mur extérieur")>-1){
                mur_exterier[split_col[0]] = split_col[1]
                mur_exterier['offsetx'] = sumval[2]
                mur_exterier['offsetz'] = sumval[0]
              }else if (get_s3val[0].indexOf("Mur intérieur")>-1){
                mur_exterier[split_col[0]] = split_col[1]
                mur_exterier['offsetx'] = sumval[1]
                mur_exterier['offsetz'] = sumval[0]
              }else{
                mur_exterier[split_col[0]] = split_col[1]
              }
            }
            murarr.push(mur_exterier)
            jsonc.definition.stack.stackList.push(getjsonloop(get_s3val[0].trim(),long,larg,murarr,sh2val,axesval[1],axes,s3_datas[f][3]))
          }
        }
      }
    }
  }
  else{
    if (tval != ""){
      var jsonc = {
        "definition":{
          "subComponant":sh2val,
          "level":[parent_name,axes],
          "axe":axes,
          "attributes":[
            {"library":"dynamic_attributes",
             "values":[
               {"_formatversion": 1},
               {"_has_movetool_behaviors": 1},
               {"_lastmodified":"2016-10-03 17:45"},
               {"_lengthunits":"CENTIMETERS"}
             ]
            }
          ]
        }
      }
    }else{
      var jsonc = {
        "definition":{
          "subComponant":sh2val,
          "level":[parent_name,axes],
          "axe":axes,
          "transformation":{
            "position":{"xyz":[0,0,0],"unit":"mm"}
          }
        }
      }
    }
    
    var pasheet = spreadsheet.getSheetByName(parent_name)
    var subaxes = pasheet.getRange(2, 1).getValue();
    var split_sub = subaxes.split(" ")
    //Logger.log(sh2val+" - "+tval)
    var json_val = {}
    var split_tval = tval.toString().split(";")
    if (split_tval.length <= 1){
      for (var ta = 0; ta < split_tval.length; ta++){
        var push_val = split_tval[ta].split(":")
        json_val[push_val[0].trim()] = push_val[1].trim()
      }
      jsonc.definition.attributes[0].values.push(json_val)
    }
    else{
      for (var tb = 0; tb < split_tval.length; tb++){
        var json_more = {}
        var push_val = split_tval[tb].split(":")
        if ((push_val[0].indexOf("LENX")>-1) || (push_val[0].indexOf("lenx")>-1)){
          var push_key = "LenX"
          if (split_sub[1] == "x" || split_sub[1] == "y" || split_sub[1] == "z"){
            var push_value = push_val[1]
          }else{
            var push_value = "parent!lenx"
          }
          
        }else if ((push_val[0].indexOf("LENY")>-1) || (push_val[0].indexOf("leny")>-1)){
          var push_key = "LenY"
          if (split_sub[1] == "x" || split_sub[1] == "y" || split_sub[1] == "z"){
            var push_value = push_val[1]
          }else{
            var push_value = "parent!leny"
          }
        }else if ((push_val[0].indexOf("LENZ")>-1) || (push_val[0].indexOf("lenz")>-1)){
          var push_key = "LenZ"
          if (split_sub[1] == "x" || split_sub[1] == "y" || split_sub[1] == "z"){
            var push_value = push_val[1]
          }else{
            var push_value = "parent!lenz"
          }
        }else if ((push_val[0] == "x" || push_val[0] == "y" || push_val[0] == "z") && parent_name.indexOf("circulation")>-1){
          var push_key = push_val[0]
          var push_value = push_val[1]
        }else{
          var push_key = ""
        }
        if (push_key != ""){
          json_more[push_key.trim().replace(/"/g, "")] = push_value.replace(/"/g, "")
          jsonc.definition.attributes[0].values.push(json_more)
        }
      }
    }
  }
  return jsonc;
}

function getjsonloop(sh3val,long,larg,tval1,parent_name,axes,paxes,intext){
  var sheet4 = spreadsheet.getSheetByName(sh3val)
  if (sheet4 != null){
    var s4_lastrow = sheet4.getLastRow();
    var s4_lastcol = sheet4.getLastColumn();
    var s4_assem1 = sheet4.getRange(1, 1).getValue();
    var s4_axes1 = sheet4.getRange(2, 1).getValue();
    var s4_assem2 = sheet4.getRange(2, 1).getValue();
    var s4_axes2 = sheet4.getRange(3, 1).getValue();
    
    if (s4_assem1 == "assemblage" && s4_axes1.indexOf("empilage")>-1){
      var s4_datas = sheet4.getRange(3, 1, s4_lastrow, s4_lastcol).getValues();
      var axesval = s4_axes1.split(" ")
    }
    else if (s4_assem2 == "assemblage" && s4_axes2.indexOf("empilage")>-1){
      var s4_datas = sheet4.getRange(4, 1, s4_lastrow, s4_lastcol).getValues();
      var axesval = s4_axes2.split(" ")
    }

    var jsond = {
      "definition":{
        "name":sh3val,
        "description":sh3val,
        "level":[parent_name,paxes],
        "attributes":[
          {"library":"dynamic_attributes",
           "values":[
             {"_formatversion": 1},
             {"_has_movetool_behaviors": 1},
             {"_lastmodified":"2016-10-03 17:45"},
             {"_lengthunits":"CENTIMETERS"}
            ]
          }
        ],
        "stack":{
          "stackAxes":axesval[1],
          "stackList":[]
        }
      }
    }
    
    var tval12 = JSON.stringify(tval1[0]).toString();
    var split_tval1 = tval12.split("{")
    var split_tval2 = split_tval1[1].split("}")
    var split_tval = split_tval2[0].split(",")
    if (split_tval.length > 1 ){
      for (var tc = 0; tc < split_tval.length; tc++){
        var json_sh3 = {}
        var push_val = split_tval[tc].split(":")
        if (push_val[0].indexOf("LENX")>-1){
          var push_key = "LenX"
        }else if (push_val[0].indexOf("LENY")>-1){
          var push_key = "LenY"
        }else if (push_val[0].indexOf("LENZ")>-1){
          var push_key = "LenZ"
        }else{
          var push_key = push_val[0]
        }
        json_sh3[push_key.trim().replace(/"/g, "")] = push_val[1].replace(/"/g, "")
        jsond.definition.attributes[0].values.push(json_sh3)
      }
    }
    
    var subarray = [];
    var subarr = {};
    for (var h = 0; h < s4_datas.length; h++){
      var s1 = s4_datas[h][0].trim()
      if (s1 != ""){
        if (s4_datas[h][2].trim() == "EXT"){
          
          for (var sp = 0; sp < split_tval.length; sp++){
            var splitsp = split_tval[sp].split(":")
            var split_axe = s4_datas[h][3].split(";")
            for (var sa = 0; sa < split_axe.length; sa++){
              var splitsv = split_axe[sa].split(":")
              if (splitsv[0] == splitsp[0].replace(/"/g, "")){
                subarr[splitsp[0].replace(/"/g, "")] = splitsv[1]
              }
            }
            subarr["len"+axesval[1]] = s4_datas[h][1]
          }
          subarray.push(subarr);
          jsond.definition.stack.stackList.push(getlastjson(s1,long,larg,subarray,sh3val,axesval[1],axes,s4_datas[h][2].trim()))
        }else{
          var v1 = split_tval[0]+";"+split_tval[3]+";"+"len"+axesval[1]+":"+s4_datas[h][1]+";"+split_tval[1]+";"+split_tval[2]
          jsond.definition.stack.stackList.push(getlastjson(s1,long,larg,v1,sh3val,axesval[1],axes,s4_datas[h][2].trim()))
        }
      }
    }
  }
  else{
    if (tval1 != ""){
      var jsond = {
        "definition":{
          "subComponant":sh3val,
          "level":[parent_name,paxes],
          "axe":axes,
          "attributes":[
            {"library":"dynamic_attributes",
             "values":[
               {"_formatversion": 1},
               {"_has_movetool_behaviors": 1},
               {"_lastmodified":"2016-10-03 17:45"},
               {"_lengthunits":"CENTIMETERS"}
             ]
            }
          ]
        }
      }
      
      var pasheet = spreadsheet.getSheetByName(parent_name)
      var subaxes = pasheet.getRange(2, 1).getValue();
      var split_sub = subaxes.split(" ")
      
      var tval11 = JSON.stringify(tval1[0]).toString();
      if (parent_name.indexOf("Plancher")>-1){
        var split_tval = tval11.split(",")
      }else{
        var split_tval1 = tval11.split("{")
        var split_tval2 = split_tval1[1].split("}")
        var split_tval = split_tval2[0].split(",")
      }
      
      if (split_tval.length > 1 ){
        for (var tc = 0; tc < split_tval.length; tc++){
          var json_sh3 = {}
          var push_val = split_tval[tc].split(":")
          var pushkey = push_val[0].replace(/"/g, "")
          var pushval = push_val[1].replace(/"/g, "")
          
          if (parent_name.indexOf("Plancher")>-1){
            if ((pushkey.indexOf("LENX")>-1) || (pushkey.indexOf("lenx")>-1)){
              var push_key = "LenX"
              if (split_sub[1] == "x"){
                var push_value = pushval
              }else{
                var push_value = "parent!lenx"
              }
            }else if ((pushkey.indexOf("LENY")>-1) ||(pushkey.indexOf("leny")>-1)){
              var push_key = "LenY"
              if (split_sub[1] == "y"){
                var push_value = pushval
              }else{
                var push_value = "parent!leny"
              }
            }else if ((pushkey.indexOf("LENZ")>-1) || (pushkey.indexOf("lenz")>-1)){
              var push_key = "LenZ"
              if (split_sub[1] == "z"){
                var push_value = pushval
              }else{
                var push_value = "parent!lenz"
              }
            }else{
              var push_key = ""
            }
          }else{
            if (pushkey.indexOf("offset")>-1){
              var push_key = ""
              var push_value = ""
            }else{
              if (pushkey.indexOf("LENX")>-1){
                var push_key = "LenX"
              }else if (pushkey.indexOf("LENY")>-1){
                var push_key = "LenY"
              }else if (pushkey.indexOf("LENZ")>-1){
                var push_key = "LenZ"
              }else{
                var push_key = pushkey
              }
              var push_value = pushval
            }
          }

          if (push_key != ""){
            json_sh3[push_key.trim()] = push_value
            jsond.definition.attributes[0].values.push(json_sh3)
          }
        }
      }else{
        var json_val = {}
        for (var ta = 0; ta < split_tval.length; ta++){
          var push_val = split_tval[ta].split(":")
          json_val[push_val[0]] = push_val[1]
        }
        jsond.definition.attributes[0].values.push(json_val)
      }
      
      
    }else{
      var jsond = {
        "definition":{
          "subComponant":sh3val,
          "level":[parent_name,paxes],
          "axe":axes
        }
      }
    } 
  }
  return jsond;
}

function getlastjson(sh4val,long,larg,tval2,parent_name,axes,paxes,intext){
  var sheet5 = spreadsheet.getSheetByName(sh4val)
 
  if (sheet5 != null){
  }
  else{
    var jsone = {
      "definition":{
        "subComponant":sh4val,
        "level":[parent_name,paxes],
        "axe":axes,
        "attributes":[
          {
            "library":"dynamic_attributes",
            "values":[
              {"_formatversion": 1},
              {"_has_movetool_behaviors": 1},
              {"_lastmodified":"2016-10-03 17:45"},
              {"_lengthunits":"CENTIMETERS"}
            ]
          }
        ]
      }
    }
    var pasheet = spreadsheet.getSheetByName(parent_name)
    var subaxes = pasheet.getRange(2, 1).getValue();
    var split_sub = subaxes.split(" ")
    
    if (intext == "INT"){
      var tval11 = tval2
      var split_tval = tval11.split(";")
    }else{
      var tval11 = JSON.stringify(tval2[0]).toString();
      var split_tval1 = tval11.split("{")
      var split_tval2 = split_tval1[1].split("}")
      var split_tval = split_tval2[0].split(",")
    }

    if (split_tval.length > 1 ){
      for (var tc = 0; tc < split_tval.length; tc++){
        var json_sh4 = {}
        var push_val = split_tval[tc].split(":")
        push_val[0] = push_val[0].replace(/"/g, "")
        if (push_val[0] != undefined){
          push_val[0] = push_val[0].replace(/"/g, "")
          if ((push_val[0].indexOf("LENX")>-1) || (push_val[0].indexOf("lenx")>-1)){
            var push_key = "LenX"
            if (intext == "INT"){
              if (split_sub[1] == "x"){
                var push_value = push_val[1]
              }else{
                var push_value = "parent!lenx"
              }
            }else{
              var push_value = push_val[1]
            }
          }else if ((push_val[0].indexOf("LENY")>-1) || (push_val[0].indexOf("leny")>-1)){
            var push_key = "LenY"
            if (intext == "INT"){
              if (split_sub[1] == "y"){
                var push_value = push_val[1]
              }else{
                var push_value = "parent!leny"
              }
            }else{
              var push_value = push_val[1]
            }
          }else if ((push_val[0].indexOf("LENZ")>-1) || (push_val[0].indexOf("lenz")>-1)){
            var push_key = "LenZ"
            if (intext == "INT"){
              if (split_sub[1] == "z"){
                var push_value = push_val[1]
              }else{
                var push_value = "parent!lenz"
              }
            }else{
              var push_value = push_val[1]
            }
          }else if (((push_val[0] == "x") || (push_val[0] == "y") || (push_val[0] == "z")) && intext == "EXT"){
            var push_key = push_val[0]
            var push_value = push_val[1]
          }else{
            var push_key = ""
          }
          if (push_key != ""){
            json_sh4[push_key.trim().replace(/"/g, "")] = push_value.replace(/"/g, "")
            //Logger.log(json_sh4)
            jsone.definition.attributes[0].values.push(json_sh4)
          }
        }
      }
    }
    
  }
  return jsone;
}

function add(a,b){
  return a + b;
}