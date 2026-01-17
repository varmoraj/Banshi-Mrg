let guests=[];
let templateText="";

/* Load Template */
fetch("template.txt",{cache:"no-store"})
.then(r=>r.text())
.then(t=>{ templateText=t; updatePreview(); });

function applyVars(g){
 return templateText
 .replace("{{NAME}}", g?.name||"")
 .replace("{{INVITATION_TYPE}}", g?.type||"");
}

/* Excel Upload */
document.getElementById("excel").addEventListener("change",e=>{
 const reader=new FileReader();
 reader.onload=evt=>{
 const wb=XLSX.read(evt.target.result,{type:"binary"});
 const rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1});
 rows.slice(1).forEach(r=>{
  guests.push({name:r[0],number:String(r[1]),type:r[2],sent:false});
 });
 render();
 }
 reader.readAsBinaryString(e.target.files[0]);
});

/* Manual Add */
function addManual(){
 const name=mName.value.trim();
 const number=mNumber.value.trim();
 const type=mType.value.trim();
 if(!name || number.length!==10){alert("Valid details નાખો");return;}
 guests.push({name,number,type,sent:false});
 mName.value=mNumber.value=mType.value="";
 render();
}

/* Render Table */
function render(){
 table.innerHTML=`<tr>
<th>#</th><th>Name</th><th>Mobile</th>
<th>Invite Type</th><th>Status</th><th>Send</th>
</tr>`;
 guests.forEach((g,i)=>{
 table.innerHTML+=`
 <tr class="${g.sent?"sent":""}">
 <td>${i+1}</td><td>${g.name}</td><td>${g.number}</td>
 <td>${g.type}</td>
 <td>${g.sent?"Sent":"Pending"}</td>
 <td><button onclick="send(${i})">Send</button></td>
 </tr>`;
 });
 updateStats();
 updatePreview();
}

/* Send WhatsApp */
function send(i){
 const g=guests[i];
 const msg=applyVars(g);
 window.open("https://wa.me/91"+g.number+"?text="+encodeURIComponent(msg),"_blank");
 g.sent=true;
 render();
}

/* Preview */
function updatePreview(){
 if(guests[0])
  preview.textContent=applyVars(guests[0]);
}

/* Stats */
function updateStats(){
 stats.innerText=`Total: ${guests.length} | Sent: ${guests.filter(g=>g.sent).length}`;
}
