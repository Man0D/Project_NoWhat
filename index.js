document.onreadystatechange = function () {
  if(document.readyState === "complete"){
    //validateForm();
  }
}


function validateForm(url,pageNum) {
  var x = document.getElementById("search_bar");
  var dateStart = document.getElementById("StartDate");
  var dateEnd = document.getElementById("EndDate");
  if(dateStart.value == null || dateStart.value == ""){
    dateStart.value = new Date().toISOString().split("T")[0];
  }
  var DevHelAPI = url;
  $.getJSON( DevHelAPI, {
    //format: "json",
    page: pageNum,
    text: x.value,
    start: dateStart.value,
    end: dateEnd.value,
    sort: "start_time"
  })
    .done(function( data ) {
      var y = document.getElementById("search_result");
      y.style.display = "inline-block";
      y.innerHTML = "\n number of event found :"+ data.meta.count +"<br><br>";
      console.log(data);
      data.data.forEach(RenderingDataFromSearch);
      pageNum+=1;
      $('#search_result').append("<input id=\"button_search\" type=\"button\" value=\"next\" onclick=\"validateForm('https://api.hel.fi/linkedevents/v1/event/',"+pageNum+")\">");
    });
}

function LookForEvent(url){
  console.log("hEYYYYY");
  $.getJSON( url, {
    format: "json",
  })
    .done(function( data ) {
      console.log(data);
      renderingDataSingleEvent(data);
    });
}

function renderingDataSingleEvent(data){
  var y = document.getElementById("search_result");
  y.style.display = "inline-block";

  var name = data.name.fi;
  y.innerHTML = name;
}

function RenderingDataFromSearch(element, index, array){
  var y = document.getElementById("search_result");
  var newContent = document.createElement('div');

  if(element.name.en == undefined) var name = element.name.fi;
  else var name = element.name.en;
  if(element.start_time == undefined) var startTime = "No Information";
  else { var d = new Date(); d.setTime(Date.parse(element.start_time)); var startTime = d.toDateString(); }

  index +=1 ;

  var link = element["@id"] ;

  newContent.innerHTML = "<div id=\"event_"+ index +"\" onClick=\"LookForEvent(\'"+link+"\')\"><h4>"+ index + ": " + name +"</h4>Start Time: "+ startTime +"</div><br>";

  while(newContent.firstChild){
    y.appendChild(newContent.firstChild);
  }
}


function traitementData(element, index, array){
  var y = document.getElementById("search_result");
  var newContent = document.createElement('div');

  if(element.name.en == undefined) var name = element.name.fi;
  else var name = element.name.en;

  if(element.street_address != null){
    if(element.street_address.en == undefined) var address = element.street_address.fi;
    else var address = element.street_address.en;
  }

  if(element.address_locality != null){
    if(element.address_locality.en == undefined) var city = element.address_locality.fi;
    else var city = element.address_locality.en;
  }
  if(element.telephone != null ) var phone = element.telephone.fi;
  else var phone = "none";
  if(element.email != null) var email = element.email;
  else var email = "none";

  if(element.description != null){
    if(element.description.en == undefined) var description = element.description.fi;
    else var description = element.description.en;
  }else var description = "none";

  if(element.position != null)  var pos = element.position.coordinates;
  else var pos = ["null", "null"];
  index +=1 ;

  newContent.innerHTML = "<div><h4>"+ index + ": " + name +"</h4><b>description:</b> " + description + "<br><b>Address:</b>"+ address +", "
    + city + "<br>latitude:" + pos['1'] + " longitude:" + pos[0] +"<br><b>Contact Information</b>:<br>Phone:" + phone +" email : "+ email +"</div><br>";

  while(newContent.firstChild){
    y.appendChild(newContent.firstChild);
  }
}
