let guests=[];
let templateText="";

fetch("template.txt")
.then(r=>r.text())
.then(t=>templateText=t);

document.getElementById("excel").addEventListener("change",function(e){
const reader=new FileReader();
reader.onload=function(evt){
const wb=XLSX.read(evt.target.result,{type:"binary"});
const sheet=wb.Sheets[wb.SheetNames[0]];
const rows=XLSX.utils.sheet_to_json(sheet,{header:1});
guests = rows.slice(1).map(r=>({
    name:r[0],
    number:r[1],
    type:r[2]
}));
alert("Loaded "+guests.length+" guests");
}
reader.readAsBinaryString(e.target.files[0]);
});

function generate(){
let dateDay=document.getElementById("dateDay").value;
let likhtan=document.getElementById("likhtan").value;
let venue=document.getElementById("venue").value;
let map=document.getElementById("mapLink").value;
let pdf=document.getElementById("pdfLink").value;

let html="";

guests.forEach((g,i)=>{
let msg=templateText
.replace("{{NAME}}",g.name)
.replace("{{DATE_DAY}}",dateDay)
.replace("{{INVITATION_TYPE}}",g.type)
.replace("{{LIKHTAN}}",likhtan)
.replace("{{VENUE}}",venue)
.replace("{{MAP_LINK}}",map)
.replace("{{PDF_LINK}}",pdf);

let link="https://wa.me/91"+g.number+"?text="+encodeURIComponent(msg);

html+=`<div class="row">
${i+1}. ${g.name} — <a target="_blank" href="${link}">Send WhatsApp</a>
</div>`;
});

document.getElementById("list").innerHTML=html;
}
