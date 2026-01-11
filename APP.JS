let guests=[];
let template="";

fetch("template.txt",{cache:"no-store"})
.then(r=>r.text())
.then(t=>template=t);

document.getElementById("excel").addEventListener("change",function(e){
const reader=new FileReader();
reader.onload=function(evt){
const wb=XLSX.read(evt.target.result,{type:"binary"});
const sheet=wb.Sheets[wb.SheetNames[0]];
const rows=XLSX.utils.sheet_to_json(sheet,{header:1});
guests = rows.slice(1).map(r=>({
 name:r[0],
 number:String(r[1]),
 type:r[2],
 sent:false
}));
alert("Loaded "+guests.length+" guests");
}
reader.readAsBinaryString(e.target.files[0]);
});

function generate(){
const table=document.getElementById("table");
table.innerHTML="<tr><th>#</th><th>Name</th><th>Number</th><th>Status</th><th>Action</th></tr>";

guests.forEach((g,i)=>{
const row=table.insertRow();
row.id="row"+i;
row.innerHTML=`
<td>${i+1}</td>
<td>${g.name}</td>
<td>${g.number}</td>
<td id="status${i}">Pending</td>
<td><button onclick="send(${i})">Send</button></td>
`;
});
updateStats();
}

function send(i){
const g=guests[i];

let msg=template
.replace("{{NAME}}",g.name)
.replace("{{DATE_DAY}}",document.getElementById("dateDay").value)
.replace("{{INVITATION_TYPE}}",g.type)
.replace("{{LIKHTAN}}",document.getElementById("likhtan").value)
.replace("{{VENUE}}",document.getElementById("venue").value)
.replace("{{MAP_LINK}}",document.getElementById("mapLink").value);

const link="https://wa.me/91"+g.number+"?text="+encodeURIComponent(msg);
window.open(link,"_blank");

g.sent=true;
document.getElementById("status"+i).innerText="Sent";
document.getElementById("row"+i).className="sent";
updateStats();
}

function updateStats(){
const total=guests.length;
const sent=guests.filter(g=>g.sent).length;
const pending=total-sent;

document.getElementById("stats").innerHTML=
"Total Guests: "+total+" | Sent: "+sent+" | Pending: "+pending;
}
