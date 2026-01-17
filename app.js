let guests=[];

const template = `સ્નેહી શ્રી :
*{{NAME}}*

જીવનના સૌથી પવિત્ર અને સ્મરણિય પળોમાંથી એક ક્ષણ
અમારા પરિવારના આંગણે આવી રહી છે…

વરમોરા પરિવારની લાડકી દીકરી *બંસી (ગોપી)*
તા. *20-01-2026, મંગળવાર* ના રોજ
તેના લગ્નજીવન તરફ પાવન પગલું મૂકવા જઈ રહી છે.

આ પાવન લગ્નોત્સવના રીસેપ્શન પ્રસંગે *{{INVITATION_TYPE}}* ને પધારવા,
હાર્દિક નિમંત્રણ પાઠવીએ છીએ.

:શુભ સ્થળ:
Imperial Party Lawns
https://maps.app.goo.gl/PDALZHJzZpgkvguR6

ઇન્વિટેશન મળતા OK નો મેસેજ કરશો.`;

function applyVars(g){
 return template
 .replace("{{NAME}}", g.name)
 .replace("{{INVITATION_TYPE}}", g.type);
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

 if(!name || number.length!==10){alert("Valid data નાખો");return;}

 guests.push({name,number,type,sent:false});
 mName.value=mNumber.value=mType.value="";
 render();
}

function render(){
 table.innerHTML=`<tr>
<th>#</th><th>Name</th><th>Mobile</th>
<th>Invite Type</th><th>Status</th><th>Send</th>
</tr>`;
 guests.forEach((g,i)=>{
 table.innerHTML+=`
 <tr id="r${i}">
 <td>${i+1}</td><td>${g.name}</td><td>${g.number}</td>
 <td>${g.type}</td>
 <td>${g.sent?"Sent":"Pending"}</td>
 <td><button onclick="send(${i})">Send</button></td>
 </tr>`;
 });
 updatePreview();
 updateStats();
}

function send(i){
 const g=guests[i];
 const msg=applyVars(g);
 window.open("https://wa.me/91"+g.number+"?text="+encodeURIComponent(msg),"_blank");
 g.sent=true;
 render();
}

function updatePreview(){
 if(guests[0])
 preview.textContent=applyVars(guests[0]);
}

function updateStats(){
 stats.innerText=`Total: ${guests.length} | Sent: ${guests.filter(g=>g.sent).length}`;
}
